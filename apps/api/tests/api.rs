use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use http_body_util::BodyExt;
use portfolio_api::{AppState, MediaConfig, app};
use serde_json::{Value, json};
use sqlx::PgPool;
use tower::ServiceExt;

const TEST_ADMIN_TOKEN: &str = "test-admin-token";

fn test_state(pool: PgPool) -> AppState {
    let credentials = aws_sdk_s3::config::Credentials::new("test", "test", None, None, "test");
    let config = aws_sdk_s3::config::Builder::new()
        .behavior_version(aws_sdk_s3::config::BehaviorVersion::latest())
        .region(aws_sdk_s3::config::Region::new("us-east-1"))
        .credentials_provider(credentials)
        .endpoint_url("http://localhost:4566")
        .force_path_style(true)
        .build();
    AppState {
        pool,
        s3: aws_sdk_s3::Client::from_conf(config),
        media: MediaConfig {
            bucket: "test-media".into(),
            admin_token: Some(TEST_ADMIN_TOKEN.into()),
            public_base_url: None,
        },
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
            json!({ "page": "/", "referrer": "https://example.com" }),
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
                "message": "Hello there"
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
        json!({ "name": "", "email": "not-an-email", "message": "" }),
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
