use axum::Json;
use axum::extract::{Query, State};
use serde::{Deserialize, Serialize};
use serde_json::json;
use utoipa::ToSchema;

use crate::{AppState, Upstreams, captcha};

const CACHE_KEY: &str = "spotify_last_played";

#[derive(Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct SpotifyTrack {
    pub title: String,
    pub artist: String,
    pub album: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub album_art: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub song_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub track_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub preview_url: Option<String>,
}

#[derive(Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct SpotifyArtist {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub image_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub genres: Option<Vec<String>>,
}

/// Mirrors the shape the frontend consumed from the old TypeScript fetcher.
#[derive(Clone, Default, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct SpotifyData {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_playing: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ok: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub artist: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub album: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub album_art: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub song_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub track_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub preview_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub progress_ms: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration_ms: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recent_tracks: Option<Vec<SpotifyTrack>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_artists: Option<Vec<SpotifyArtist>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_played_at: Option<String>,
}

#[derive(Deserialize)]
struct RawTrack {
    name: String,
    artists: Vec<RawArtistName>,
    album: RawAlbum,
    external_urls: RawExternalUrls,
    id: String,
    preview_url: Option<String>,
    duration_ms: Option<u64>,
}

#[derive(Deserialize)]
struct RawArtistName {
    name: String,
}

#[derive(Deserialize)]
struct RawAlbum {
    name: String,
    images: Option<Vec<RawImage>>,
}

#[derive(Deserialize)]
struct RawImage {
    url: String,
}

#[derive(Deserialize)]
struct RawExternalUrls {
    spotify: String,
}

#[derive(Deserialize)]
struct RawArtist {
    name: String,
    images: Option<Vec<RawImage>>,
    external_urls: RawExternalUrls,
    genres: Option<Vec<String>>,
}

fn parse_track(track: &RawTrack) -> SpotifyTrack {
    SpotifyTrack {
        title: track.name.clone(),
        artist: track
            .artists
            .iter()
            .map(|a| a.name.as_str())
            .collect::<Vec<_>>()
            .join(", "),
        album: track.album.name.clone(),
        album_art: track
            .album
            .images
            .as_ref()
            .and_then(|i| i.first())
            .map(|i| i.url.clone()),
        song_url: Some(track.external_urls.spotify.clone()),
        track_id: Some(track.id.clone()),
        preview_url: track.preview_url.clone(),
    }
}

async fn access_token(http: &reqwest::Client, upstreams: &Upstreams) -> Result<String, String> {
    let (Some(id), Some(secret), Some(refresh)) = (
        upstreams.spotify_client_id.as_deref(),
        upstreams.spotify_client_secret.as_deref(),
        upstreams.spotify_refresh_token.as_deref(),
    ) else {
        return Err("credentials not set".into());
    };
    let res = http
        .post(format!("{}/api/token", upstreams.spotify_accounts))
        .basic_auth(id, Some(secret))
        .form(&[("grant_type", "refresh_token"), ("refresh_token", refresh)])
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;
    let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    body["access_token"]
        .as_str()
        .map(str::to_owned)
        .ok_or_else(|| "token response missing access_token".into())
}

async fn load_cache(state: &AppState) -> Option<SpotifyData> {
    let row: Option<(serde_json::Value, String)> =
        sqlx::query_as("select data, updated_at::text from spotify_cache where id = $1")
            .bind(CACHE_KEY)
            .fetch_optional(&state.pool)
            .await
            .ok()
            .flatten();
    row.and_then(|(data, updated_at)| {
        let mut parsed: SpotifyData = serde_json::from_value(data).ok()?;
        parsed.last_played_at = Some(updated_at);
        Some(parsed)
    })
}

async fn save_cache(state: &AppState, data: &SpotifyData) {
    let value = serde_json::to_value(data).unwrap_or_else(|_| json!({}));
    let result = sqlx::query(
        "insert into spotify_cache (id, data, updated_at) values ($1, $2, now()) \
         on conflict (id) do update set data = excluded.data, updated_at = now()",
    )
    .bind(CACHE_KEY)
    .bind(&value)
    .execute(&state.pool)
    .await;
    if let Err(err) = result {
        tracing::error!(error = %err, "spotify cache save failed");
    }
}

