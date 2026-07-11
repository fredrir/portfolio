use std::time::{Duration, Instant};

use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::AppState;
use crate::problem::Problem;

const CACHE_TTL: Duration = Duration::from_secs(300);

#[derive(Clone, Serialize, ToSchema)]
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

/// Production deployment history (GitHub Actions runs, cached server-side).
#[utoipa::path(get, path = "/api/v1/deployments", tag = "deployments",
    responses(
        (status = 200, body = [Deployment]),
        (status = 502, description = "Upstream unavailable and no cache", body = Problem)
    ))]
pub async fn deployments(State(state): State<AppState>) -> Result<Json<Vec<Deployment>>, Problem> {
    if let Some((at, runs)) = state.caches.deployments.read().await.as_ref()
        && at.elapsed() < CACHE_TTL
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
            *state.caches.deployments.write().await = Some((Instant::now(), runs.clone()));
            Ok(Json(runs))
        }
        Err(err) => {
            tracing::warn!(error = %err, "deployments fetch failed; serving stale cache if any");
            match state.caches.deployments.read().await.as_ref() {
                Some((_, runs)) => Ok(Json(runs.clone())),
                None => Err(Problem::new(
                    StatusCode::BAD_GATEWAY,
                    "Deployment history unavailable",
                )),
            }
        }
    }
}
