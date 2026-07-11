use std::collections::HashMap;
use std::sync::{Arc, LazyLock};
use std::time::{Duration, Instant};

use axum::Json;
use axum::extract::State;
use regex::Regex;
use serde::{Deserialize, Serialize};
use tokio::task::JoinSet;
use utoipa::ToSchema;

use crate::{AppState, Upstreams};

const CACHE_TTL: Duration = Duration::from_secs(3600);

static CONTRIBUTION_DAY_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r#"<td[^>]*data-date="([^"]*)"[^>]*id="([^"]*)"[^>]*data-level="(\d)""#)
        .expect("static regex")
});
static CONTRIBUTION_TOOLTIP_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r#"<tool-tip[^>]*for="([^"]*)"[^>]*>([^<]*)"#).expect("static regex")
});
static CONTRIBUTION_COUNT_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(\d[\d,]*)\s+contributions?").expect("static regex"));
static CONTRIBUTION_TOTAL_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(\d[\d,]*)\s+contributions?\s+in\s+(?:the last year|\d{4})").expect("static regex")
});

#[derive(Clone, Serialize, ToSchema)]
pub struct ContributionDay {
    pub count: u32,
    pub date: String,
    pub level: u32,
}

#[derive(Clone, Serialize, ToSchema)]
pub struct ContributionYear {
    pub year: String,
    pub days: Vec<ContributionDay>,
    pub total: u64,
}

#[derive(Clone, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct LanguageCount {
    pub lang: String,
    pub count: u32,
}

/// Mirrors the shape the frontend consumed from the old TypeScript fetcher.
#[derive(Clone, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct GitHubData {
    pub username: String,
    pub name: String,
    pub bio: String,
    pub public_repos: u32,
    pub followers: u32,
    pub following: u32,
    pub total_stars: u64,
    pub top_languages: Vec<LanguageCount>,
    pub profile_url: String,
    pub created_at: String,
    pub contributions_by_year: Vec<ContributionYear>,
}

#[derive(Deserialize)]
struct GhUser {
    login: String,
    name: Option<String>,
    bio: Option<String>,
    public_repos: u32,
    followers: u32,
    following: u32,
    html_url: String,
    created_at: String,
}

#[derive(Deserialize)]
struct GhRepo {
    stargazers_count: u64,
    language: Option<String>,
}

/// Parse GitHub's contribution-calendar HTML into per-day counts.
pub fn parse_contributions(html: &str) -> (Vec<ContributionDay>, u64) {
    let tooltip_counts: HashMap<String, u32> = CONTRIBUTION_TOOLTIP_RE
        .captures_iter(html)
        .filter_map(|cap| {
            let count = CONTRIBUTION_COUNT_RE
                .captures(&cap[2])
                .and_then(|count| count[1].replace(',', "").parse::<u32>().ok())?;
            Some((cap[1].to_owned(), count))
        })
        .collect();

    let mut days = Vec::new();
    for cap in CONTRIBUTION_DAY_RE.captures_iter(html) {
        let date = cap[1].to_owned();
        let id = &cap[2];
        let level: u32 = cap[3].parse().unwrap_or(0);

        let mut count = tooltip_counts.get(id).copied().unwrap_or(0);
        if count == 0 && level > 0 {
            count = level;
        }
        days.push(ContributionDay { count, date, level });
    }

    let mut total: u64 = days.iter().map(|d| d.count as u64).sum();
    if let Some(cap) = CONTRIBUTION_TOTAL_RE.captures(html) {
        total = cap[1].replace(',', "").parse().unwrap_or(total);
    }
    (days, total)
}

async fn fetch_contributions(
    http: &reqwest::Client,
    upstreams: &Upstreams,
    year: Option<&str>,
) -> ContributionYear {
    let username = &upstreams.github_username;
    let url = match year {
        Some(y) => format!(
            "{}/users/{username}/contributions?from={y}-01-01&to={y}-12-31",
            upstreams.github_html
        ),
        None => format!("{}/users/{username}/contributions", upstreams.github_html),
    };
    let label = year.unwrap_or("last").to_owned();
    let html = match http.get(&url).send().await {
        Ok(res) if res.status().is_success() => res.text().await.unwrap_or_default(),
        _ => String::new(),
    };
    let (days, total) = parse_contributions(&html);
    ContributionYear {
        year: label,
        days,
        total,
    }
}

async fn fetch_contributions_by_year(
    http: &reqwest::Client,
    upstreams: Arc<Upstreams>,
    year_keys: Vec<Option<String>>,
) -> Vec<ContributionYear> {
    let year_count = year_keys.len();
    let mut tasks = JoinSet::new();
    for (idx, key) in year_keys.into_iter().enumerate() {
        let http = http.clone();
        let upstreams = upstreams.clone();
        tasks.spawn(async move {
            (
                idx,
                fetch_contributions(&http, &upstreams, key.as_deref()).await,
            )
        });
    }

    let mut contributions_by_year = vec![None; year_count];
    while let Some(result) = tasks.join_next().await {
        match result {
            Ok((idx, contribution_year)) => contributions_by_year[idx] = Some(contribution_year),
            Err(error) => tracing::warn!(%error, "github contribution fetch task failed"),
        }
    }
    contributions_by_year.into_iter().flatten().collect()
}

