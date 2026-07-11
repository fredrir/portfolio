pub mod problem;
pub mod routes;

use axum::http::HeaderName;
use axum::{Json, Router};
use sqlx::PgPool;
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
        .routes(routes!(routes::media::list_media))
        .routes(routes!(routes::cv::active_cv))
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
