use axum::Json;
use axum::extract::State;
use serde::Serialize;
use utoipa::ToSchema;

use crate::AppState;
use crate::problem::ApiError;

#[derive(Serialize, ToSchema, sqlx::FromRow)]
pub struct CvVersion {
    pub lang: String,
    pub release_tag: String,
    pub sha256: String,
    pub size_bytes: i64,
    pub updated_at: String,
    #[sqlx(skip)]
    pub url: Option<String>,
    #[serde(skip)]
    #[sqlx(rename = "s3_key")]
    key: String,
}

/// Active CV versions per language, mirrored from the CV repository releases.
#[utoipa::path(get, path = "/api/v1/cv", tag = "cv",
    responses((status = 200, body = [CvVersion])))]
pub async fn active_cv(State(state): State<AppState>) -> Result<Json<Vec<CvVersion>>, ApiError> {
    let mut versions: Vec<CvVersion> = sqlx::query_as(
        "select lang, release_tag, sha256, size_bytes, \
                asset_updated_at::text as updated_at, s3_key \
         from cv_versions where active order by lang",
    )
    .fetch_all(&state.pool)
    .await?;

    for version in &mut versions {
        version.url = state
            .media
            .public_base_url
            .as_deref()
            .map(|base| format!("{}/{}", base.trim_end_matches('/'), version.key));
    }
    Ok(Json(versions))
}
