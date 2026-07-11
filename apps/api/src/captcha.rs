use serde::Deserialize;

use crate::Upstreams;

#[derive(Deserialize)]
struct SiteVerifyResponse {
    success: bool,
    score: Option<f64>,
    action: Option<String>,
}

/// Server-side reCAPTCHA v3 verification.
///
/// Divergence from the old TypeScript implementation (which failed closed):
/// when `RECAPTCHA_SECRET_KEY` is unset the check passes with a warning, so
/// development and test environments work without Google. Production renders
/// the secret via Doppler; `main` logs loudly at startup when it is missing.
pub async fn verify(
    http: &reqwest::Client,
    upstreams: &Upstreams,
    token: &str,
    expected_action: &str,
    min_score: f64,
) -> bool {
    let Some(secret) = upstreams.recaptcha_secret.as_deref() else {
        tracing::warn!(
            action = expected_action,
            "RECAPTCHA_SECRET_KEY unset; skipping captcha verification"
        );
        return true;
    };
    if token.is_empty() {
        return false;
    }

    let url = format!("{}/recaptcha/api/siteverify", upstreams.recaptcha);
    let response = http
        .post(&url)
        .form(&[("secret", secret), ("response", token)])
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await;

    let body: SiteVerifyResponse = match response {
        Ok(res) => match res.json().await {
            Ok(body) => body,
            Err(err) => {
                tracing::error!(error = %err, "captcha response parse failed");
                return false;
            }
        },
        Err(err) => {
            tracing::error!(error = %err, "captcha verification request failed");
            return false;
        }
    };

    body.success
        && body.score.map(|s| s >= min_score).unwrap_or(true)
        && body.action.as_deref() == Some(expected_action)
}
