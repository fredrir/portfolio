use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use http_body_util::BodyExt;
use portfolio_api::{AppState, Caches, MediaConfig, Upstreams, app, audit};
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
        weather_api: "http://127.0.0.1:9".into(),
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
    let (status, body) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::UNPROCESSABLE_ENTITY);
    assert!(body["errors"]["content_type"].is_string());
}

#[sqlx::test]
async fn media_upload_returns_presigned_url_and_pending_record(pool: PgPool) {
    let request = Request::post("/api/v1/media/uploads")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(
            json!({
                "filename": "My Photo!.jpg",
                "content_type": "image/jpeg",
                "size_bytes": 1234,
                "category": "Kragerø"
            })
            .to_string(),
        ))
        .unwrap();
    let (status, body) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::CREATED);
    let url = body["upload_url"].as_str().unwrap();
    assert!(url.contains("test-media"), "bucket in url: {url}");
    assert!(url.contains("originals/"), "key prefix in url: {url}");
    assert!(body["media_id"].is_string());

    let (state, filename, category): (String, String, Option<String>) =
        sqlx::query_as("select state, filename, category from media")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(state, "pending");
    assert_eq!(filename, "My_Photo_.jpg");
    assert_eq!(category.as_deref(), Some("kragerø"));
}

/// Authorize an upload and return the pending media id.
async fn seed_media(pool: PgPool, filename: &str, category: Option<&str>) -> String {
    let request = Request::post("/api/v1/media/uploads")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(
            json!({
                "filename": filename,
                "content_type": "image/jpeg",
                "size_bytes": 1234,
                "category": category
            })
            .to_string(),
        ))
        .unwrap();
    let (status, body) = send(pool, request).await;
    assert_eq!(status, StatusCode::CREATED);
    body["media_id"].as_str().unwrap().to_owned()
}

#[sqlx::test]
async fn media_category_can_be_set_and_cleared(pool: PgPool) {
    let id = seed_media(pool.clone(), "a.jpg", Some("oslo")).await;

    // No token → 401.
    let request = Request::patch(format!("/api/v1/media/{id}"))
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(json!({ "category": "trondheim" }).to_string()))
        .unwrap();
    let (status, _) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::UNAUTHORIZED);

    // Re-categorize (input is sanitized like uploads).
    let request = Request::patch(format!("/api/v1/media/{id}"))
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(json!({ "category": "Trondheim" }).to_string()))
        .unwrap();
    let (status, body) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["category"], "trondheim");

    // Null clears to uncategorized.
    let request = Request::patch(format!("/api/v1/media/{id}"))
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(json!({ "category": null }).to_string()))
        .unwrap();
    let (status, body) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["category"], Value::Null);

    let (stored,): (Option<String>,) = sqlx::query_as("select category from media")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(stored, None);

    // Both changes are audited.
    let (entries,): (i64,) =
        sqlx::query_as("select count(*) from admin_audit where action = 'media.category_set'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(entries, 2);

    // Unknown id → 404.
    let request = Request::patch(format!("/api/v1/media/{}", uuid::Uuid::new_v4()))
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(json!({ "category": "x" }).to_string()))
        .unwrap();
    let (status, _) = send(pool, request).await;
    assert_eq!(status, StatusCode::NOT_FOUND);
}

#[sqlx::test]
async fn media_delete_removes_row_and_audits(pool: PgPool) {
    let id = seed_media(pool.clone(), "gone.jpg", None).await;
    sqlx::query(
        "insert into media_variants (media_id, format, key, width, height, size_bytes) \
         values ($1::uuid, 'webp', 'variants/deadbeef.webp', 10, 10, 100)",
    )
    .bind(&id)
    .execute(&pool)
    .await
    .unwrap();

    let request = Request::delete(format!("/api/v1/media/{id}"))
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::empty())
        .unwrap();
    let (status, _) = send(pool.clone(), request).await;
    // S3 cleanup is best-effort (no object store in tests); the row must be gone.
    assert_eq!(status, StatusCode::NO_CONTENT);

    let (media, variants): (i64, i64) = sqlx::query_as(
        "select (select count(*) from media), (select count(*) from media_variants)",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!((media, variants), (0, 0));

    let (entries,): (i64,) =
        sqlx::query_as("select count(*) from admin_audit where action = 'media.deleted'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(entries, 1);

    // Already gone → 404.
    let request = Request::delete(format!("/api/v1/media/{id}"))
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::empty())
        .unwrap();
    let (status, _) = send(pool, request).await;
    assert_eq!(status, StatusCode::NOT_FOUND);
}

