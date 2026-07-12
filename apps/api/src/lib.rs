pub mod audit;
pub mod captcha;
pub mod problem;
pub mod routes;

use std::sync::Arc;
use std::time::Instant;

use axum::http::HeaderName;
use axum::{Json, Router};
use sqlx::PgPool;
use tokio::sync::RwLock;
use tower_http::request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer};
use tower_http::trace::TraceLayer;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;

const REQUEST_ID: HeaderName = HeaderName::from_static("x-request-id");

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub s3: aws_sdk_s3::Client,
    pub media: MediaConfig,
    pub http: reqwest::Client,
    pub upstreams: Arc<Upstreams>,
    pub caches: Caches,
}

/// External service locations and credentials. Base URLs are overridable so
/// tests can point them at unroutable addresses for deterministic failures.
pub struct Upstreams {
    pub github_api: String,
    pub github_html: String,
    pub spotify_api: String,
    pub spotify_accounts: String,
    pub recaptcha: String,
    pub posthog: String,
    pub weather_api: String,
    pub github_username: String,
    pub github_repo: String,
    pub recaptcha_secret: Option<String>,
    pub spotify_client_id: Option<String>,
    pub spotify_client_secret: Option<String>,
    pub spotify_refresh_token: Option<String>,
    pub posthog_api_key: Option<String>,
    pub posthog_project_id: Option<String>,
}

impl Upstreams {
    pub fn from_env() -> Self {
        let env_or =
            |key: &str, default: &str| std::env::var(key).unwrap_or_else(|_| default.to_owned());
        let opt = |key: &str| std::env::var(key).ok().filter(|v| !v.is_empty());
        Self {
            github_api: env_or("GITHUB_API_BASE", "https://api.github.com"),
            github_html: env_or("GITHUB_HTML_BASE", "https://github.com"),
            spotify_api: env_or("SPOTIFY_API_BASE", "https://api.spotify.com"),
            spotify_accounts: env_or("SPOTIFY_ACCOUNTS_BASE", "https://accounts.spotify.com"),
            recaptcha: env_or("RECAPTCHA_BASE", "https://www.google.com"),
            posthog: env_or("POSTHOG_BASE", "https://eu.posthog.com"),
            weather_api: env_or("WEATHER_API_BASE", "https://api.open-meteo.com"),
            github_username: env_or("GITHUB_USERNAME", "fredrir"),
            github_repo: env_or("GITHUB_REPO", "fredrir/portfolio"),
            recaptcha_secret: opt("RECAPTCHA_SECRET_KEY"),
            spotify_client_id: opt("SPOTIFY_CLIENT_ID"),
            spotify_client_secret: opt("SPOTIFY_CLIENT_SECRET"),
            spotify_refresh_token: opt("SPOTIFY_REFRESH_TOKEN"),
            posthog_api_key: opt("POSTHOG_API_KEY"),
            posthog_project_id: opt("POSTHOG_PROJECT_ID"),
        }
    }
}

type Cached<T> = Arc<RwLock<Option<(Instant, T)>>>;

#[derive(Clone, Default)]
pub struct Caches {
    pub github: Cached<routes::github::GitHubData>,
    pub posthog: Cached<routes::analytics::PosthogStats>,
    /// Short TTL: throttles Spotify's OAuth-refresh + 3-call fetch when the
    /// pane polls, without making now-playing noticeably stale.
    pub spotify: Cached<routes::spotify::SpotifyData>,
    pub weather: Arc<routes::weather::WeatherCacheState>,
}

#[derive(Clone)]
pub struct MediaConfig {
    pub bucket: String,
    pub admin_token: Option<String>,
    pub public_base_url: Option<String>,
}

#[derive(OpenApi)]
#[openapi(info(
    title = "Portfolio API",
    description = "Public API for the portfolio platform.",
    license(name = "MIT")
))]
struct ApiDoc;

fn openapi_router() -> OpenApiRouter<AppState> {
    OpenApiRouter::with_openapi(ApiDoc::openapi())
        .routes(routes!(routes::health::healthz))
        .routes(routes!(routes::health::readyz))
        .routes(routes!(routes::version::version))
        .routes(routes!(routes::visits::record_visit))
        .routes(routes!(routes::visits::visit_count))
        .routes(routes!(routes::contact::submit_contact))
        .routes(routes!(routes::media::create_upload))
        .routes(routes!(
            routes::media::update_media,
            routes::media::delete_media
        ))
        .routes(routes!(routes::media::rename_category))
        .routes(routes!(routes::media::admin_media))
        .routes(routes!(routes::media::media_status))
        .routes(routes!(routes::media::list_media))
        .routes(routes!(routes::media::gallery))
        .routes(routes!(routes::cv::active_cv))
        .routes(routes!(routes::github::github))
        .routes(routes!(routes::spotify::spotify))
        .routes(routes!(routes::analytics::analytics))
        .routes(routes!(routes::analytics::posthog_stats))
        .routes(routes!(routes::deployments::deployments))
        .routes(routes!(routes::weather::weather))
        .routes(routes!(routes::weather::weather_metrics))
        .routes(routes!(routes::audit::list_audit))
        .routes(routes!(routes::audit::verify_audit))
}

pub fn openapi_spec() -> utoipa::openapi::OpenApi {
    openapi_router().split_for_parts().1
}

pub fn app(state: AppState) -> Router {
    let (router, api) = openapi_router().split_for_parts();
    let trace = TraceLayer::new_for_http().make_span_with(|request: &axum::http::Request<_>| {
        let request_id = request
            .headers()
            .get(REQUEST_ID)
            .and_then(|v| v.to_str().ok())
            .unwrap_or("-");
        tracing::info_span!(
            "request",
            method = %request.method(),
            uri = %request.uri(),
            request_id = %request_id,
        )
    });
    router
        .route(
            "/api/openapi.json",
            axum::routing::get(|| async { Json(api) }),
        )
        // Edge-assigned request id flows into every span and back out on the
        // response; generated locally when absent (direct/internal calls).
        .layer(PropagateRequestIdLayer::new(REQUEST_ID))
        .layer(trace)
        .layer(SetRequestIdLayer::new(REQUEST_ID, MakeRequestUuid))
        .with_state(state)
}
