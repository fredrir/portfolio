use std::time::{Duration, Instant};

use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde::{Deserialize, Serialize};
use serde_json::json;
use utoipa::ToSchema;

use crate::AppState;
use crate::problem::ApiError;

const POSTHOG_CACHE_TTL: Duration = Duration::from_secs(600);

#[derive(Clone, Serialize, Deserialize, ToSchema, sqlx::FromRow)]
pub struct DailyCount {
    pub day: String,
    pub count: i64,
}

#[derive(Clone, Serialize, Deserialize, ToSchema, sqlx::FromRow)]
pub struct KeyCount {
    pub key: String,
    pub count: i64,
}

#[derive(Serialize, ToSchema)]
pub struct AnalyticsResponse {
    pub total: i64,
    pub daily: Vec<DailyCount>,
    pub referrers: Vec<KeyCount>,
    pub browsers: Vec<KeyCount>,
    pub countries: Vec<KeyCount>,
}

/// First-party visitor analytics, aggregated in SQL.
#[utoipa::path(get, path = "/api/v1/analytics", tag = "analytics",
    responses((status = 200, body = AnalyticsResponse)))]
pub async fn analytics(State(state): State<AppState>) -> Result<Json<AnalyticsResponse>, ApiError> {
    let (total,): (i64,) = sqlx::query_as("select count(*) from visitors")
        .fetch_one(&state.pool)
        .await?;

    let daily: Vec<DailyCount> = sqlx::query_as(
        "select d::date::text as day, count(v.id) as count \
         from generate_series(current_date - interval '29 days', current_date, '1 day') d \
         left join visitors v on v.created_at::date = d::date \
         group by d order by d",
    )
    .fetch_all(&state.pool)
    .await?;

    let referrers: Vec<KeyCount> = sqlx::query_as(
        "select rtrim(regexp_replace(referrer, '^https?://', ''), '/') as key, \
                count(*) as count \
         from visitors \
         where referrer is not null and referrer <> '' \
         group by 1 order by count desc, key limit 10",
    )
    .fetch_all(&state.pool)
    .await?;

    let browsers: Vec<KeyCount> = sqlx::query_as(
        "select case \
            when user_agent ilike '%edg%' then 'Edge' \
            when user_agent ilike '%firefox%' then 'Firefox' \
            when user_agent ilike '%chrome%' or user_agent ilike '%crios%' then 'Chrome' \
            when user_agent ilike '%safari%' then 'Safari' \
            when user_agent ilike '%mobile%' then 'Mobile' \
            else 'Other' end as key, \
            count(*) as count \
         from visitors where user_agent is not null \
         group by 1 order by count desc",
    )
    .fetch_all(&state.pool)
    .await?;

    let countries: Vec<KeyCount> = sqlx::query_as(
        "select country_code as key, count(*) as count \
         from visitors where country_code is not null \
         group by 1 order by count desc, key limit 20",
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(AnalyticsResponse {
        total,
        daily,
        referrers,
        browsers,
        countries,
    }))
}

#[derive(Clone, Serialize, Deserialize, ToSchema)]
pub struct PosthogStats {
    pub daily_pageviews: Vec<DailyCount>,
    pub daily_uniques: Vec<DailyCount>,
    pub top_pages: Vec<KeyCount>,
}

async fn hogql(
    state: &AppState,
    project: &str,
    key: &str,
    query: &str,
) -> Result<Vec<Vec<serde_json::Value>>, String> {
    let url = format!("{}/api/projects/{project}/query", state.upstreams.posthog);
    let res = state
        .http
        .post(&url)
        .bearer_auth(key)
        .json(&json!({ "query": { "kind": "HogQLQuery", "query": query } }))
        .timeout(Duration::from_secs(15))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;
    let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    serde_json::from_value(body["results"].clone()).map_err(|e| e.to_string())
}

/// PostHog-derived stats (pageviews, uniques, top pages) queried server-side.
/// 204 when PostHog is not configured.
#[utoipa::path(get, path = "/api/v1/analytics/posthog", tag = "analytics",
    responses(
        (status = 200, body = PosthogStats),
        (status = 204, description = "PostHog not configured")
    ))]
pub async fn posthog_stats(State(state): State<AppState>) -> Response {
    let (Some(key), Some(project)) = (
        state.upstreams.posthog_api_key.clone(),
        state.upstreams.posthog_project_id.clone(),
    ) else {
        return StatusCode::NO_CONTENT.into_response();
    };

    if let Some((at, stats)) = state.caches.posthog.read().await.as_ref()
        && at.elapsed() < POSTHOG_CACHE_TTL
    {
        return Json(stats.clone()).into_response();
    }

    let daily = hogql(
        &state,
        &project,
        &key,
        "select toDate(timestamp) as day, count() as views, count(distinct distinct_id) as uniques \
         from events where event = '$pageview' and timestamp >= now() - interval 30 day \
         group by day order by day",
    )
    .await;
    let pages = hogql(
        &state,
        &project,
        &key,
        "select properties.$pathname as path, count() as views \
         from events where event = '$pageview' and timestamp >= now() - interval 30 day \
         group by path order by views desc limit 10",
    )
    .await;

    match (daily, pages) {
        (Ok(daily), Ok(pages)) => {
            let stats = PosthogStats {
                daily_pageviews: daily
                    .iter()
                    .map(|r| DailyCount {
                        day: r[0].as_str().unwrap_or_default().to_owned(),
                        count: r[1].as_i64().unwrap_or(0),
                    })
                    .collect(),
                daily_uniques: daily
                    .iter()
                    .map(|r| DailyCount {
                        day: r[0].as_str().unwrap_or_default().to_owned(),
                        count: r.get(2).and_then(|v| v.as_i64()).unwrap_or(0),
                    })
                    .collect(),
                top_pages: pages
                    .iter()
                    .map(|r| KeyCount {
                        key: r[0].as_str().unwrap_or_default().to_owned(),
                        count: r[1].as_i64().unwrap_or(0),
                    })
                    .collect(),
            };
            *state.caches.posthog.write().await = Some((Instant::now(), stats.clone()));
            Json(stats).into_response()
        }
        (daily, pages) => {
            let err = daily.err().or(pages.err()).unwrap_or_default();
            tracing::warn!(error = %err, "posthog query failed; serving stale cache if any");
            match state.caches.posthog.read().await.as_ref() {
                Some((_, stats)) => Json(stats.clone()).into_response(),
                None => StatusCode::NO_CONTENT.into_response(),
            }
        }
    }
}
