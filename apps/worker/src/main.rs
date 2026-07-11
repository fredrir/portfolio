use std::time::Duration;

use aws_sdk_sqs::types::Message;
use portfolio_worker::events::{S3EventMessage, S3Record};
use portfolio_worker::processor::{ProcessError, process_image};
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use uuid::Uuid;

const ORIGINALS_PREFIX: &str = "originals/";
const MAX_ORIGINAL_BYTES: usize = 30 * 1024 * 1024;
const PROCESSING_TIMEOUT: Duration = Duration::from_secs(90);
const MAX_RECEIVE_COUNT: i32 = 5;

#[derive(Clone)]
struct Ctx {
    pool: PgPool,
    s3: aws_sdk_s3::Client,
    sqs: aws_sdk_sqs::Client,
    bucket: String,
    queue_url: String,
}

#[derive(Debug)]
enum WorkerError {
    /// Retrying cannot succeed; the media is marked failed and the message
    /// is deleted.
    Permanent(String),
    /// Worth retrying; the message stays on the queue and the DLQ redrive
    /// policy bounds the attempts.
    Transient(String),
}

impl From<sqlx::Error> for WorkerError {
    fn from(err: sqlx::Error) -> Self {
        Self::Transient(format!("database: {err}"))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()),
        )
        .init();

    let database_url = std::env::var("DATABASE_URL").map_err(|_| "DATABASE_URL is not set")?;
    let pool = PgPoolOptions::new()
        .max_connections(3)
        .connect(&database_url)
        .await?;

    let aws_config = aws_config::defaults(aws_config::BehaviorVersion::latest())
        .load()
        .await;
    let mut s3_builder = aws_sdk_s3::config::Builder::from(&aws_config);
    if std::env::var("AWS_ENDPOINT_URL").is_ok() {
        s3_builder = s3_builder.force_path_style(true);
    }

    let ctx = Ctx {
        pool,
        s3: aws_sdk_s3::Client::from_conf(s3_builder.build()),
        sqs: aws_sdk_sqs::Client::new(&aws_config),
        bucket: std::env::var("MEDIA_BUCKET").unwrap_or_else(|_| "portfolio-media-dev".into()),
        queue_url: std::env::var("MEDIA_QUEUE_URL").map_err(|_| "MEDIA_QUEUE_URL is not set")?,
    };

    tracing::info!(queue = %ctx.queue_url, bucket = %ctx.bucket, "worker started");

    if std::env::var("CV_SYNC_DISABLED").is_err() {
        let poll = std::env::var("CV_POLL_SECONDS")
            .ok()
            .and_then(|v| v.parse().ok())
            .unwrap_or(21_600);
        tokio::spawn(portfolio_worker::cv::run(portfolio_worker::cv::CvSync {
            pool: ctx.pool.clone(),
            s3: ctx.s3.clone(),
            bucket: ctx.bucket.clone(),
            repo: std::env::var("CV_REPO").unwrap_or_else(|_| "fredrir/CV".into()),
            poll: Duration::from_secs(poll),
        }));
    }

    let shutdown = tokio::signal::ctrl_c();
    tokio::pin!(shutdown);

    loop {
        tokio::select! {
            _ = &mut shutdown => {
                tracing::info!("shutting down");
                break;
            }
            received = ctx.sqs
                .receive_message()
                .queue_url(&ctx.queue_url)
                .max_number_of_messages(5)
                .wait_time_seconds(20)
                .message_system_attribute_names(
                    aws_sdk_sqs::types::MessageSystemAttributeName::ApproximateReceiveCount,
                )
                .send() => {
                match received {
                    Ok(output) => {
                        for message in output.messages.unwrap_or_default() {
                            handle_message(&ctx, message).await;
                        }
                    }
                    Err(err) => {
                        tracing::error!(error = %err, "receive_message failed");
                        tokio::time::sleep(Duration::from_secs(5)).await;
                    }
                }
            }
        }
    }

    Ok(())
}

async fn handle_message(ctx: &Ctx, message: Message) {
    let receive_count: i32 = message
        .attributes
        .as_ref()
        .and_then(|a| {
            a.get(&aws_sdk_sqs::types::MessageSystemAttributeName::ApproximateReceiveCount)
        })
        .and_then(|v| v.parse().ok())
        .unwrap_or(1);

    let body = message.body.as_deref().unwrap_or_default();
    let event: S3EventMessage = match serde_json::from_str(body) {
        Ok(event) => event,
        Err(err) => {
            tracing::warn!(error = %err, "unparseable message; deleting");
            delete_message(ctx, &message).await;
            return;
        }
    };

    if event.records.is_empty() {
        tracing::info!("message without records (test event); deleting");
        delete_message(ctx, &message).await;
        return;
    }

    let mut keep_message = false;
    for record in &event.records {
        let key = record.decoded_key();
        if !record.event_name.starts_with("ObjectCreated") || !key.starts_with(ORIGINALS_PREFIX) {
            continue;
        }

        let result = tokio::time::timeout(PROCESSING_TIMEOUT, handle_record(ctx, record)).await;
        let result = match result {
            Ok(inner) => inner,
            Err(_) => Err(WorkerError::Transient("processing timed out".into())),
        };

        match result {
            Ok(()) => {}
            Err(WorkerError::Permanent(reason)) => {
                tracing::error!(%key, %reason, "permanent failure");
                mark_failed(ctx, &key, &reason).await;
            }
            Err(WorkerError::Transient(reason)) => {
                if receive_count >= MAX_RECEIVE_COUNT {
                    tracing::error!(%key, %reason, receive_count, "retries exhausted");
                    mark_failed(ctx, &key, "retries exhausted").await;
                } else {
                    tracing::warn!(%key, %reason, receive_count, "transient failure; will retry");
                }
                keep_message = true;
            }
        }
    }

    if !keep_message {
        delete_message(ctx, &message).await;
    }
}

