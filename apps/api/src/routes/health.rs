use axum::extract::State;
use axum::http::StatusCode;

use crate::AppState;
use crate::problem::Problem;

/// Liveness probe; no dependencies are checked.
#[utoipa::path(get, path = "/healthz", tag = "health", responses(
    (status = 200, description = "Process is alive")
))]
pub async fn healthz() -> StatusCode {
    StatusCode::OK
}

/// Readiness probe; verifies database connectivity.
#[utoipa::path(get, path = "/readyz", tag = "health", responses(
    (status = 200, description = "Ready to serve traffic"),
    (status = 503, description = "A dependency is unavailable", body = Problem)
))]
pub async fn readyz(State(state): State<AppState>) -> Result<StatusCode, Problem> {
    sqlx::query("select 1")
        .execute(&state.pool)
        .await
        .map_err(|err| {
            tracing::warn!(error = %err, "readiness check failed");
            Problem::new(StatusCode::SERVICE_UNAVAILABLE, "Database unavailable")
        })?;
    Ok(StatusCode::OK)
}
