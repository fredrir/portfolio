#![no_main]
use libfuzzer_sys::fuzz_target;
use portfolio_worker::events::S3EventMessage;

fuzz_target!(|data: &[u8]| {
    if let Ok(text) = std::str::from_utf8(data) {
        if let Ok(message) = serde_json::from_str::<S3EventMessage>(text) {
            for record in &message.records {
                let _ = record.s3.object.decoded_key();
            }
        }
    }
});
