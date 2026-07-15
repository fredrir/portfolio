use axum::Json;
use serde::Serialize;
use utoipa::ToSchema;

#[derive(Serialize, ToSchema)]
pub struct VersionInfo {
    /// Release version of the running deployment.
    version: String,
    /// Git commit of the running deployment.
    commit: String,
}

/// Build information for the running deployment.
#[utoipa::path(get, path = "/api/v1/version", tag = "meta", responses(
    (status = 200, body = VersionInfo)
))]
pub async fn version() -> Json<VersionInfo> {
    Json(VersionInfo {
        // Release metadata is injected into the final container rather than
        // compiled into the binary, allowing CI to reuse the Rust build layer.
        version: non_empty_env("APP_VERSION", env!("CARGO_PKG_VERSION")),
        commit: non_empty_env("GIT_SHA", "unknown"),
    })
}

fn non_empty_env(name: &str, fallback: &str) -> String {
    std::env::var(name)
        .ok()
        .filter(|value| !value.is_empty())
        .unwrap_or_else(|| fallback.to_owned())
}
