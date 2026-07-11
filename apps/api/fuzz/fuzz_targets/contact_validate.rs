#![no_main]
use libfuzzer_sys::fuzz_target;
use portfolio_api::routes::contact::{ContactRequest, validate};

fuzz_target!(|input: (String, String, Option<String>, String, String)| {
    let (name, email, phone, message, recaptcha_token) = input;
    let _ = validate(&ContactRequest {
        name,
        email,
        phone,
        message,
        recaptcha_token,
    });
});
