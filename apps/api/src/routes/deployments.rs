use std::time::Duration;

use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::json;
use utoipa::ToSchema;

use crate::AppState;
use crate::problem::Problem;

const CACHE_KEY: &str = "deployments";
const CACHE_TTL: Duration = Duration::from_secs(300);

#[derive(Clone, Serialize, Deserialize, ToSchema)]
pub struct Deployment {
    pub sha: String,
    pub title: String,
    pub conclusion: Option<String>,
    pub started_at: String,
    pub duration_seconds: i64,
    pub html_url: String,
}

#[derive(Deserialize)]
struct RunsResponse {
    workflow_runs: Vec<Run>,
}

#[derive(Deserialize)]
struct Run {
    head_sha: String,
    display_title: String,
    conclusion: Option<String>,
    status: String,
    run_started_at: String,
    updated_at: String,
    html_url: String,
}

fn duration_seconds(start: &str, end: &str) -> i64 {
    use time::OffsetDateTime;
    use time::format_description::well_known::Rfc3339;
    match (
        OffsetDateTime::parse(start, &Rfc3339),
        OffsetDateTime::parse(end, &Rfc3339),
    ) {
        (Ok(s), Ok(e)) => (e - s).whole_seconds().max(0),
        _ => 0,
    }
}

/// The cache lives in Postgres so it survives restarts (deploys, dev
/// auto-reload); the GitHub fetch is unauthenticated (60 req/h per IP), so a
/// wiped cache plus a rate-limited window used to blank the pane entirely.
async fn load_cache(state: &AppState) -> Option<(f64, Vec<Deployment>)> {
    let row: Option<(serde_json::Value, f64)> = sqlx::query_as(
        "select data, extract(epoch from now() - updated_at)::float8 \
         from upstream_cache where id = $1",
    )
    .bind(CACHE_KEY)
    .fetch_optional(&state.pool)
    .await
    .ok()
    .flatten();
    row.and_then(|(data, age)| Some((age, serde_json::from_value(data).ok()?)))
}

async fn save_cache(state: &AppState, runs: &[Deployment]) {
    let value = serde_json::to_value(runs).unwrap_or_else(|_| json!([]));
    let result = sqlx::query(
        "insert into upstream_cache (id, data, updated_at) values ($1, $2, now()) \
         on conflict (id) do update set data = excluded.data, updated_at = now()",
    )
    .bind(CACHE_KEY)
    .bind(&value)
    .execute(&state.pool)
    .await;
    if let Err(err) = result {
        tracing::error!(error = %err, "deployments cache save failed");
    }
}

/// Production deployment history (GitHub Actions runs, cached in Postgres).
#[utoipa::path(get, path = "/api/v1/deployments", tag = "deployments",
    responses(
        (status = 200, body = [Deployment]),
        (status = 502, description = "Upstream unavailable and no cache", body = Problem)
    ))]
pub async fn deployments(State(state): State<AppState>) -> Result<Json<Vec<Deployment>>, Problem> {
    let cached = load_cache(&state).await;
    if let Some((age, runs)) = &cached
        && *age < CACHE_TTL.as_secs_f64()
    {
        return Ok(Json(runs.clone()));
    }

    let url = format!(
        "{}/repos/{}/actions/workflows/deploy.yml/runs?branch=main&per_page=10",
        state.upstreams.github_api, state.upstreams.github_repo
    );
    let fetched: Result<Vec<Deployment>, String> = async {
        let res = state
            .http
            .get(&url)
            .header("Accept", "application/vnd.github.v3+json")
            .send()
            .await
            .map_err(|e| e.to_string())?
            .error_for_status()
            .map_err(|e| e.to_string())?;
        let body: RunsResponse = res.json().await.map_err(|e| e.to_string())?;
        Ok(body
            .workflow_runs
            .into_iter()
            .map(|run| Deployment {
                sha: run.head_sha,
                title: run.display_title,
                conclusion: run.conclusion.or(Some(run.status)),
                duration_seconds: duration_seconds(&run.run_started_at, &run.updated_at),
                started_at: run.run_started_at,
                html_url: run.html_url,
            })
            .collect())
    }
    .await;

    match fetched {
        Ok(runs) => {
            save_cache(&state, &runs).await;
            Ok(Json(runs))
        }
        Err(err) => {
            tracing::warn!(error = %err, "deployments fetch failed; serving stale cache if any");
            match cached {
                Some((_, runs)) => Ok(Json(runs)),
                None => Err(Problem::new(
                    StatusCode::BAD_GATEWAY,
                    "Deployment history unavailable",
                )),
            }
        }
    }
}
