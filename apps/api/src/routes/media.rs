use std::collections::BTreeMap;
use std::time::Duration;

use aws_sdk_s3::presigning::PresigningConfig;
use axum::Json;
use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use serde::{Deserialize, Serialize};
use subtle::ConstantTimeEq;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::problem::{ApiError, Problem};
use crate::{AppState, audit};

const MAX_UPLOAD_BYTES: i64 = 25 * 1024 * 1024;
const PRESIGN_EXPIRY: Duration = Duration::from_secs(900);
const ALLOWED_CONTENT_TYPES: [&str; 3] = ["image/jpeg", "image/png", "image/webp"];

pub fn require_admin(state: &AppState, headers: &HeaderMap) -> Result<(), Problem> {
    let Some(expected) = state.media.admin_token.as_deref() else {
        return Err(Problem::new(
            StatusCode::SERVICE_UNAVAILABLE,
            "Administration API is disabled",
        ));
    };
    let provided = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .unwrap_or_default();
    if provided.as_bytes().ct_eq(expected.as_bytes()).into() {
        Ok(())
    } else {
        Err(Problem::new(StatusCode::UNAUTHORIZED, "Unauthorized"))
    }
}

/// Lowercased, charset-restricted gallery grouping key; None when nothing
/// usable remains.
pub fn sanitize_category(raw: &str) -> Option<String> {
    let cleaned: String = raw
        .to_lowercase()
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-') {
                c
            } else {
                '_'
            }
        })
        .collect();
    let trimmed = cleaned.trim_matches(['_', '.']).to_owned();
    (!trimmed.is_empty() && trimmed.chars().count() <= 64).then_some(trimmed)
}

pub fn sanitize_filename(filename: &str) -> String {
    let cleaned: String = filename
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-') {
                c
            } else {
                '_'
            }
        })
        .collect();
    let trimmed = cleaned.trim_matches(['_', '.']).to_owned();
    if trimmed.is_empty() {
        "upload".to_owned()
    } else {
        trimmed
    }
}

#[derive(Deserialize, ToSchema)]
pub struct CreateUploadRequest {
    pub filename: String,
    /// Must be one of image/jpeg, image/png, image/webp.
    pub content_type: String,
    pub size_bytes: i64,
    /// Gallery grouping key, e.g. an album name (sanitized, lowercased).
    #[serde(default)]
    pub category: Option<String>,
}

#[derive(Serialize, ToSchema)]
pub struct CreateUploadResponse {
    pub media_id: Uuid,
    /// Presigned S3 PUT URL for the original object.
    pub upload_url: String,
    /// Headers the client must send with the PUT exactly as given.
    pub headers: BTreeMap<String, String>,
    pub expires_in_seconds: u64,
}

/// Authorize a direct-to-S3 media upload (administration).
#[utoipa::path(post, path = "/api/v1/media/uploads", tag = "media",
    request_body = CreateUploadRequest,
    responses(
        (status = 201, body = CreateUploadResponse),
        (status = 401, description = "Missing or invalid bearer token", body = Problem),
        (status = 422, description = "Validation failed", body = Problem),
        (status = 503, description = "Administration API disabled", body = Problem)
    ))]
