use std::sync::atomic::{AtomicU64, Ordering};
use std::time::Duration;

use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use tokio::time::MissedTickBehavior;
use utoipa::ToSchema;

use crate::AppState;
use crate::problem::Problem;

const CACHE_KEY: &str = "weather:trondheim";
const CACHE_TTL: Duration = Duration::from_secs(15 * 60);
const PROACTIVE_REFRESH_AGE: Duration = Duration::from_secs(12 * 60);
const BACKGROUND_CHECK_INTERVAL: Duration = Duration::from_secs(60);
const MAX_STALE_AGE: Duration = Duration::from_secs(6 * 60 * 60);
const UPSTREAM_TIMEOUT: Duration = Duration::from_secs(5);

#[derive(Clone, Deserialize, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WeatherData {
    pub location: String,
    pub temperature_c: f64,
    pub weather_code: u16,
    pub observed_at: String,
    pub stale: bool,
}

#[derive(Default)]
pub struct WeatherCacheState {
    refresh: Mutex<()>,
    cache_hits: AtomicU64,
    cache_misses: AtomicU64,
    stale_served: AtomicU64,
    refresh_successes: AtomicU64,
    refresh_failures: AtomicU64,
    background_refreshes: AtomicU64,
    coalesced_requests: AtomicU64,
}

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WeatherMetricsSnapshot {
    cache_hits: u64,
    cache_misses: u64,
    stale_served: u64,
    refresh_successes: u64,
    refresh_failures: u64,
    background_refreshes: u64,
    coalesced_requests: u64,
}

impl WeatherCacheState {
    fn snapshot(&self) -> WeatherMetricsSnapshot {
        let load = |counter: &AtomicU64| counter.load(Ordering::Relaxed);
        WeatherMetricsSnapshot {
            cache_hits: load(&self.cache_hits),
            cache_misses: load(&self.cache_misses),
            stale_served: load(&self.stale_served),
            refresh_successes: load(&self.refresh_successes),
            refresh_failures: load(&self.refresh_failures),
            background_refreshes: load(&self.background_refreshes),
            coalesced_requests: load(&self.coalesced_requests),
        }
    }
}

#[derive(Deserialize)]
struct OpenMeteoResponse {
    current: OpenMeteoCurrent,
}

#[derive(Deserialize)]
struct OpenMeteoCurrent {
    time: String,
    temperature_2m: f64,
    weather_code: u16,
}

async fn load_cache(state: &AppState) -> Option<(f64, WeatherData)> {
    let row: Result<Option<(serde_json::Value, f64)>, sqlx::Error> = sqlx::query_as(
        "select data, extract(epoch from now() - updated_at)::float8 \
         from upstream_cache where id = $1",
    )
    .bind(CACHE_KEY)
    .fetch_optional(&state.pool)
    .await;

    match row {
        Ok(Some((data, age))) => match serde_json::from_value(data) {
            Ok(weather) => Some((age.max(0.0), weather)),
            Err(error) => {
                tracing::warn!(%error, cache = CACHE_KEY, "weather cache contains invalid data");
                None
            }
        },
        Ok(None) => None,
        Err(error) => {
            tracing::warn!(%error, cache = CACHE_KEY, "weather cache read failed");
            None
        }
    }
}

async fn save_cache(state: &AppState, weather: &WeatherData) -> Result<(), String> {
    let data = serde_json::to_value(weather).map_err(|error| error.to_string())?;
    sqlx::query(
        "insert into upstream_cache (id, data, updated_at) values ($1, $2, now()) \
         on conflict (id) do update set data = excluded.data, updated_at = now()",
    )
    .bind(CACHE_KEY)
    .bind(data)
    .execute(&state.pool)
    .await
    .map_err(|error| error.to_string())?;
    Ok(())
}

async fn fetch_weather(state: &AppState) -> Result<WeatherData, String> {
    let url = format!(
        "{}/v1/forecast?latitude=63.4305&longitude=10.3951\
         &current=temperature_2m,weather_code&temperature_unit=celsius\
         &timezone=Europe%2FOslo&forecast_days=1",
        state.upstreams.weather_api.trim_end_matches('/')
    );
    let response = state
        .http
        .get(url)
        .header("Accept", "application/json")
        .timeout(UPSTREAM_TIMEOUT)
        .send()
        .await
        .map_err(|error| error.to_string())?
        .error_for_status()
        .map_err(|error| error.to_string())?
        .json::<OpenMeteoResponse>()
        .await
        .map_err(|error| error.to_string())?;

    let current = response.current;
    if !current.temperature_2m.is_finite()
        || !(-100.0..=70.0).contains(&current.temperature_2m)
        || current.weather_code > 99
        || current.time.is_empty()
    {
        return Err("weather response failed validation".into());
    }

    Ok(WeatherData {
        location: "Trondheim".into(),
        temperature_c: current.temperature_2m,
        weather_code: current.weather_code,
        observed_at: current.time,
        stale: false,
    })
}

fn is_younger_than(cached: &Option<(f64, WeatherData)>, age: Duration) -> bool {
    cached
        .as_ref()
        .is_some_and(|(cache_age, _)| *cache_age < age.as_secs_f64())
}

fn stale_fallback(state: &AppState, cached: Option<(f64, WeatherData)>) -> Option<WeatherData> {
    let (age, mut data) = cached?;
    if age >= MAX_STALE_AGE.as_secs_f64() {
        return None;
    }
    data.stale = true;
    state
        .caches
        .weather
        .stale_served
        .fetch_add(1, Ordering::Relaxed);
    tracing::info!(
        cache = CACHE_KEY,
        cache_status = "stale",
        cache_age_seconds = age,
        "weather cache access"
    );
    Some(data)
}

