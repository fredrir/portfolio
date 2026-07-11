use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use http_body_util::BodyExt;
use portfolio_api::{AppState, Caches, MediaConfig, Upstreams, app};
use serde_json::{Value, json};
use sqlx::PgPool;
use tower::ServiceExt;

const TEST_ADMIN_TOKEN: &str = "test-admin-token";

fn test_state(pool: PgPool) -> AppState {
    test_state_with_public_base(pool, None)
}

fn test_state_with_public_base(pool: PgPool, public_base_url: Option<String>) -> AppState {
    let credentials = aws_sdk_s3::config::Credentials::new("test", "test", None, None, "test");
    let config = aws_sdk_s3::config::Builder::new()
        .behavior_version(aws_sdk_s3::config::BehaviorVersion::latest())
        .region(aws_sdk_s3::config::Region::new("eu-north-1"))
        .credentials_provider(credentials)
        .endpoint_url("http://localhost:4566")
        .force_path_style(true)
        .build();
    // Unroutable bases make external-service failure paths deterministic;
    // captcha passes because no secret is configured in tests.
    let upstreams = Upstreams {
        github_api: "http://127.0.0.1:9".into(),
        github_html: "http://127.0.0.1:9".into(),
        spotify_api: "http://127.0.0.1:9".into(),
        spotify_accounts: "http://127.0.0.1:9".into(),
        recaptcha: "http://127.0.0.1:9".into(),
        posthog: "http://127.0.0.1:9".into(),
        github_username: "fredrir".into(),
        github_repo: "fredrir/portfolio".into(),
        recaptcha_secret: None,
        spotify_client_id: None,
        spotify_client_secret: None,
        spotify_refresh_token: None,
        posthog_api_key: None,
        posthog_project_id: None,
    };
    AppState {
        pool,
        s3: aws_sdk_s3::Client::from_conf(config),
        media: MediaConfig {
            bucket: "test-media".into(),
            admin_token: Some(TEST_ADMIN_TOKEN.into()),
            public_base_url,
        },
        http: reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(2))
            .build()
            .expect("http client"),
        upstreams: std::sync::Arc::new(upstreams),
        caches: Caches::default(),
    }
}

async fn send(pool: PgPool, request: Request<Body>) -> (StatusCode, Value) {
    let response = app(test_state(pool)).oneshot(request).await.unwrap();
    let status = response.status();
    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    let body = if bytes.is_empty() {
        Value::Null
    } else {
        serde_json::from_slice(&bytes).unwrap()
    };
    (status, body)
}

fn post_json(uri: &str, body: Value) -> Request<Body> {
    Request::post(uri)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(body.to_string()))
        .unwrap()
}

#[sqlx::test]
async fn healthz_is_alive(pool: PgPool) {
    let (status, _) = send(pool, Request::get("/healthz").body(Body::empty()).unwrap()).await;
    assert_eq!(status, StatusCode::OK);
}

#[sqlx::test]
async fn readyz_checks_database(pool: PgPool) {
    let (status, _) = send(pool, Request::get("/readyz").body(Body::empty()).unwrap()).await;
    assert_eq!(status, StatusCode::OK);
}

#[sqlx::test]
async fn version_reports_build_info(pool: PgPool) {
    let (status, body) = send(
        pool,
        Request::get("/api/v1/version").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["version"], env!("CARGO_PKG_VERSION"));
    assert!(body["commit"].is_string());
}

#[sqlx::test]
async fn openapi_document_is_served(pool: PgPool) {
    let (status, body) = send(
        pool,
        Request::get("/api/openapi.json")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["info"]["title"], "Portfolio API");
    assert!(body["paths"]["/api/v1/contact"].is_object());
}

#[sqlx::test]
async fn recording_a_visit_increments_count(pool: PgPool) {
    let (status, body) = send(
        pool.clone(),
        post_json(
            "/api/v1/visits",
            json!({ "page": "/", "referrer": "https://example.com", "recaptcha_token": "test" }),
        ),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["count"], 1);

    let (status, body) = send(
        pool,
        Request::get("/api/v1/visits/count")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["count"], 1);
}