pub async fn create_upload(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<CreateUploadRequest>,
) -> Result<(StatusCode, Json<CreateUploadResponse>), axum::response::Response> {
    use axum::response::IntoResponse;

    require_admin(&state, &headers).map_err(|p| p.into_response())?;

    let mut errors = BTreeMap::new();
    if !ALLOWED_CONTENT_TYPES.contains(&body.content_type.as_str()) {
        errors.insert(
            "content_type".to_owned(),
            format!("Must be one of: {}", ALLOWED_CONTENT_TYPES.join(", ")),
        );
    }
    if body.size_bytes <= 0 || body.size_bytes > MAX_UPLOAD_BYTES {
        errors.insert(
            "size_bytes".to_owned(),
            format!("Must be between 1 and {MAX_UPLOAD_BYTES} bytes"),
        );
    }
    let category = match body.category.as_deref() {
        None => None,
        Some(raw) => match sanitize_category(raw) {
            Some(c) => Some(c),
            None => {
                errors.insert(
                    "category".to_owned(),
                    "Must be 1-64 chars of letters, digits, ._-".to_owned(),
                );
                None
            }
        },
    };
    if !errors.is_empty() {
        return Err(ApiError::Validation(errors).into_response());
    }

    let filename = sanitize_filename(&body.filename);
    let media_id = Uuid::new_v4();
    let original_key = format!("originals/{media_id}/{filename}");

    let mut tx = state
        .pool
        .begin()
        .await
        .map_err(|e| ApiError::from(e).into_response())?;
    sqlx::query(
        "insert into media (id, original_key, filename, content_type, size_bytes, category) \
         values ($1, $2, $3, $4, $5, $6)",
    )
    .bind(media_id)
    .bind(&original_key)
    .bind(&filename)
    .bind(&body.content_type)
    .bind(body.size_bytes)
    .bind(&category)
    .execute(&mut *tx)
    .await
    .map_err(|e| ApiError::from(e).into_response())?;
    audit::record(
        &mut tx,
        "media.upload_authorized",
        serde_json::json!({
            "media_id": media_id,
            "filename": filename,
            "content_type": body.content_type,
            "size_bytes": body.size_bytes,
            "category": category,
        }),
    )
    .await
    .map_err(|e| ApiError::from(e).into_response())?;
    tx.commit()
        .await
        .map_err(|e| ApiError::from(e).into_response())?;

    let presigned = state
        .s3
        .put_object()
        .bucket(&state.media.bucket)
        .key(&original_key)
        .content_type(&body.content_type)
        .content_length(body.size_bytes)
        .presigned(PresigningConfig::expires_in(PRESIGN_EXPIRY).expect("static expiry is valid"))
        .await
        .map_err(|e| ApiError::Internal(format!("presigning failed: {e}")).into_response())?;

    let headers = presigned
        .headers()
        .map(|(k, v)| (k.to_owned(), v.to_owned()))
        .collect();

    Ok((
        StatusCode::CREATED,
        Json(CreateUploadResponse {
            media_id,
            upload_url: presigned.uri().to_string(),
            headers,
            expires_in_seconds: PRESIGN_EXPIRY.as_secs(),
        }),
    ))
}

#[derive(Serialize, ToSchema)]
pub struct MediaVariant {
    pub format: String,
    pub key: String,
    pub width: i32,
    pub height: i32,
    pub size_bytes: i64,
    /// Absolute URL when a public media base URL is configured.
    pub url: Option<String>,
}

#[derive(Serialize, ToSchema)]
pub struct MediaItem {
    pub id: Uuid,
    pub filename: String,
    pub content_type: String,
    pub category: Option<String>,
    pub state: String,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub content_hash: Option<String>,
    pub variants: Vec<MediaVariant>,
}

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct GalleryImage {
    pub src: String,
    pub original_src: String,
    pub filename: String,
    pub date: Option<String>,
}

#[derive(Serialize, ToSchema)]
pub struct GalleryCategory {
    pub name: String,
    pub images: Vec<GalleryImage>,
}

#[derive(Deserialize, utoipa::IntoParams)]
pub struct ListMediaParams {
    /// Restrict to one gallery category.
    pub category: Option<String>,
    /// Include unprocessed items (requires the admin bearer token).
    pub include_pending: Option<bool>,
}

#[derive(sqlx::FromRow)]
struct MediaListRow {
    id: Uuid,
    filename: String,
    content_type: String,
    category: Option<String>,
    state: String,
    width: Option<i32>,
    height: Option<i32>,
    content_hash: Option<String>,
    v_format: Option<String>,
    v_key: Option<String>,
    v_width: Option<i32>,
    v_height: Option<i32>,
    v_size_bytes: Option<i64>,
}

#[derive(sqlx::FromRow)]
struct GalleryRow {
    filename: String,
    category: String,
    variant_key: String,
}

fn parse_date_from_filename(filename: &str) -> Option<String> {
    let bytes = filename.as_bytes();
    if bytes.len() < 15 || bytes[8] != b'_' {
        return None;
    }
    let date_time = [
        &bytes[0..4],
        &bytes[4..6],
        &bytes[6..8],
        &bytes[9..11],
        &bytes[11..13],
        &bytes[13..15],
    ];
    if date_time
        .iter()
        .flat_map(|part| part.iter())
        .any(|b| !b.is_ascii_digit())
    {
        return None;
    }
    Some(format!(
        "{}-{}-{}T{}:{}:{}",
        std::str::from_utf8(date_time[0]).ok()?,
        std::str::from_utf8(date_time[1]).ok()?,
        std::str::from_utf8(date_time[2]).ok()?,
        std::str::from_utf8(date_time[3]).ok()?,
        std::str::from_utf8(date_time[4]).ok()?,
        std::str::from_utf8(date_time[5]).ok()?,
    ))
}

/// List processed media with their generated variants.
#[utoipa::path(get, path = "/api/v1/media", tag = "media",
    params(ListMediaParams),
    responses(
        (status = 200, body = [MediaItem]),
        (status = 401, description = "include_pending without admin token", body = Problem)
    ))]
