use portfolio_api::{AppState, MediaConfig, app};
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,tower_http=debug".into()),
        )
        .init();

    let database_url = std::env::var("DATABASE_URL")?;
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    sqlx::migrate!().run(&pool).await?;

    let aws_config = aws_config::defaults(aws_config::BehaviorVersion::latest())
        .load()
        .await;
    let mut s3_builder = aws_sdk_s3::config::Builder::from(&aws_config);
    // Custom endpoint (LocalStack/MinIO) requires path-style addressing.
    if std::env::var("AWS_ENDPOINT_URL").is_ok() {
        s3_builder = s3_builder.force_path_style(true);
    }
    let s3 = aws_sdk_s3::Client::from_conf(s3_builder.build());

    let media = MediaConfig {
        bucket: std::env::var("MEDIA_BUCKET").unwrap_or_else(|_| "portfolio-media-dev".into()),
        admin_token: std::env::var("ADMIN_TOKEN").ok().filter(|t| !t.is_empty()),
        public_base_url: std::env::var("MEDIA_PUBLIC_BASE_URL")
            .ok()
            .filter(|u| !u.is_empty()),
    };

    let addr = std::env::var("API_ADDR").unwrap_or_else(|_| "127.0.0.1:8080".into());
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!(%addr, "listening");

    axum::serve(listener, app(AppState { pool, s3, media }))
        .with_graceful_shutdown(async {
            tokio::signal::ctrl_c().await.ok();
        })
        .await?;

    Ok(())
}
