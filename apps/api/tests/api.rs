use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use http_body_util::BodyExt;
use portfolio_api::{AppState, app};
use serde_json::{Value, json};
use sqlx::PgPool;
use tower::ServiceExt;

async fn send(pool: PgPool, request: Request<Body>) -> (StatusCode, Value) {
    let response = app(AppState { pool }).oneshot(request).await.unwrap();
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
    let response = app(AppState { pool }).oneshot(request).await.unwrap();
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
