pub mod problem;
pub mod routes;

use axum::{Json, Router};
use sqlx::PgPool;
use tower_http::trace::TraceLayer;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub s3: aws_sdk_s3::Client,
    pub media: MediaConfig,
}

#[derive(Clone)]
pub struct MediaConfig {
    pub bucket: String,
    /// Bearer token for the administration endpoints; None disables them.
    pub admin_token: Option<String>,
    /// Public base URL for serving media variants, if configured.
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
}

/// The OpenAPI document describing every registered route.
pub fn openapi_spec() -> utoipa::openapi::OpenApi {
    openapi_router().split_for_parts().1
}

pub fn app(state: AppState) -> Router {
    let (router, api) = openapi_router().split_for_parts();
    router
        .route(
            "/api/openapi.json",
            axum::routing::get(|| async { Json(api) }),
        )
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}
