//! Tamper-evident administration audit log.
//!
//! Every entry stores `entry_hash = sha256(prev_hash || rfc3339(at) || action
//! || detail_text)`, where `detail_text` is the JSONB value exactly as
//! Postgres renders it (`detail::text`), so verification recomputes over the
//! stored representation rather than the caller's input formatting. Inserts
//! serialize on an advisory lock; any later mutation of a row breaks every
//! subsequent hash.

use sha2::{Digest, Sha256};
use sqlx::{PgConnection, Row};
use time::OffsetDateTime;
use time::format_description::well_known::Rfc3339;

pub const GENESIS: &str = "0000000000000000000000000000000000000000000000000000000000000000";

fn entry_hash(prev: &str, at: &OffsetDateTime, action: &str, detail_text: &str) -> String {
    let at_text = at.format(&Rfc3339).expect("timestamptz formats as rfc3339");
    let mut hasher = Sha256::new();
    hasher.update(prev.as_bytes());
    hasher.update(at_text.as_bytes());
    hasher.update(action.as_bytes());
    hasher.update(detail_text.as_bytes());
    hex::encode(hasher.finalize())
}

/// Append an entry inside the caller's transaction.
pub async fn record(
    conn: &mut PgConnection,
    action: &str,
    detail: serde_json::Value,
) -> Result<(), sqlx::Error> {
    sqlx::query("select pg_advisory_xact_lock(hashtext('admin_audit'))")
        .execute(&mut *conn)
        .await?;

    let prev: Option<(String,)> =
        sqlx::query_as("select entry_hash from admin_audit order by id desc limit 1")
            .fetch_optional(&mut *conn)
            .await?;
    let prev = prev.map(|(h,)| h).unwrap_or_else(|| GENESIS.to_owned());

    let row = sqlx::query(
        "insert into admin_audit (action, detail, prev_hash, entry_hash) \
         values ($1, $2, $3, '') returning id, at, detail::text as detail_text",
    )
    .bind(action)
    .bind(&detail)
    .bind(&prev)
    .fetch_one(&mut *conn)
    .await?;

    let id: i64 = row.get("id");
    let at: OffsetDateTime = row.get("at");
    let detail_text: String = row.get("detail_text");
    let hash = entry_hash(&prev, &at, action, &detail_text);

    sqlx::query("update admin_audit set entry_hash = $1 where id = $2")
        .bind(&hash)
        .bind(id)
        .execute(&mut *conn)
        .await?;
    Ok(())
}

pub struct ChainStatus {
    pub valid: bool,
    pub entries: i64,
    pub first_invalid_id: Option<i64>,
}

/// Re-compute the full chain from genesis.
pub async fn verify_chain(conn: &mut PgConnection) -> Result<ChainStatus, sqlx::Error> {
    let rows = sqlx::query(
        "select id, at, action, detail::text as detail_text, prev_hash, entry_hash \
         from admin_audit order by id",
    )
    .fetch_all(&mut *conn)
    .await?;

    let mut prev = GENESIS.to_owned();
    let entries = rows.len() as i64;
    for row in rows {
        let id: i64 = row.get("id");
        let at: OffsetDateTime = row.get("at");
        let action: String = row.get("action");
        let detail_text: String = row.get("detail_text");
        let stored_prev: String = row.get("prev_hash");
        let stored_hash: String = row.get("entry_hash");

        let expected = entry_hash(&prev, &at, &action, &detail_text);
        if stored_prev != prev || stored_hash != expected {
            return Ok(ChainStatus {
                valid: false,
                entries,
                first_invalid_id: Some(id),
            });
        }
        prev = stored_hash;
    }
    Ok(ChainStatus {
        valid: true,
        entries,
        first_invalid_id: None,
    })
}