/// Refreshes the persisted snapshot once it reaches the proactive threshold.
pub async fn refresh_if_due(state: &AppState) {
    let cached = load_cache(state).await;
    if is_younger_than(&cached, PROACTIVE_REFRESH_AGE) {
        return;
    }

    let cache_state = state.caches.weather.clone();
    let Ok(_refresh) = cache_state.refresh.try_lock() else {
        tracing::debug!(
            cache = CACHE_KEY,
            "background weather refresh already in progress"
        );
        return;
    };

    if is_younger_than(&load_cache(state).await, PROACTIVE_REFRESH_AGE) {
        return;
    }

    match fetch_weather(state).await {
        Ok(weather) => match save_cache(state, &weather).await {
            Ok(()) => {
                cache_state
                    .refresh_successes
                    .fetch_add(1, Ordering::Relaxed);
                cache_state
                    .background_refreshes
                    .fetch_add(1, Ordering::Relaxed);
                tracing::info!(
                    cache = CACHE_KEY,
                    cache_status = "refreshed",
                    refresh_trigger = "background",
                    "weather cache refresh"
                );
            }
            Err(error) => {
                cache_state.refresh_failures.fetch_add(1, Ordering::Relaxed);
                tracing::warn!(
                    %error,
                    cache = CACHE_KEY,
                    refresh_trigger = "background",
                    "weather cache persistence failed"
                );
            }
        },
        Err(error) => {
            cache_state.refresh_failures.fetch_add(1, Ordering::Relaxed);
            tracing::warn!(
                %error,
                cache = CACHE_KEY,
                refresh_trigger = "background",
                "weather cache refresh failed"
            );
        }
    }
}

/// Periodically refreshes weather before request-time cache expiry.
pub async fn refresh_loop(state: AppState) {
    let mut interval = tokio::time::interval(BACKGROUND_CHECK_INTERVAL);
    interval.set_missed_tick_behavior(MissedTickBehavior::Skip);
    loop {
        interval.tick().await;
        refresh_if_due(&state).await;
    }
}

/// Current weather for Trondheim, cached in Postgres for 15 minutes.
#[utoipa::path(get, path = "/api/v1/weather", tag = "weather",
    responses(
        (status = 200, body = WeatherData),
        (status = 502, description = "Upstream unavailable and no recent cache", body = Problem)
    ))]
pub async fn weather(State(state): State<AppState>) -> Result<Json<WeatherData>, Problem> {
    let cache_state = state.caches.weather.clone();
    let cached = load_cache(&state).await;
    if let Some((age, data)) = &cached
        && *age < CACHE_TTL.as_secs_f64()
    {
        cache_state.cache_hits.fetch_add(1, Ordering::Relaxed);
        tracing::info!(
            cache = CACHE_KEY,
            cache_status = "hit",
            cache_age_seconds = *age,
            "weather cache access"
        );
        return Ok(Json(data.clone()));
    }

    cache_state.cache_misses.fetch_add(1, Ordering::Relaxed);
    tracing::info!(
        cache = CACHE_KEY,
        cache_status = "miss",
        "weather cache access"
    );

    let (refresh, waited) = match cache_state.refresh.try_lock() {
        Ok(refresh) => (refresh, false),
        Err(_) => {
            cache_state
                .coalesced_requests
                .fetch_add(1, Ordering::Relaxed);
            (cache_state.refresh.lock().await, true)
        }
    };

    let latest = load_cache(&state).await;
    if let Some((age, data)) = &latest
        && *age < CACHE_TTL.as_secs_f64()
    {
        drop(refresh);
        tracing::info!(
            cache = CACHE_KEY,
            cache_status = "coalesced",
            cache_age_seconds = *age,
            "weather cache access"
        );
        return Ok(Json(data.clone()));
    }

    if waited {
        drop(refresh);
        return stale_fallback(&state, latest.or(cached))
            .map(Json)
            .ok_or_else(|| Problem::new(StatusCode::BAD_GATEWAY, "Weather unavailable"));
    }

    let result = match fetch_weather(&state).await {
        Ok(weather) => {
            match save_cache(&state, &weather).await {
                Ok(()) => {
                    cache_state
                        .refresh_successes
                        .fetch_add(1, Ordering::Relaxed);
                    tracing::info!(
                        cache = CACHE_KEY,
                        cache_status = "refreshed",
                        refresh_trigger = "request",
                        "weather cache refresh"
                    );
                }
                Err(error) => {
                    cache_state.refresh_failures.fetch_add(1, Ordering::Relaxed);
                    tracing::warn!(
                        %error,
                        cache = CACHE_KEY,
                        refresh_trigger = "request",
                        "weather cache persistence failed"
                    );
                }
            }
            Ok(Json(weather))
        }
        Err(error) => {
            cache_state.refresh_failures.fetch_add(1, Ordering::Relaxed);
            tracing::warn!(
                %error,
                cache = CACHE_KEY,
                refresh_trigger = "request",
                "weather cache refresh failed; serving recent stale cache if available"
            );
            stale_fallback(&state, latest.or(cached))
                .map(Json)
                .ok_or_else(|| Problem::new(StatusCode::BAD_GATEWAY, "Weather unavailable"))
        }
    };
    drop(refresh);
    result
}

/// Process-local weather cache counters for operational diagnostics.
#[utoipa::path(get, path = "/api/v1/weather/metrics", tag = "weather",
    responses((status = 200, body = WeatherMetricsSnapshot)))]
pub async fn weather_metrics(State(state): State<AppState>) -> Json<WeatherMetricsSnapshot> {
    Json(state.caches.weather.snapshot())
}