#[sqlx::test]
async fn category_rename_moves_all_media(pool: PgPool) {
    seed_media(pool.clone(), "a.jpg", Some("krageroe")).await;
    seed_media(pool.clone(), "b.jpg", Some("krageroe")).await;
    seed_media(pool.clone(), "c.jpg", Some("oslo")).await;

    let request = Request::post("/api/v1/media/categories/rename")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(
            json!({ "from": "krageroe", "to": "Kragerø Summer" }).to_string(),
        ))
        .unwrap();
    let (status, body) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["to"], "kragerø_summer");
    assert_eq!(body["updated"], 2);

    let (moved,): (i64,) = sqlx::query_as("select count(*) from media where category = $1")
        .bind("kragerø_summer")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(moved, 2);

    // Untouched category stays.
    let (oslo,): (i64,) = sqlx::query_as("select count(*) from media where category = 'oslo'")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(oslo, 1);

    let (entries,): (i64,) =
        sqlx::query_as("select count(*) from admin_audit where action = 'media.category_renamed'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(entries, 1);

    // Empty source category → 404; invalid names → 422.
    let request = Request::post("/api/v1/media/categories/rename")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(json!({ "from": "nope", "to": "new" }).to_string()))
        .unwrap();
    let (status, _) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::NOT_FOUND);

    let request = Request::post("/api/v1/media/categories/rename")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(json!({ "from": "oslo", "to": "___" }).to_string()))
        .unwrap();
    let (status, _) = send(pool, request).await;
    assert_eq!(status, StatusCode::UNPROCESSABLE_ENTITY);
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
async fn audit_chain_can_be_resealed_for_hash_migrations(pool: PgPool) {
    for i in 0..2 {
        let request = Request::post("/api/v1/media/uploads")
            .header(header::CONTENT_TYPE, "application/json")
            .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
            .body(Body::from(
                json!({
                    "filename": format!("reseal-{i}.png"),
                    "content_type": "image/png",
                    "size_bytes": 1000
                })
                .to_string(),
            ))
            .unwrap();
        let (status, _) = send(pool.clone(), request).await;
        assert_eq!(status, StatusCode::CREATED);
    }

    sqlx::query(
        "update admin_audit set detail = jsonb_set(detail, '{filename}', '\"legacy.png\"') \
         where id = 1",
    )
    .execute(&pool)
    .await
    .unwrap();

    let verify = Request::get("/api/v1/audit/verify")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::empty())
        .unwrap();
    let (_, body) = send(pool.clone(), verify).await;
    assert_eq!(body["valid"], false);
    assert_eq!(body["first_invalid_id"], 1);

    let mut tx = pool.begin().await.unwrap();
    let status = audit::reseal_chain(&mut tx, true).await.unwrap();
    tx.commit().await.unwrap();
    assert_eq!(status.entries, 2);
    assert_eq!(status.changed, 2);
    assert_eq!(status.first_changed_id, Some(1));

    let verify = Request::get("/api/v1/audit/verify")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::empty())
        .unwrap();
    let (_, body) = send(pool, verify).await;
    assert_eq!(body["valid"], true);
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
async fn admin_media_filters_in_postgres_and_returns_complete_facets(pool: PgPool) {
    for (key, filename, size, state, category) in [
        ("ready", "Trip-ready.jpg", 100_i64, "ready", Some("travel")),
        ("pending", "city.png", 200, "pending", Some("oslo")),
        ("failed", "broken-trip.webp", 300, "failed", None),
        (
            "processing",
            "Trip-processing.jpg",
            400,
            "processing",
            Some("travel"),
        ),
    ] {
        sqlx::query(
            "insert into media (original_key, filename, content_type, size_bytes, state, category) \
             values ($1, $2, 'image/jpeg', $3, $4, $5)",
        )
        .bind(format!("originals/{key}"))
        .bind(filename)
        .bind(size)
        .bind(state)
        .bind(category)
        .execute(&pool)
        .await
        .unwrap();
    }

    let unauthorized = Request::get("/api/v1/media/admin")
        .body(Body::empty())
        .unwrap();
    let (status, _) = send(pool.clone(), unauthorized).await;
    assert_eq!(status, StatusCode::UNAUTHORIZED);

    let request = Request::get(
        "/api/v1/media/admin?query=TRIP&state=ready&category=travel",
    )
    .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
    .body(Body::empty())
    .unwrap();
    let (status, body) = send(pool.clone(), request).await;
    assert_eq!(status, StatusCode::OK);

    let items = body["items"].as_array().unwrap();
    assert_eq!(items.len(), 1);
    assert_eq!(items[0]["filename"], "Trip-ready.jpg");

    assert_eq!(body["summary"]["total"], 4);
    assert_eq!(body["summary"]["stored_bytes"], 1000);
    assert_eq!(body["summary"]["state_counts"]["ready"], 1);
    assert_eq!(body["summary"]["state_counts"]["processing"], 2);
    assert_eq!(body["summary"]["state_counts"]["failed"], 1);
    assert_eq!(
        body["summary"]["categories"],
        json!([
            { "name": "oslo", "count": 1 },
            { "name": "travel", "count": 2 },
            { "name": "uncategorized", "count": 1 }
        ])
    );

    let ready_id: uuid::Uuid =
        sqlx::query_scalar("select id from media where filename = 'Trip-ready.jpg'")
            .fetch_one(&pool)
            .await
            .unwrap();
    let request = Request::post("/api/v1/media/status")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::AUTHORIZATION, format!("Bearer {TEST_ADMIN_TOKEN}"))
        .body(Body::from(
            json!({ "ids": [ready_id, uuid::Uuid::new_v4()] }).to_string(),
        ))
        .unwrap();
    let (status, body) = send(pool, request).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body.as_array().unwrap().len(), 1);
    assert_eq!(body[0]["id"], ready_id.to_string());
    assert_eq!(body[0]["state"], "ready");
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
        Request::get("/api/v1/spotify").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["ok"], false);
    assert_eq!(body["error"], "Spotify credentials not set");
}

