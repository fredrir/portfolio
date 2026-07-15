use std::time::Duration;

use aws_sdk_sqs::types::Message;
use portfolio_worker::events::{S3EventMessage, S3Record};
use portfolio_worker::exif::extract_exif;
use portfolio_worker::processor::{ProcessError, process_image};
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use uuid::Uuid;

const ORIGINALS_PREFIX: &str = "originals/";
const MAX_ORIGINAL_BYTES: usize = 30 * 1024 * 1024;
const MAX_RECEIVE_COUNT: i32 = 5;
const VISIBILITY_TIMEOUT_SECONDS: i32 = 120;
const VISIBILITY_HEARTBEAT: Duration = Duration::from_secs(40);
const RECONCILE_INTERVAL: Duration = Duration::from_secs(60);

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
    Permanent(String),
    Abandoned(String),
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
    let mut reconcile = tokio::time::interval(RECONCILE_INTERVAL);
    reconcile.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);

    loop {
        tokio::select! {
            _ = &mut shutdown => {
                tracing::info!("shutting down");
                break;
            }
            received = ctx.sqs
                .receive_message()
                .queue_url(&ctx.queue_url)
                // Processing is CPU-bound and deliberately sequential. Taking
                // a batch here only starts the visibility clock on messages
                // that are still waiting locally behind the first image.
                .max_number_of_messages(1)
                .visibility_timeout(VISIBILITY_TIMEOUT_SECONDS)
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
            _ = reconcile.tick() => reconcile_stale_media(&ctx).await,
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

        let result = handle_record_with_heartbeat(ctx, &message, record).await;

        match result {
            Ok(()) => {}
            Err(WorkerError::Abandoned(reason)) => {
                tracing::warn!(%key, %reason, "abandoned upload; removing record");
                remove_abandoned(ctx, &key).await;
            }
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
    handle_original(ctx, &key, &idempotency_id).await
}

async fn handle_record_with_heartbeat(
    ctx: &Ctx,
    message: &Message,
    record: &S3Record,
) -> Result<(), WorkerError> {
    let Some(receipt_handle) = message.receipt_handle.as_deref() else {
        return handle_record(ctx, record).await;
    };

    let processing = handle_record(ctx, record);
    tokio::pin!(processing);
    let mut heartbeat = tokio::time::interval_at(
        tokio::time::Instant::now() + VISIBILITY_HEARTBEAT,
        VISIBILITY_HEARTBEAT,
    );

    loop {
        tokio::select! {
            result = &mut processing => return result,
            _ = heartbeat.tick() => {
                if let Err(err) = ctx.sqs
                    .change_message_visibility()
                    .queue_url(&ctx.queue_url)
                    .receipt_handle(receipt_handle)
                    .visibility_timeout(VISIBILITY_TIMEOUT_SECONDS)
                    .send()
                    .await
                {
                    // Keep working: abandoning a spawn_blocking encoder would
                    // not stop its CPU work and would make duplication likelier.
                    tracing::error!(error = %err, "failed to extend message visibility");
                }
            }
        }
    }
}

async fn handle_original(ctx: &Ctx, key: &str, idempotency_id: &str) -> Result<(), WorkerError> {
    let (already_processed,): (bool,) =
        sqlx::query_as("select exists(select 1 from processed_events where id = $1)")
            .bind(idempotency_id)
            .fetch_one(&ctx.pool)
            .await?;
    if already_processed {
        tracing::info!(%key, "event already processed; skipping");
        return Ok(());
    }

    let media: Option<(Uuid, String)> =
        sqlx::query_as("select id, state from media where original_key = $1")
            .bind(key)
            .fetch_optional(&ctx.pool)
            .await?;
    let Some((media_id, state)) = media else {
        return Err(WorkerError::Permanent(format!(
            "no media record for key {key}"
        )));
    };

    // Development seeding writes originals before upserting their already-ready
    // rows. The resulting notification is still waiting when `bun run dev`
    // starts this worker, and re-encoding every fixture delays real uploads.
    // This also makes duplicate S3 notifications cheap in every environment.
    if state == "ready" {
        tracing::info!(%key, "media already ready; skipping");
        return Ok(());
    }

    sqlx::query("update media set state = 'processing', updated_at = now() where id = $1")
        .bind(media_id)
        .execute(&ctx.pool)
        .await?;

    let object = ctx
        .s3
        .get_object()
        .bucket(&ctx.bucket)
        .key(key)
        .send()
        .await
        .map_err(|e| {
            if e.as_service_error()
                .is_some_and(|error| error.is_no_such_key())
            {
                WorkerError::Abandoned("original upload was not completed".into())
            } else {
                WorkerError::Transient(format!("get_object: {e}"))
            }
        })?;
    // Reject oversized objects from the advertised length before buffering the
    // whole body into memory.
    if let Some(len) = object.content_length()
        && len > MAX_ORIGINAL_BYTES as i64
    {
        return Err(WorkerError::Permanent(format!(
            "original is {len} bytes; limit is {MAX_ORIGINAL_BYTES}"
        )));
    }
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
    let (processed, exif) = tokio::task::spawn_blocking(move || {
        process_image(&original).map(|processed| (processed, extract_exif(&original)))
    })
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
         content_hash = $4, size_bytes = $5, error = null, \
         taken_at = $6, camera = $7, lens = $8, focal_length_mm = $9, \
         aperture = $10, shutter_seconds = $11, iso = $12, \
         latitude = $13, longitude = $14, updated_at = now() \
         where id = $1",
    )
    .bind(media_id)
    .bind(processed.width as i32)
    .bind(processed.height as i32)
    .bind(&processed.content_hash)
    .bind(original_len as i64)
    .bind(exif.taken_at)
    .bind(&exif.camera)
    .bind(&exif.lens)
    .bind(exif.focal_length_mm)
    .bind(exif.aperture)
    .bind(exif.shutter_seconds)
    .bind(exif.iso)
    .bind(exif.latitude)
    .bind(exif.longitude)
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
        .bind(idempotency_id)
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

/// S3 notifications are best-effort and a worker can be terminated after it
/// marks a row processing but before SQS redelivery completes. Retry one stale
/// row at a time so those cases converge without an operator moving DLQ items.
async fn reconcile_stale_media(ctx: &Ctx) {
    let stale: Result<Option<(Uuid, String)>, sqlx::Error> = sqlx::query_as(
        "select id, original_key from media \
         where (state = 'processing' and updated_at < now() - interval '5 minutes') \
            or (state = 'pending' and updated_at < now() - interval '20 minutes') \
         order by updated_at \
         limit 1",
    )
    .fetch_optional(&ctx.pool)
    .await;
    let Some((media_id, key)) = (match stale {
        Ok(row) => row,
        Err(err) => {
            tracing::error!(error = %err, "failed to find stale media");
            return;
        }
    }) else {
        return;
    };

    tracing::warn!(%media_id, %key, "retrying stale media");
    let idempotency_id = format!("reconcile/{media_id}");
    match handle_original(ctx, &key, &idempotency_id).await {
        Ok(()) => {}
        Err(WorkerError::Abandoned(reason)) => {
            tracing::warn!(%key, %reason, "removing stale abandoned upload");
            remove_abandoned(ctx, &key).await;
        }
        Err(WorkerError::Permanent(reason)) => {
            tracing::error!(%key, %reason, "stale media permanently failed");
            mark_failed(ctx, &key, &reason).await;
        }
        Err(WorkerError::Transient(reason)) => {
            tracing::warn!(%key, %reason, "stale media retry failed");
        }
    }
}

async fn remove_abandoned(ctx: &Ctx, original_key: &str) {
    let result = sqlx::query(
        "delete from media where original_key = $1 and state in ('pending', 'processing')",
    )
    .bind(original_key)
    .execute(&ctx.pool)
    .await;
    if let Err(err) = result {
        tracing::error!(error = %err, %original_key, "failed to remove abandoned media");
    }
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