#[sqlx::test]
async fn valid_contact_submission_is_stored(pool: PgPool) {
    let (status, body) = send(
        pool.clone(),
        post_json(
            "/api/v1/contact",
            json!({
                "name": "Ada Lovelace",
                "email": "ada@example.com",
                "message": "Hello there",
                "recaptcha_token": "test"
            }),
        ),
    )
    .await;
    assert_eq!(status, StatusCode::CREATED);
    assert!(body["id"].is_string());

    let (count,): (i64,) =
        sqlx::query_as("select count(*) from contact_messages where delivery_state = 'pending'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(count, 1);
}

#[sqlx::test]
async fn invalid_contact_submission_returns_problem_details(pool: PgPool) {
    let request = post_json(
        "/api/v1/contact",
        json!({ "name": "", "email": "not-an-email", "message": "", "recaptcha_token": "test" }),
    );
    let response = app(test_state(pool)).oneshot(request).await.unwrap();
    assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
    assert_eq!(
        response.headers()[header::CONTENT_TYPE],
        "application/problem+json"
    );

    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(body["status"], 422);
    assert!(body["errors"]["name"].is_string());
    assert!(body["errors"]["email"].is_string());
    assert!(body["errors"]["message"].is_string());
}

#[sqlx::test]
async fn media_upload_requires_admin_token(pool: PgPool) {
    let (status, body) = send(
        pool,
        post_json(
            "/api/v1/media/uploads",
            json!({ "filename": "a.jpg", "content_type": "image/jpeg", "size_bytes": 100 }),
        ),
    )
    .await;
    assert_eq!(status, StatusCode::UNAUTHORIZED);
    assert_eq!(body["status"], 401);
}

#[sqlx::test]
async fn media_upload_rejects_bad_content_type(pool: PgPool) {
    let request = Request::post("/api/v1/media/uploads")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(
            json!({ "filename": "a.pdf", "content_type": "application/pdf", "size_bytes": 100 })
                .to_string(),
        ))
        .unwrap();
    let (status, body) = send(pool, request).await;
    assert_eq!(status, StatusCode::UNPROCESSABLE_ENTITY);
    assert!(body["errors"]["content_type"].is_string());
}

#[sqlx::test]
async fn media_upload_returns_presigned_url_and_pending_record(pool: PgPool) {
    let request = Request::post("/api/v1/media/uploads")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(
            json!({ "filename": "My Photo!.jpg", "content_type": "image/jpeg", "size_bytes": 1234 })
                .to_string(),
        ))
        .unwrap();
    let (status, body) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::CREATED);
    let url = body["upload_url"].as_str().unwrap();
    assert!(url.contains("test-media"), "bucket in url: {url}");
    assert!(url.contains("originals/"), "key prefix in url: {url}");
    assert!(body["media_id"].is_string());

    let (state, filename): (String, String) = sqlx::query_as("select state, filename from media")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(state, "pending");
    assert_eq!(filename, "My_Photo_.jpg");
}

#[sqlx::test]
async fn media_list_is_empty_without_ready_media(pool: PgPool) {
    let (status, body) = send(
        pool,
        Request::get("/api/v1/media").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body, json!([]));
}

#[sqlx::test]
async fn cv_endpoint_empty_without_synced_versions(pool: PgPool) {
    let (status, body) = send(
        pool,
        Request::get("/api/v1/cv").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body, json!([]));
}

#[sqlx::test]
async fn analytics_aggregates_have_stable_shape(pool: PgPool) {
    let (status, _) = send(
        pool.clone(),
        post_json(
            "/api/v1/visits",
            json!({ "page": "/", "referrer": "https://ref.example/x/", "recaptcha_token": "t" }),
        ),
    )
    .await;
    assert_eq!(status, StatusCode::OK);

    let (status, body) = send(
        pool,
        Request::get("/api/v1/analytics")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["total"], 1);
    assert_eq!(body["daily"].as_array().unwrap().len(), 30);
    assert_eq!(body["referrers"][0]["key"], "ref.example/x");
}

