//! Oneshot backfill: extract EXIF from S3 originals for media rows created
//! before the worker started persisting metadata. Idempotent — re-running
//! overwrites the EXIF columns from the originals.
//!
//! Usage: backfill-exif [--only-missing]
//!   --only-missing  skip rows that already have any EXIF persisted

use portfolio_worker::exif::{ExifSummary, extract_exif};
use sqlx::postgres::PgPoolOptions;
use uuid::Uuid;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let only_missing = std::env::args().any(|arg| arg == "--only-missing");

    let database_url = std::env::var("DATABASE_URL").map_err(|_| "DATABASE_URL is not set")?;
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect(&database_url)
        .await?;

    let aws_config = aws_config::defaults(aws_config::BehaviorVersion::latest())
        .load()
        .await;
    let mut s3_builder = aws_sdk_s3::config::Builder::from(&aws_config);
    if std::env::var("AWS_ENDPOINT_URL").is_ok() {
        s3_builder = s3_builder.force_path_style(true);
    }
    let s3 = aws_sdk_s3::Client::from_conf(s3_builder.build());
    let bucket = std::env::var("MEDIA_BUCKET").unwrap_or_else(|_| "portfolio-media-dev".into());

    let rows: Vec<(Uuid, String)> = sqlx::query_as(
        "select id, original_key from media \
         where state = 'ready' \
           and (not $1 or (taken_at is null and camera is null and latitude is null)) \
         order by created_at",
    )
    .bind(only_missing)
    .fetch_all(&pool)
    .await?;

    println!("backfilling exif for {} media rows", rows.len());
    let (mut with_exif, mut failed) = (0usize, 0usize);
    for (id, key) in &rows {
        let object = match s3.get_object().bucket(&bucket).key(key).send().await {
            Ok(object) => object,
            Err(err) => {
                eprintln!("{id}: get {key}: {err}");
                failed += 1;
                continue;
            }
        };
        let original = match object.body.collect().await {
            Ok(body) => body.into_bytes(),
            Err(err) => {
                eprintln!("{id}: read {key}: {err}");
                failed += 1;
                continue;
            }
        };

        let exif = extract_exif(&original);
        if exif != ExifSummary::default() {
            with_exif += 1;
        }
        sqlx::query(
            "update media set taken_at = $2, camera = $3, lens = $4, \
             focal_length_mm = $5, aperture = $6, shutter_seconds = $7, \
             iso = $8, latitude = $9, longitude = $10, updated_at = now() \
             where id = $1",
        )
        .bind(id)
        .bind(exif.taken_at)
        .bind(&exif.camera)
        .bind(&exif.lens)
        .bind(exif.focal_length_mm)
        .bind(exif.aperture)
        .bind(exif.shutter_seconds)
        .bind(exif.iso)
        .bind(exif.latitude)
        .bind(exif.longitude)
        .execute(&pool)
        .await?;
    }

    println!(
        "done: updated={} with_exif={with_exif} failed={failed}",
        rows.len() - failed
    );
    if failed > 0 {
        return Err(format!("{failed} originals could not be fetched").into());
    }
    Ok(())
}
