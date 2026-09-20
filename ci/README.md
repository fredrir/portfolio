| Check | Command |
| --- | --- |
| Container check binary (Linux) | `install -Dm755 "$(command -v infra)" .infra-artifacts/infra` |
| Fast Rust checks | `cargo fmt --all --check && cargo metadata --locked --offline --no-deps --format-version 1` |
| Rust integration suite | `docker build -f ci/Containerfile --target rust-tests .` |
| OpenAPI drift and dependency audit | `docker build -f ci/Containerfile --target quality-tests --build-arg CI_REVISION=$(git rev-parse HEAD) .` |
| Frontend suite | `docker build -f ci/Containerfile --target web-tests .` |
| API image | `docker build -f Containerfile --target api .` |
| Worker image | `docker build -f Containerfile --target worker .` |
| Mutation suite | `docker build -f ci/Containerfile --target mutation-results --build-arg CI_REVISION=$(git rev-parse HEAD) .` |
| API fuzz suite | `docker build -f ci/Containerfile --target fuzz-results --build-arg CI_REVISION=$(git rev-parse HEAD) --build-arg FUZZ_CRATE=apps/api --build-arg FUZZ_TARGET=sanitize .` |
| Contact fuzz suite | `docker build -f ci/Containerfile --target fuzz-results --build-arg CI_REVISION=$(git rev-parse HEAD) --build-arg FUZZ_CRATE=apps/api --build-arg FUZZ_TARGET=contact_validate .` |
| Worker fuzz suite | `docker build -f ci/Containerfile --target fuzz-results --build-arg CI_REVISION=$(git rev-parse HEAD) --build-arg FUZZ_CRATE=apps/worker --build-arg FUZZ_TARGET=s3_event_parse .` |
| External security grade | `bash ci/security-grade.sh` |
