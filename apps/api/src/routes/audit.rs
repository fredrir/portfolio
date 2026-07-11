use axum::Json;
use axum::extract::State;
use axum::http::HeaderMap;
use axum::response::IntoResponse;
use serde::Serialize;
use utoipa::ToSchema;

use crate::problem::{ApiError, Problem};
use crate::routes::media::require_admin;
use crate::{AppState, audit};

#[derive(Serialize, ToSchema, sqlx::FromRow)]
pub struct AuditEntry {
    pub id: i64,
    pub at: String,
    pub action: String,
    pub detail: serde_json::Value,
    pub entry_hash: String,
}

/// Most recent administration audit entries (admin bearer token).
#[utoipa::path(get, path = "/api/v1/audit", tag = "audit",
    responses(
        (status = 200, body = [AuditEntry]),
        (status = 401, description = "Missing or invalid bearer token", body = Problem)
    ))]
pub async fn list_audit(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<Vec<AuditEntry>>, axum::response::Response> {
    require_admin(&state, &headers).map_err(|p| p.into_response())?;
    let entries: Vec<AuditEntry> = sqlx::query_as(
        "select id, at::text as at, action, detail, entry_hash \
         from admin_audit order by id desc limit 100",
    )
    .fetch_all(&state.pool)
    .await
    .map_err(|e| ApiError::from(e).into_response())?;
    Ok(Json(entries))
}

#[derive(Serialize, ToSchema)]
pub struct AuditVerification {
    pub valid: bool,
    pub entries: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub first_invalid_id: Option<i64>,
}

/// Recompute the full hash chain; any tampered row breaks it (admin bearer).
#[utoipa::path(get, path = "/api/v1/audit/verify", tag = "audit",
    responses(
        (status = 200, body = AuditVerification),
        (status = 401, description = "Missing or invalid bearer token", body = Problem)
    ))]
pub async fn verify_audit(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<AuditVerification>, axum::response::Response> {
    require_admin(&state, &headers).map_err(|p| p.into_response())?;
    let mut conn = state
        .pool
        .acquire()
        .await
        .map_err(|e| ApiError::from(e).into_response())?;
    let status = audit::verify_chain(&mut conn)
        .await
        .map_err(|e| ApiError::from(e).into_response())?;
    Ok(Json(AuditVerification {
        valid: status.valid,
        entries: status.entries,
        first_invalid_id: status.first_invalid_id,
    }))
}