pub async fn list_media(
    State(state): State<AppState>,
    headers: HeaderMap,
    axum::extract::Query(params): axum::extract::Query<ListMediaParams>,
) -> Result<Json<Vec<MediaItem>>, axum::response::Response> {
    use axum::response::IntoResponse;

    let include_pending = params.include_pending.unwrap_or(false);
    if include_pending {
        require_admin(&state, &headers).map_err(|p| p.into_response())?;
    }

    let rows: Vec<MediaListRow> = sqlx::query_as(
        "select m.id, m.filename, m.content_type, m.category, m.state, \
                m.width, m.height, m.content_hash, \
                v.format as v_format, v.key as v_key, v.width as v_width, \
                v.height as v_height, v.size_bytes as v_size_bytes \
         from media m \
         left join media_variants v on v.media_id = m.id \
         where (m.state = 'ready' or $1) \
           and ($2::text is null or m.category = $2) \
         order by m.created_at desc, m.id, v.format",
    )
    .bind(include_pending)
    .bind(&params.category)
    .fetch_all(&state.pool)
    .await
    .map_err(|e| ApiError::from(e).into_response())?;

    let mut items: Vec<MediaItem> = Vec::new();
    for row in rows {
        if items.last().map(|i| i.id) != Some(row.id) {
            items.push(MediaItem {
                id: row.id,
                filename: row.filename,
                content_type: row.content_type,
                category: row.category,
                state: row.state,
                width: row.width,
                height: row.height,
                content_hash: row.content_hash,
                variants: Vec::new(),
            });
        }
        if let (Some(format), Some(key), Some(w), Some(h), Some(size)) = (
            row.v_format,
            row.v_key,
            row.v_width,
            row.v_height,
            row.v_size_bytes,
        ) {
            let url = state
                .media
                .public_base_url
                .as_deref()
                .map(|base| format!("{}/{key}", base.trim_end_matches('/')));
            items
                .last_mut()
                .expect("just pushed")
                .variants
                .push(MediaVariant {
                    format,
                    key,
                    width: w,
                    height: h,
                    size_bytes: size,
                    url,
                });
        }
    }
    Ok(Json(items))
}

/// Gallery-ready media grouped and sorted for direct UI consumption.
#[utoipa::path(get, path = "/api/v1/gallery", tag = "media",
    responses((status = 200, body = [GalleryCategory])))]
pub async fn gallery(
    State(state): State<AppState>,
) -> Result<Json<Vec<GalleryCategory>>, ApiError> {
    let Some(public_base_url) = state.media.public_base_url.as_deref() else {
        return Ok(Json(Vec::new()));
    };
    let public_base_url = public_base_url.trim_end_matches('/');

    let rows: Vec<GalleryRow> = sqlx::query_as(
        "select m.filename, coalesce(m.category, 'uncategorized') as category, \
                v.key as variant_key \
         from media m \
         join lateral ( \
             select format, key \
             from media_variants \
             where media_id = m.id \
             order by case format when 'webp' then 0 when 'avif' then 1 else 2 end \
             limit 1 \
         ) v on true \
         where m.state = 'ready'",
    )
    .fetch_all(&state.pool)
    .await?;

    let mut by_category = BTreeMap::<String, Vec<GalleryImage>>::new();
    for row in rows {
        let src = format!("{public_base_url}/{}", row.variant_key);
        by_category
            .entry(row.category)
            .or_default()
            .push(GalleryImage {
                src: src.clone(),
                original_src: src,
                filename: row.filename.clone(),
                date: parse_date_from_filename(&row.filename),
            });
    }

    Ok(Json(
        by_category
            .into_iter()
            .map(|(name, mut images)| {
                images.sort_by(|a, b| match (&a.date, &b.date) {
                    (Some(a_date), Some(b_date)) => b_date.cmp(a_date),
                    _ => a.filename.cmp(&b.filename),
                });
                GalleryCategory { name, images }
            })
            .collect(),
    ))
}

#[cfg(test)]
mod props {
    use proptest::prelude::*;

    use super::{sanitize_category, sanitize_filename};

    proptest! {
        #[test]
        fn filename_sanitization_is_idempotent_and_safe(input in ".{0,80}") {
            let once = sanitize_filename(&input);
            prop_assert!(!once.is_empty());
            prop_assert!(once.chars().all(|c| c.is_ascii_alphanumeric()
                || matches!(c, '.' | '_' | '-')));
            prop_assert_eq!(sanitize_filename(&once), once.clone());
        }

        #[test]
        fn category_sanitization_bounds(input in ".{0,100}") {
            if let Some(category) = sanitize_category(&input) {
                prop_assert!(!category.is_empty());
                prop_assert!(category.chars().count() <= 64);
                prop_assert!(category.chars().all(|c| c.is_ascii_alphanumeric()
                    || matches!(c, '.' | '_' | '-')));
                prop_assert_eq!(category.to_lowercase(), category.clone());
            }
        }
    }
}
