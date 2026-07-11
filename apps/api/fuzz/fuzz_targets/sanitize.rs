#![no_main]
use libfuzzer_sys::fuzz_target;
use portfolio_api::routes::media::{sanitize_category, sanitize_filename};

fuzz_target!(|data: &str| {
    let name = sanitize_filename(data);
    assert!(!name.is_empty());
    // Idempotence: sanitizing sanitized output changes nothing.
    assert_eq!(sanitize_filename(&name), name);
    if let Some(category) = sanitize_category(data) {
        assert!(!category.is_empty() && category.chars().count() <= 64);
    }
});