#[sqlx::test]
async fn spotify_serves_cache_when_upstream_unavailable(pool: PgPool) {
    sqlx::query("insert into spotify_cache (id, data) values ($1, $2)")
        .bind("spotify_last_played")
        .bind(json!({
            "isPlaying": true,
            "title": "Cached Song",
            "artist": "Cached Artist",
            "album": "Cached Album",
            "progressMs": 12_345,
            "durationMs": 200_000,
            "recentTracks": [],
            "topArtists": []
        }))
        .execute(&pool)
        .await
        .unwrap();

    // Credentials set, but the accounts host is unroutable: the token refresh
    // fails and the handler degrades to the database cache.
    let mut state = test_state(pool);
    let upstreams = std::sync::Arc::get_mut(&mut state.upstreams).unwrap();
    upstreams.spotify_client_id = Some("id".into());
    upstreams.spotify_client_secret = Some("secret".into());
    upstreams.spotify_refresh_token = Some("refresh".into());

    let response = app(state)
        .oneshot(Request::get("/api/v1/spotify").body(Body::empty()).unwrap())
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);

    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(body["title"], "Cached Song");
    assert_eq!(body["artist"], "Cached Artist");
    assert_eq!(body["isPlaying"], false);
    assert!(body["ok"].is_null());
    assert!(body["error"].is_null());
    assert!(body["progressMs"].is_null());
    assert!(body["durationMs"].is_null());
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
async fn weather_serves_fresh_postgres_cache(pool: PgPool) {
    sqlx::query("insert into upstream_cache (id, data) values ($1, $2)")
        .bind("weather:trondheim")
        .bind(json!({
            "location": "Trondheim",
            "temperatureC": 16.4,
            "weatherCode": 2,
            "observedAt": "2026-07-12T12:00",
            "stale": false
        }))
        .execute(&pool)
        .await
        .unwrap();

    let (status, body) = send(
        pool,
        Request::get("/api/v1/weather").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["location"], "Trondheim");
    assert_eq!(body["temperatureC"], 16.4);
    assert_eq!(body["stale"], false);
}

