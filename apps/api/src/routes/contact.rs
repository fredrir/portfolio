use std::collections::BTreeMap;

use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::problem::ApiError;
use crate::{AppState, captcha};

#[derive(Deserialize, ToSchema)]
pub struct ContactRequest {
    pub name: String,
    pub email: String,
    #[serde(default)]
    pub phone: Option<String>,
    pub message: String,
    /// reCAPTCHA v3 token for the `contact_form` action.
    pub recaptcha_token: String,
}

#[derive(Serialize, ToSchema)]
pub struct ContactAccepted {
    /// Identifier of the stored message; delivery happens asynchronously.
    pub id: Uuid,
}

fn validate(body: &ContactRequest) -> BTreeMap<String, String> {
    let mut errors = BTreeMap::new();
    if body.name.is_empty() {
        errors.insert("name".into(), "Name is required".into());
    } else if body.name.chars().count() > 200 {
        errors.insert("name".into(), "Name is too long".into());
    }
    let email_ok = body.email.chars().count() <= 320
        && body.email.split_once('@').is_some_and(|(local, domain)| {
            !local.is_empty() && domain.contains('.') && !domain.starts_with('.')
        });
    if !email_ok {
        errors.insert("email".into(), "Invalid email address".into());
    }
    if body.phone.as_ref().is_some_and(|p| p.chars().count() > 30) {
        errors.insert("phone".into(), "Phone number is too long".into());
    }
    if body.message.is_empty() {
        errors.insert("message".into(), "Message is required".into());
    } else if body.message.chars().count() > 5000 {
        errors.insert("message".into(), "Message is too long".into());
    }
    if body.recaptcha_token.is_empty() {
        errors.insert("recaptcha_token".into(), "reCAPTCHA token missing".into());
    }
    errors
}

/// Accept a contact-form submission for asynchronous delivery.
#[utoipa::path(post, path = "/api/v1/contact", tag = "contact",
    request_body = ContactRequest,
    responses(
        (status = 201, body = ContactAccepted),
        (status = 422, description = "Validation failed", body = crate::problem::Problem)
    ))]
pub async fn submit_contact(
    State(state): State<AppState>,
    Json(body): Json<ContactRequest>,
) -> Result<(StatusCode, Json<ContactAccepted>), ApiError> {
    let errors = validate(&body);
    if !errors.is_empty() {
        return Err(ApiError::Validation(errors));
    }

    let passed = captcha::verify(
        &state.http,
        &state.upstreams,
        &body.recaptcha_token,
        "contact_form",
        0.5,
    )
    .await;
    if !passed {
        return Err(ApiError::Forbidden("reCAPTCHA verification failed"));
    }

    let (id,): (Uuid,) = sqlx::query_as(
        "insert into contact_messages (name, email, phone, message) \
         values ($1, $2, $3, $4) returning id",
    )
    .bind(&body.name)
    .bind(&body.email)
    .bind(body.phone.as_deref().filter(|p| !p.is_empty()))
    .bind(&body.message)
    .fetch_one(&state.pool)
    .await?;

    Ok((StatusCode::CREATED, Json(ContactAccepted { id })))
}

#[cfg(test)]
mod props {
    use proptest::prelude::*;

    use super::{ContactRequest, validate};

    proptest! {
        #[test]
        fn validation_never_panics_and_is_consistent(
            name in ".{0,250}",
            email in ".{0,40}",
            phone in proptest::option::of(".{0,40}"),
            message in ".{0,600}",
            token in ".{0,10}",
        ) {
            let request = ContactRequest {
                name: name.clone(),
                email: email.clone(),
                phone: phone.clone(),
                message: message.clone(),
                recaptcha_token: token.clone(),
            };
            let errors = validate(&request);
            let name_bad = name.is_empty() || name.chars().count() > 200;
            prop_assert_eq!(errors.contains_key("name"), name_bad);
            let message_bad = message.is_empty() || message.chars().count() > 5000;
            prop_assert_eq!(errors.contains_key("message"), message_bad);
            prop_assert_eq!(errors.contains_key("recaptcha_token"), token.is_empty());
            let phone_bad = phone.as_ref().is_some_and(|p| p.chars().count() > 30);
            prop_assert_eq!(errors.contains_key("phone"), phone_bad);
        }
    }
}
