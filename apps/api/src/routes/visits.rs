use axum::Json;
use axum::extract::State;
use axum::http::HeaderMap;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::AppState;
use crate::problem::ApiError;

#[derive(Deserialize, ToSchema)]
pub struct RecordVisitRequest {
    /// Page that was visited.
    #[serde(default)]
    pub page: Option<String>,
    /// Referrer reported by the browser.
    #[serde(default)]
    pub referrer: Option<String>,
}

#[derive(Serialize, ToSchema)]
pub struct VisitCount {
    pub count: i64,
}

/// Record a visit and return the total visit count.
#[utoipa::path(post, path = "/api/v1/visits", tag = "visits",
    request_body = RecordVisitRequest,
    responses((status = 200, body = VisitCount)))]
pub async fn record_visit(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<RecordVisitRequest>,
) -> Result<Json<VisitCount>, ApiError> {
    let user_agent = headers
        .get("user-agent")
        .and_then(|v| v.to_str().ok())
        .map(str::to_owned);
    let client_ip = headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.split(',').next())
        .map(|v| v.trim().to_owned());

    sqlx::query(
        "insert into visitors (page, referrer, user_agent, country) values ($1, $2, $3, $4)",
    )
    .bind(body.page.as_deref().unwrap_or("/"))
    .bind(&body.referrer)
    .bind(&user_agent)
    .bind(&client_ip)
    .execute(&state.pool)
    .await?;

    visit_count(State(state)).await
}

/// Total number of recorded visits.
#[utoipa::path(get, path = "/api/v1/visits/count", tag = "visits",
    responses((status = 200, body = VisitCount)))]
pub async fn visit_count(State(state): State<AppState>) -> Result<Json<VisitCount>, ApiError> {
    let (count,): (i64,) = sqlx::query_as("select count(*) from visitors")
        .fetch_one(&state.pool)
        .await?;
    Ok(Json(VisitCount { count }))
}