#[sqlx::test]
async fn visit_stores_country_code_not_ip(pool: PgPool) {
    let request = Request::post("/api/v1/visits")
        .header(header::CONTENT_TYPE, "application/json")
        .header("x-visitor-country", "no")
        .header("x-forwarded-for", "203.0.113.7")
        .body(Body::from(json!({ "recaptcha_token": "t" }).to_string()))
        .unwrap();
    let (status, _) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::OK);

    let (country, code): (Option<String>, Option<String>) =
        sqlx::query_as("select country, country_code from visitors")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(country, None);
    assert_eq!(code.as_deref(), Some("NO"));
}

#[sqlx::test]
async fn audit_chain_records_and_verifies(pool: PgPool) {
    for i in 0..2 {
        let request = Request::post("/api/v1/media/uploads")
            .header(header::CONTENT_TYPE, "application/json")
            .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
            .body(Body::from(
                json!({
                    "filename": format!("img-{i}.png"),
                    "content_type": "image/png",
                    "size_bytes": 1000,
                    "category": "Test Album"
                })
                .to_string(),
            ))
            .unwrap();
        let (status, _) = send(pool.clone(), request).await;
        assert_eq!(status, StatusCode::CREATED);
    }

    let auth = Request::get("/api/v1/audit/verify")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::empty())
        .unwrap();
    let (status, body) = send(pool.clone(), auth).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["valid"], true);
    assert_eq!(body["entries"], 2);

    let unauthorized = Request::get("/api/v1/audit").body(Body::empty()).unwrap();
    let (status, _) = send(pool.clone(), unauthorized).await;
    assert_eq!(status, StatusCode::UNAUTHORIZED);

    // Tamper with the first entry: the chain must break there.
    sqlx::query(
        "update admin_audit set detail = jsonb_set(detail, '{filename}', '\"evil.png\"') \
         where id = (select min(id) from admin_audit)",
    )
    .execute(&pool)
    .await
    .unwrap();

    let verify = Request::get("/api/v1/audit/verify")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::empty())
        .unwrap();
    let (status, body) = send(pool, verify).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["valid"], false);
    assert!(body["first_invalid_id"].is_number());
}

#[sqlx::test]
async fn media_category_filter_and_pending_gate(pool: PgPool) {
    let request = Request::post("/api/v1/media/uploads")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(
            json!({
                "filename": "trip.png",
                "content_type": "image/png",
                "size_bytes": 1000,
                "category": "Interrail"
            })
            .to_string(),
        ))
        .unwrap();
    let (status, _) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::CREATED);

    // Pending item invisible without the flag.
    let (status, body) = send(
        pool.clone(),
        Request::get("/api/v1/media").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body, json!([]));

    // include_pending requires the admin token.
    let (status, _) = send(
        pool.clone(),
        Request::get("/api/v1/media?include_pending=true")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::UNAUTHORIZED);

    let request = Request::get("/api/v1/media?include_pending=true&category=interrail")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::empty())
        .unwrap();
    let (status, body) = send(pool, request).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body[0]["category"], "interrail");
    assert_eq!(body[0]["state"], "pending");
}

#[sqlx::test]
async fn github_returns_null_when_upstream_unavailable(pool: PgPool) {
    let (status, body) = send(
        pool,
        Request::get("/api/v1/github").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body, Value::Null);
}

#[sqlx::test]
async fn spotify_reports_missing_credentials(pool: PgPool) {
    let (status, body) = send(
        pool,
        Request::get("/api/v1/spotify?recaptcha_token=t")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["ok"], false);
    assert_eq!(body["error"], "Spotify credentials not set");
}

