//! Prints the OpenAPI document to stdout for TypeScript client generation.

fn main() {
    println!(
        "{}",
        portfolio_api::openapi_spec()
            .to_pretty_json()
            .expect("OpenAPI document serializes")
    );
}