async fn load(http: &reqwest::Client, upstreams: Arc<Upstreams>) -> Option<GitHubData> {
    let username = &upstreams.github_username;
    let accept = ("Accept", "application/vnd.github.v3+json");

    let user_url = format!("{}/users/{username}", upstreams.github_api);
    let repos_url = format!(
        "{}/users/{username}/repos?per_page=100&sort=updated",
        upstreams.github_api
    );
    let (user_res, repos_res) = tokio::join!(
        http.get(&user_url).header(accept.0, accept.1).send(),
        http.get(&repos_url).header(accept.0, accept.1).send(),
    );
    let user: GhUser = user_res.ok()?.error_for_status().ok()?.json().await.ok()?;
    let repos: Vec<GhRepo> = repos_res.ok()?.error_for_status().ok()?.json().await.ok()?;

    let total_stars = repos.iter().map(|r| r.stargazers_count).sum();
    let mut language_counts = std::collections::HashMap::<String, u32>::new();
    for repo in &repos {
        if let Some(lang) = &repo.language {
            *language_counts.entry(lang.clone()).or_default() += 1;
        }
    }
    let mut top_languages: Vec<LanguageCount> = language_counts
        .into_iter()
        .map(|(lang, count)| LanguageCount { lang, count })
        .collect();
    top_languages.sort_by(|a, b| b.count.cmp(&a.count).then(a.lang.cmp(&b.lang)));
    top_languages.truncate(5);

    let created_year: i32 = user.created_at.get(..4)?.parse().ok()?;
    let current_year = time::OffsetDateTime::now_utc().year();
    let mut year_keys: Vec<Option<String>> = vec![None];
    for y in (created_year..=current_year).rev() {
        year_keys.push(Some(y.to_string()));
    }

    let contributions_by_year =
        fetch_contributions_by_year(http, upstreams.clone(), year_keys).await;

    Some(GitHubData {
        username: user.login,
        name: user.name.unwrap_or_default(),
        bio: user.bio.unwrap_or_default(),
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        total_stars,
        top_languages,
        profile_url: user.html_url,
        created_at: user.created_at,
        contributions_by_year,
    })
}

/// GitHub profile, stars, languages and contribution calendar (cached 1h).
/// Returns null when the upstream is unavailable and nothing is cached,
/// matching the old frontend fetcher's contract.
#[utoipa::path(get, path = "/api/v1/github", tag = "github",
    responses((status = 200, body = Option<GitHubData>)))]
pub async fn github(State(state): State<AppState>) -> Json<Option<GitHubData>> {
    if let Some((at, data)) = state.caches.github.read().await.as_ref()
        && at.elapsed() < CACHE_TTL
    {
        return Json(Some(data.clone()));
    }

    match load(&state.http, state.upstreams.clone()).await {
        Some(data) => {
            *state.caches.github.write().await = Some((Instant::now(), data.clone()));
            Json(Some(data))
        }
        None => {
            tracing::warn!("github fetch failed; serving stale cache if any");
            Json(
                state
                    .caches
                    .github
                    .read()
                    .await
                    .as_ref()
                    .map(|(_, d)| d.clone()),
            )
        }
    }
}

#[cfg(test)]
mod tests {
    use super::parse_contributions;

    #[test]
    fn parses_contribution_counts_from_tooltips_once() {
        let html = r#"
            <td data-date="2026-07-10" id="contribution-day-1" data-level="0"></td>
            <td data-date="2026-07-11" id="contribution-day-2" data-level="4"></td>
            <tool-tip for="contribution-day-1">No contributions on July 10.</tool-tip>
            <tool-tip for="contribution-day-2">1,234 contributions on July 11.</tool-tip>
            <h2>1,234 contributions in 2026</h2>
        "#;

        let (days, total) = parse_contributions(html);

        assert_eq!(total, 1234);
        assert_eq!(days.len(), 2);
        assert_eq!(days[0].count, 0);
        assert_eq!(days[1].date, "2026-07-11");
        assert_eq!(days[1].count, 1234);
        assert_eq!(days[1].level, 4);
    }

    #[test]
    fn falls_back_to_level_when_tooltip_count_is_missing() {
        let html = r#"<td data-date="2026-07-11" id="contribution-day-2" data-level="3"></td>"#;

        let (days, total) = parse_contributions(html);

        assert_eq!(total, 3);
        assert_eq!(days[0].count, 3);
    }
}