async fn fetch_fresh(state: &AppState) -> SpotifyData {
    let http = &state.http;
    let upstreams = &state.upstreams;
    let cached = load_cache(state).await;

    let token = match access_token(http, upstreams).await {
        Ok(token) => token,
        Err(err) => {
            tracing::warn!(error = %err, "spotify token refresh failed");
            if let Some(mut cached) = cached {
                cached.is_playing = Some(false);
                cached.progress_ms = None;
                cached.duration_ms = None;
                return cached;
            }
            return SpotifyData {
                is_playing: Some(false),
                ..Default::default()
            };
        }
    };

    let bearer = |url: String| http.get(url).bearer_auth(&token).send();
    let (now_playing, artists_res, recent_res) = tokio::join!(
        bearer(format!(
            "{}/v1/me/player/currently-playing",
            upstreams.spotify_api
        )),
        bearer(format!(
            "{}/v1/me/top/artists?time_range=short_term&limit=5",
            upstreams.spotify_api
        )),
        bearer(format!(
            "{}/v1/me/player/recently-played?limit=5",
            upstreams.spotify_api
        )),
    );

    let fresh_artists: Vec<SpotifyArtist> = match artists_res {
        Ok(res) if res.status().as_u16() == 200 => res
            .json::<serde_json::Value>()
            .await
            .ok()
            .and_then(|v| serde_json::from_value::<Vec<RawArtist>>(v["items"].clone()).ok())
            .map(|artists| {
                artists
                    .into_iter()
                    .map(|a| SpotifyArtist {
                        name: a.name,
                        image_url: a.images.and_then(|i| i.into_iter().next()).map(|i| i.url),
                        url: Some(a.external_urls.spotify),
                        genres: a.genres.map(|g| g.into_iter().take(2).collect()),
                    })
                    .collect()
            })
            .unwrap_or_default(),
        _ => Vec::new(),
    };

    let (fresh_tracks, last_played_at): (Vec<SpotifyTrack>, Option<String>) = match recent_res {
        Ok(res) if res.status().as_u16() == 200 => match res.json::<serde_json::Value>().await {
            Ok(v) => {
                let items = v["items"].as_array().cloned().unwrap_or_default();
                let last = items
                    .first()
                    .and_then(|i| i["played_at"].as_str())
                    .map(str::to_owned);
                let tracks = items
                    .iter()
                    .filter_map(|i| serde_json::from_value::<RawTrack>(i["track"].clone()).ok())
                    .map(|t| parse_track(&t))
                    .collect();
                (tracks, last)
            }
            Err(_) => (Vec::new(), None),
        },
        _ => (Vec::new(), None),
    };

    let top_artists = if fresh_artists.is_empty() {
        cached
            .as_ref()
            .and_then(|c| c.top_artists.clone())
            .unwrap_or_default()
    } else {
        fresh_artists
    };
    let recent_tracks = if fresh_tracks.is_empty() {
        cached
            .as_ref()
            .and_then(|c| c.recent_tracks.clone())
            .unwrap_or_default()
    } else {
        fresh_tracks
    };

    if let Ok(res) = now_playing
        && res.status().as_u16() == 200
        && let Ok(body) = res.json::<serde_json::Value>().await
        && body["is_playing"].as_bool() == Some(true)
        && let Ok(item) = serde_json::from_value::<RawTrack>(body["item"].clone())
    {
        let track = parse_track(&item);
        let result = SpotifyData {
            is_playing: Some(true),
            title: Some(track.title.clone()),
            artist: Some(track.artist.clone()),
            album: Some(track.album.clone()),
            album_art: track.album_art.clone(),
            song_url: track.song_url.clone(),
            track_id: track.track_id.clone(),
            preview_url: track.preview_url.clone(),
            progress_ms: body["progress_ms"].as_u64(),
            duration_ms: item.duration_ms,
            top_artists: Some(top_artists),
            recent_tracks: Some(recent_tracks),
            ..Default::default()
        };
        save_cache(state, &result).await;
        return result;
    }

    if let Some(last) = recent_tracks.first().cloned() {
        let result = SpotifyData {
            is_playing: Some(false),
            title: Some(last.title),
            artist: Some(last.artist),
            album: Some(last.album),
            album_art: last.album_art,
            song_url: last.song_url,
            track_id: last.track_id,
            preview_url: last.preview_url,
            last_played_at,
            top_artists: Some(top_artists),
            recent_tracks: Some(recent_tracks[1..].to_vec()),
            ..Default::default()
        };
        save_cache(state, &result).await;
        return result;
    }

    if let Some(mut cached) = cached {
        cached.is_playing = Some(false);
        cached.progress_ms = None;
        cached.duration_ms = None;
        cached.top_artists = Some(top_artists);
        cached.recent_tracks = Some(recent_tracks);
        return cached;
    }

    SpotifyData {
        is_playing: Some(false),
        top_artists: Some(top_artists),
        recent_tracks: Some(recent_tracks),
        ..Default::default()
    }
}

#[derive(Deserialize, utoipa::IntoParams)]
pub struct SpotifyParams {
    /// reCAPTCHA v3 token for the `spotify_data` action.
    pub recaptcha_token: String,
}

/// Current/recent playback and top artists (captcha-gated like the old
/// server action; credentials-missing and upstream failures degrade to the
/// database cache).
#[utoipa::path(get, path = "/api/v1/spotify", tag = "spotify",
    params(SpotifyParams),
    responses((status = 200, body = SpotifyData)))]
pub async fn spotify(
    State(state): State<AppState>,
    Query(params): Query<SpotifyParams>,
) -> Json<SpotifyData> {
    let passed = captcha::verify(
        &state.http,
        &state.upstreams,
        &params.recaptcha_token,
        "spotify_data",
        0.3,
    )
    .await;
    if !passed {
        return Json(SpotifyData {
            ok: Some(false),
            error: Some("captcha_failed".into()),
            ..Default::default()
        });
    }

    if state.upstreams.spotify_client_id.is_none()
        || state.upstreams.spotify_client_secret.is_none()
        || state.upstreams.spotify_refresh_token.is_none()
    {
        return Json(SpotifyData {
            ok: Some(false),
            error: Some("Spotify credentials not set".into()),
            ..Default::default()
        });
    }

    Json(fetch_fresh(&state).await)
}
