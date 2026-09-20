| Check | Command |
| --- | --- |
| Fast Rust checks | `cargo fmt --all --check && cargo metadata --locked --offline --no-deps --format-version 1` |
| Rust integration suite | `docker build -f ci/Containerfile --target rust-tests .` |
| OpenAPI drift and dependency audit | `docker build -f ci/Containerfile --target quality-tests --build-arg CI_REVISION=$(git rev-parse HEAD) .` |
| Frontend suite | `docker build -f ci/Containerfile --target web-tests .` |
| API image | `docker build -f Containerfile --target api .` |
| Worker image | `docker build -f Containerfile --target worker .` |
