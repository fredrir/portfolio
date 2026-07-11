use axum::Json;
use serde::Serialize;
use utoipa::ToSchema;

#[derive(Serialize, ToSchema)]
pub struct VersionInfo {
    /// Crate version of the running binary.
    version: &'static str,
    /// Git commit the binary was built from.
    commit: &'static str,
}

/// Build information for the running deployment.
#[utoipa::path(get, path = "/api/v1/version", tag = "meta", responses(
    (status = 200, body = VersionInfo)
))]
pub async fn version() -> Json<VersionInfo> {
    Json(VersionInfo {
        // Release version injected at build time by CI's release job; falls
        // back to the crate version for local/dev builds.
        version: option_env!("APP_VERSION").unwrap_or(env!("CARGO_PKG_VERSION")),
        commit: option_env!("GIT_SHA").unwrap_or("unknown"),
    })
}
