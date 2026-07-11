use std::collections::BTreeMap;

use axum::Json;
use axum::http::{StatusCode, header};
use axum::response::{IntoResponse, Response};
use serde::Serialize;
use utoipa::ToSchema;

/// RFC 9457 problem details body.
#[derive(Debug, Serialize, ToSchema)]
pub struct Problem {
    #[serde(rename = "type")]
    pub problem_type: String,
    pub title: String,
    pub status: u16,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub detail: Option<String>,
    /// Per-field validation messages, present on validation failures only.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub errors: Option<BTreeMap<String, String>>,
}

impl Problem {
    pub fn new(status: StatusCode, title: impl Into<String>) -> Self {
        Self {
            problem_type: "about:blank".to_owned(),
            title: title.into(),
            status: status.as_u16(),
            detail: None,
            errors: None,
        }
    }

    pub fn with_detail(mut self, detail: impl Into<String>) -> Self {
        self.detail = Some(detail.into());
        self
    }
}

impl IntoResponse for Problem {
    fn into_response(self) -> Response {
        let status = StatusCode::from_u16(self.status).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);
        (
            status,
            [(header::CONTENT_TYPE, "application/problem+json")],
            Json(self),
        )
            .into_response()
    }
}

#[derive(Debug)]
pub enum ApiError {
    Validation(BTreeMap<String, String>),
    Forbidden(&'static str),
    Internal(String),
}

impl From<sqlx::Error> for ApiError {
    fn from(err: sqlx::Error) -> Self {
        Self::Internal(err.to_string())
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        match self {
            Self::Validation(errors) => {
                let mut problem =
                    Problem::new(StatusCode::UNPROCESSABLE_ENTITY, "Validation failed");
                problem.errors = Some(errors);
                problem.into_response()
            }
            Self::Forbidden(title) => Problem::new(StatusCode::FORBIDDEN, title).into_response(),
            Self::Internal(detail) => {
                tracing::error!(detail, "internal error");
                Problem::new(StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
                    .into_response()
            }
        }
    }
}
