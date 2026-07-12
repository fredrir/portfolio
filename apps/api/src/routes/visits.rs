use axum::Json;
use axum::extract::State;
use axum::http::HeaderMap;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::problem::ApiError;
use crate::{AppState, captcha};

#[derive(Deserialize, ToSchema)]
pub struct RecordVisitRequest {
    /// Page that was visited.
    #[serde(default)]
    pub page: Option<String>,
    /// Referrer reported by the browser.
    #[serde(default)]
    pub referrer: Option<String>,
    /// reCAPTCHA v3 token for the `record_visit` action.
    pub recaptcha_token: String,
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
    // 0.1 is reCAPTCHA's score floor, so this only checks token validity and
    // action: v3 scores everyone near the floor on this low-traffic site, and
    // an inflated visit counter is not worth losing real visits over.
    let passed = captcha::verify(
        &state.http,
        &state.upstreams,
        &body.recaptcha_token,
        "record_visit",
        0.1,
    )
    .await;
    if !passed {
        return Err(ApiError::Forbidden("reCAPTCHA verification failed"));
    }

    // Cap free-text columns to match the DB check constraints so a hostile or
    // oversized header can't error (or bloat storage). char_indices keeps the
    // truncation on a UTF-8 boundary.
    fn cap(value: &str, max: usize) -> String {
        match value.char_indices().nth(max) {
            Some((idx, _)) => value[..idx].to_owned(),
            None => value.to_owned(),
        }
    }

    let user_agent = headers
        .get("user-agent")
        .and_then(|v| v.to_str().ok())
        .map(|v| cap(v, 1024));
    // Country code from the edge; the raw client IP is intentionally not
    // stored anymore.
    let country_code = headers
        .get("x-visitor-country")
        .and_then(|v| v.to_str().ok())
        .map(|v| v.trim().to_uppercase())
        .filter(|v| !v.is_empty() && v.len() <= 8);
    let page = cap(body.page.as_deref().unwrap_or("/"), 512);
    let referrer = body.referrer.as_deref().map(|r| cap(r, 2048));

    sqlx::query(
        "insert into visitors (page, referrer, user_agent, country, country_code) \
         values ($1, $2, $3, null, $4)",
    )
    .bind(&page)
    .bind(&referrer)
    .bind(&user_agent)
    .bind(&country_code)
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