async fn handle_record(ctx: &Ctx, record: &S3Record) -> Result<(), WorkerError> {
    let key = record.decoded_key();
    let idempotency_id = record.idempotency_id();

    let (already_processed,): (bool,) =
        sqlx::query_as("select exists(select 1 from processed_events where id = $1)")
            .bind(&idempotency_id)
            .fetch_one(&ctx.pool)
            .await?;
    if already_processed {
        tracing::info!(%key, "event already processed; skipping");
        return Ok(());
    }

    let media: Option<(Uuid,)> = sqlx::query_as("select id from media where original_key = $1")
        .bind(&key)
        .fetch_optional(&ctx.pool)
        .await?;
    let Some((media_id,)) = media else {
        return Err(WorkerError::Permanent(format!(
            "no media record for key {key}"
        )));
    };

    sqlx::query("update media set state = 'processing', updated_at = now() where id = $1")
        .bind(media_id)
        .execute(&ctx.pool)
        .await?;

    let object = ctx
        .s3
        .get_object()
        .bucket(&ctx.bucket)
        .key(&key)
        .send()
        .await
        .map_err(|e| WorkerError::Transient(format!("get_object: {e}")))?;
    let original = object
        .body
        .collect()
        .await
        .map_err(|e| WorkerError::Transient(format!("read body: {e}")))?
        .into_bytes();
    if original.len() > MAX_ORIGINAL_BYTES {
        return Err(WorkerError::Permanent(format!(
            "original is {} bytes; limit is {MAX_ORIGINAL_BYTES}",
            original.len()
        )));
    }

    let started = std::time::Instant::now();
    let original_len = original.len();
    let processed = tokio::task::spawn_blocking(move || process_image(&original))
        .await
        .map_err(|e| WorkerError::Transient(format!("processing task: {e}")))?
        .map_err(|e| match e {
            ProcessError::UnsupportedFormat | ProcessError::Decode(_) => {
                WorkerError::Permanent(e.to_string())
            }
            ProcessError::Encode { .. } => WorkerError::Transient(e.to_string()),
        })?;

    for variant in &processed.variants {
        ctx.s3
            .put_object()
            .bucket(&ctx.bucket)
            .key(&variant.key)
            .content_type(variant.content_type)
            .cache_control("public, max-age=31536000, immutable")
            .body(variant.bytes.clone().into())
            .send()
            .await
            .map_err(|e| WorkerError::Transient(format!("put {}: {e}", variant.key)))?;
    }

    let mut tx = ctx.pool.begin().await?;
    sqlx::query(
        "update media set state = 'ready', width = $2, height = $3, \
         content_hash = $4, size_bytes = $5, error = null, updated_at = now() \
         where id = $1",
    )
    .bind(media_id)
    .bind(processed.width as i32)
    .bind(processed.height as i32)
    .bind(&processed.content_hash)
    .bind(original_len as i64)
    .execute(&mut *tx)
    .await?;
    for variant in &processed.variants {
        sqlx::query(
            "insert into media_variants (media_id, format, key, width, height, size_bytes) \
             values ($1, $2, $3, $4, $5, $6) \
             on conflict (media_id, format) do update \
             set key = excluded.key, width = excluded.width, \
                 height = excluded.height, size_bytes = excluded.size_bytes",
        )
        .bind(media_id)
        .bind(variant.format)
        .bind(&variant.key)
        .bind(variant.width as i32)
        .bind(variant.height as i32)
        .bind(variant.bytes.len() as i64)
        .execute(&mut *tx)
        .await?;
    }
    sqlx::query("insert into processed_events (id) values ($1) on conflict do nothing")
        .bind(&idempotency_id)
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;

    tracing::info!(
        %key,
        media_id = %media_id,
        width = processed.width,
        height = processed.height,
        duration_ms = started.elapsed().as_millis() as u64,
        "media processed"
    );
    Ok(())
}

async fn mark_failed(ctx: &Ctx, original_key: &str, reason: &str) {
    let result = sqlx::query(
        "update media set state = 'failed', error = $2, updated_at = now() \
         where original_key = $1",
    )
    .bind(original_key)
    .bind(reason)
    .execute(&ctx.pool)
    .await;
    if let Err(err) = result {
        tracing::error!(error = %err, %original_key, "failed to mark media as failed");
    }
}

async fn delete_message(ctx: &Ctx, message: &Message) {
    let Some(handle) = message.receipt_handle.as_deref() else {
        return;
    };
    if let Err(err) = ctx
        .sqs
        .delete_message()
        .queue_url(&ctx.queue_url)
        .receipt_handle(handle)
        .send()
        .await
    {
        tracing::error!(error = %err, "failed to delete message");
    }
}
