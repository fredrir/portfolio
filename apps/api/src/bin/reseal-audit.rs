use portfolio_api::audit;
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let write = std::env::args().any(|arg| arg == "--write");
    let allow_keyless = std::env::args().any(|arg| arg == "--allow-keyless");
    if write
        && !allow_keyless
        && std::env::var("AUDIT_HMAC_KEY")
            .ok()
            .filter(|key| !key.is_empty())
            .is_none()
    {
        return Err(
            "AUDIT_HMAC_KEY is required for --write; pass --allow-keyless only for dev".into(),
        );
    }

    let database_url = std::env::var("DATABASE_URL")?;
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect(&database_url)
        .await?;

    let mut tx = pool.begin().await?;
    let status = audit::reseal_chain(&mut tx, write).await?;
    if write {
        tx.commit().await?;
    } else {
        tx.rollback().await?;
    }

    println!(
        "audit reseal {}: entries={} changed={} first_changed_id={}",
        if status.write { "wrote" } else { "dry-run" },
        status.entries,
        status.changed,
        status
            .first_changed_id
            .map(|id| id.to_string())
            .unwrap_or_else(|| "none".to_owned()),
    );
    if !write && status.changed > 0 {
        println!("run again with --write to persist the recomputed chain");
    }

    Ok(())
}