#[sqlx::test]
async fn weather_serves_recent_stale_cache_when_upstream_fails(pool: PgPool) {
    sqlx::query(
        "insert into upstream_cache (id, data, updated_at) \
         values ($1, $2, now() - interval '20 minutes')",
    )
    .bind("weather:trondheim")
    .bind(json!({
        "location": "Trondheim",
        "temperatureC": 8.0,
        "weatherCode": 63,
        "observedAt": "2026-07-12T11:30",
        "stale": false
    }))
    .execute(&pool)
    .await
    .unwrap();

    let (status, body) = send(
        pool,
        Request::get("/api/v1/weather").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["weatherCode"], 63);
    assert_eq!(body["stale"], true);
}

#[sqlx::test]
async fn weather_returns_bad_gateway_without_cache(pool: PgPool) {
    let (status, body) = send(
        pool,
        Request::get("/api/v1/weather").body(Body::empty()).unwrap(),
    )
    .await;
    assert_eq!(status, StatusCode::BAD_GATEWAY);
    assert_eq!(body["status"], 502);
}

#[sqlx::test]
async fn weather_fetches_and_persists_fresh_data(pool: PgPool) {
    let provider = axum::Router::new().route(
        "/v1/forecast",
        axum::routing::get(|| async {
            axum::Json(json!({
                "current": {
                    "time": "2026-07-12T18:15",
                    "temperature_2m": 18.9,
                    "weather_code": 1
                }
            }))
        }),
    );
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0")
        .await
        .unwrap();
    let provider_url = format!("http://{}", listener.local_addr().unwrap());
    let provider_task = tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let mut state = test_state(pool.clone());
    std::sync::Arc::get_mut(&mut state.upstreams)
        .unwrap()
        .weather_api = provider_url;
    let response = app(state)
        .oneshot(
            Request::get("/api/v1/weather")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    provider_task.abort();

    assert_eq!(response.status(), StatusCode::OK);
    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(body["temperatureC"], 18.9);
    assert_eq!(body["weatherCode"], 1);
    assert_eq!(body["stale"], false);

    let (cached,): (Value,) =
        sqlx::query_as("select data from upstream_cache where id = 'weather:trondheim'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(cached["observedAt"], "2026-07-12T18:15");
    assert_eq!(cached["weatherCode"], 1);
}

#[sqlx::test]
async fn weather_coalesces_concurrent_refreshes_and_exposes_metrics(pool: PgPool) {
    let calls = std::sync::Arc::new(std::sync::atomic::AtomicUsize::new(0));
    let provider_calls = calls.clone();
    let provider = axum::Router::new().route(
        "/v1/forecast",
        axum::routing::get(move || {
            let calls = provider_calls.clone();
            async move {
                calls.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
                tokio::time::sleep(std::time::Duration::from_millis(100)).await;
                axum::Json(json!({
                    "current": {
                        "time": "2026-07-12T18:30",
                        "temperature_2m": 19.2,
                        "weather_code": 2
                    }
                }))
            }
        }),
    );
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0")
        .await
        .unwrap();
    let provider_url = format!("http://{}", listener.local_addr().unwrap());
    let provider_task = tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let mut state = test_state(pool);
    std::sync::Arc::get_mut(&mut state.upstreams)
        .unwrap()
        .weather_api = provider_url;
    let router = app(state);
    let request = || {
        Request::get("/api/v1/weather")
            .body(Body::empty())
            .unwrap()
    };
    let (first, second) = tokio::join!(
        router.clone().oneshot(request()),
        router.clone().oneshot(request())
    );
    assert_eq!(first.unwrap().status(), StatusCode::OK);
    assert_eq!(second.unwrap().status(), StatusCode::OK);
    assert_eq!(calls.load(std::sync::atomic::Ordering::Relaxed), 1);

    let metrics = router
        .oneshot(
            Request::get("/api/v1/weather/metrics")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    provider_task.abort();
    assert_eq!(metrics.status(), StatusCode::OK);
    let bytes = metrics.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(body["cacheMisses"], 2);
    assert_eq!(body["refreshSuccesses"], 1);
    assert_eq!(body["coalescedRequests"], 1);
}

#[sqlx::test]
async fn weather_background_refreshes_before_request_ttl(pool: PgPool) {
    sqlx::query(
        "insert into upstream_cache (id, data, updated_at) \
         values ($1, $2, now() - interval '13 minutes')",
    )
    .bind("weather:trondheim")
    .bind(json!({
        "location": "Trondheim",
        "temperatureC": 5.0,
        "weatherCode": 63,
        "observedAt": "2026-07-12T17:00",
        "stale": false
    }))
    .execute(&pool)
    .await
    .unwrap();

    let provider = axum::Router::new().route(
        "/v1/forecast",
        axum::routing::get(|| async {
            axum::Json(json!({
                "current": {
                    "time": "2026-07-12T18:45",
                    "temperature_2m": 20.1,
                    "weather_code": 0
                }
            }))
        }),
    );
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0")
        .await
        .unwrap();
    let provider_url = format!("http://{}", listener.local_addr().unwrap());
    let provider_task = tokio::spawn(async move {
        axum::serve(listener, provider).await.unwrap();
    });

    let mut state = test_state(pool.clone());
    std::sync::Arc::get_mut(&mut state.upstreams)
        .unwrap()
        .weather_api = provider_url;
    portfolio_api::routes::weather::refresh_if_due(&state).await;

    let (cached,): (Value,) =
        sqlx::query_as("select data from upstream_cache where id = 'weather:trondheim'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(cached["temperatureC"], 20.1);
    assert_eq!(cached["observedAt"], "2026-07-12T18:45");

    let metrics = app(state)
        .oneshot(
            Request::get("/api/v1/weather/metrics")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    provider_task.abort();
    let bytes = metrics.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(body["backgroundRefreshes"], 1);
    assert_eq!(body["refreshSuccesses"], 1);
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
                            width, height, content_hash, category, taken_at, camera, lens, \
                            focal_length_mm, aperture, shutter_seconds, iso, \
                            latitude, longitude) \
         values ('originals/first.jpg', '20260711_123456_First.jpg', 'image/jpeg', 100, \
                 'ready', 32, 32, 'first-hash', 'travel', '2026-07-10 08:09:10', \
                 'FUJIFILM X-T5', 'XF23mmF1.4 R LM WR', 23.0, 1.4, 0.004, 320, \
                 59.9139, 10.7522) returning id",
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
        "https://media.example.test/assets/originals/first.jpg"
    );
    // Persisted EXIF capture time wins over the filename-derived date.
    assert_eq!(body[0]["images"][0]["date"], "2026-07-10T08:09:10");
    assert_eq!(body[0]["images"][0]["contentType"], "image/jpeg");
    assert_eq!(body[0]["images"][0]["sizeBytes"], 100);
    assert_eq!(body[0]["images"][0]["width"], 32);
    assert_eq!(body[0]["images"][0]["height"], 32);
    assert_eq!(body[0]["images"][0]["camera"], "FUJIFILM X-T5");
    assert_eq!(body[0]["images"][0]["lens"], "XF23mmF1.4 R LM WR");
    assert_eq!(body[0]["images"][0]["focalLengthMm"], 23.0);
    assert_eq!(body[0]["images"][0]["aperture"], 1.4);
    assert_eq!(body[0]["images"][0]["shutterSeconds"], 0.004);
    assert_eq!(body[0]["images"][0]["iso"], 320);
    assert_eq!(body[0]["images"][0]["latitude"], 59.9139);
    assert_eq!(body[0]["images"][0]["longitude"], 10.7522);
    assert_eq!(body[1]["name"], "uncategorized");
    // No EXIF row and an unparseable filename: everything stays null.
    assert_eq!(body[1]["images"][0]["date"], Value::Null);
    assert_eq!(body[1]["images"][0]["camera"], Value::Null);
    assert_eq!(body[1]["images"][0]["latitude"], Value::Null);
}
