# Build from the repository root: docker build -f apps/api/Dockerfile .
FROM rust:1.96-slim-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY apps/api/Cargo.toml ./apps/api/Cargo.toml
COPY apps/worker/Cargo.toml ./apps/worker/Cargo.toml
# Cargo parses every workspace member; keep the unbuilt member minimal so its
# source changes do not invalidate the API image build.
RUN mkdir -p apps/worker/src && : > apps/worker/src/lib.rs
COPY apps/api ./apps/api
# Compiled into the /api/v1/version response.
ARG GIT_SHA
ARG APP_VERSION
ENV GIT_SHA=${GIT_SHA} APP_VERSION=${APP_VERSION}
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    --mount=type=cache,target=/app/target,sharing=locked \
    cargo build --release --locked -p portfolio-api && \
    install -Dm755 /app/target/release/portfolio-api /out/portfolio-api

# Migrations are embedded in the binary via sqlx::migrate! and run at startup.
FROM gcr.io/distroless/cc-debian12:nonroot
COPY --from=build /out/portfolio-api /usr/local/bin/portfolio-api
ENV API_ADDR=0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/portfolio-api"]