#[sqlx::test]
async fn deployments_fail_deterministically_without_upstream(pool: PgPool) {
    let (status, body) = send(
        pool,
        Request::get("/api/v1/deployments")
            .body(Body::empty())
            .unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::BAD_GATEWAY);
    assert_eq!(body["status"], 502);
}

#[sqlx::test]
async fn posthog_stats_no_content_when_unconfigured(pool: PgPool) {
    let response = app(test_state(pool))
        .oneshot(
            Request::get("/api/v1/analytics/posthog")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::NO_CONTENT);
}

#[sqlx::test]
async fn media_list_groups_variants_per_item(pool: PgPool) {
    // Two ready media, each with avif + webp, must come back as two distinct
    // items with two variants each (regression: shared created_at could
    // interleave variant rows and split/duplicate items).
    for n in 0..2 {
        let id: uuid::Uuid = sqlx::query_scalar(
            "insert into media (original_key, filename, content_type, size_bytes, state, \
                                width, height, content_hash) \
             values ($1, $2, 'image/png', 100, 'ready', 32, 32, $3) returning id",
        )
        .bind(format!("originals/{n}/a.png"))
        .bind(format!("a{n}.png"))
        .bind(format!("hash{n}"))
        .fetch_one(&pool)
        .await
        .unwrap();
        for fmt in ["avif", "webp"] {
            sqlx::query(
                "insert into media_variants (media_id, format, key, width, height, size_bytes) \
                 values ($1, $2, $3, 32, 32, 50)",
            )
            .bind(id)
            .bind(fmt)
            .bind(format!("variants/{id}.{fmt}"))
            .execute(&pool)
            .await
            .unwrap();
        }
    }

    let (status, body) = send(
        pool,
        Request::get("/api/v1/media").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    let items = body.as_array().unwrap();
    assert_eq!(items.len(), 2, "two distinct media items");
    for item in items {
        assert_eq!(item["variants"].as_array().unwrap().len(), 2);
    }
}

#[sqlx::test]
async fn gallery_groups_ready_media_with_public_urls(pool: PgPool) {
    let first_id: uuid::Uuid = sqlx::query_scalar(
        "insert into media (original_key, filename, content_type, size_bytes, state, \
                            width, height, content_hash, category) \
         values ('originals/first.jpg', '20260711_123456_First.jpg', 'image/jpeg', 100, \
                 'ready', 32, 32, 'first-hash', 'travel') returning id",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let second_id: uuid::Uuid = sqlx::query_scalar(
        "insert into media (original_key, filename, content_type, size_bytes, state, \
                            width, height, content_hash) \
         values ('originals/second.jpg', 'plain.jpg', 'image/jpeg', 100, \
                 'ready', 32, 32, 'second-hash') returning id",
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    for (id, format, key) in [
        (first_id, "avif", "variants/first.avif"),
        (first_id, "webp", "variants/first.webp"),
        (second_id, "webp", "variants/second.webp"),
    ] {
        sqlx::query(
            "insert into media_variants (media_id, format, key, width, height, size_bytes) \
             values ($1, $2, $3, 32, 32, 50)",
        )
        .bind(id)
        .bind(format)
        .bind(key)
        .execute(&pool)
        .await
        .unwrap();
    }

    let response = app(test_state_with_public_base(
        pool,
        Some("https://media.example.test/assets/".into()),
    ))
    .oneshot(Request::get("/api/v1/gallery").body(Body::empty()).unwrap())
    .await
    .unwrap();
    assert_eq!(response.status(), StatusCode::OK);

    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(body.as_array().unwrap().len(), 2);
    assert_eq!(body[0]["name"], "travel");
    assert_eq!(
        body[0]["images"][0]["src"],
        "https://media.example.test/assets/variants/first.webp"
    );
    assert_eq!(
        body[0]["images"][0]["originalSrc"],
        body[0]["images"][0]["src"]
    );
    assert_eq!(body[0]["images"][0]["date"], "2026-07-11T12:34:56");
    assert_eq!(body[1]["name"], "uncategorized");
}
