FROM docker.io/library/rust@sha256:2775a09d208ff0d7c1f50490c45b62db929e87ba1dcbc3f2132ac71a704bcdd3 AS toolchain
RUN rustup component add rustfmt
ENV CARGO_BUILD_JOBS=2
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY apps/api/Cargo.toml apps/api/Cargo.toml
COPY apps/worker/Cargo.toml apps/worker/Cargo.toml
RUN mkdir -p apps/api/src apps/worker/src && touch apps/api/src/lib.rs apps/api/src/main.rs apps/worker/src/lib.rs apps/worker/src/main.rs
RUN --mount=type=cache,id=portfolio-cargo-registry,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,id=portfolio-cargo-git,target=/usr/local/cargo/git,sharing=locked \
    cargo fetch --locked

FROM toolchain AS source
COPY apps/api apps/api
COPY apps/worker apps/worker

FROM source AS checks
RUN --mount=type=bind,source=.infra-artifacts/infra,target=/usr/local/bin/infra \
    infra ci measure --stage portfolio-rust --budget 10s --report-dir /infra-checks -- sh -ec 'cargo fmt --all --check; cargo metadata --locked --offline --no-deps --format-version 1 > /dev/null'

FROM checks AS build
RUN --mount=type=cache,id=portfolio-cargo-registry,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,id=portfolio-cargo-git,target=/usr/local/cargo/git,sharing=locked \
    --mount=type=cache,id=portfolio-release-target,target=/app/target,sharing=locked \
    cargo build --release --locked --offline --workspace --bins && \
    install -Dm755 target/release/portfolio-api /out/portfolio-api && \
    install -Dm755 target/release/portfolio-worker /out/portfolio-worker && \
    install -Dm755 target/release/backfill-exif /out/backfill-exif

FROM scratch AS check-reports
COPY --from=checks /infra-checks /infra-checks/

FROM gcr.io/distroless/cc-debian12:nonroot AS api
COPY --from=build /out/portfolio-api /usr/local/bin/portfolio-api
ARG GIT_SHA
ARG APP_VERSION
ENV GIT_SHA=${GIT_SHA} APP_VERSION=${APP_VERSION} API_ADDR=0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/portfolio-api"]

FROM gcr.io/distroless/cc-debian12:nonroot AS worker
COPY --from=build /out/portfolio-worker /usr/local/bin/portfolio-worker
COPY --from=build /out/backfill-exif /usr/local/bin/backfill-exif
ENTRYPOINT ["/usr/local/bin/portfolio-worker"]
