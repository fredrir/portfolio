# Build from the repository root: docker build -f apps/api/Dockerfile .
FROM rust:1.96-slim-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY apps/api ./apps/api
COPY apps/worker ./apps/worker
# Compiled into the /api/v1/version response.
ARG GIT_SHA
ARG APP_VERSION
ENV GIT_SHA=${GIT_SHA} APP_VERSION=${APP_VERSION}
RUN cargo build --release --locked -p portfolio-api

# Migrations are embedded in the binary via sqlx::migrate! and run at startup.
FROM gcr.io/distroless/cc-debian12:nonroot
COPY --from=build /app/target/release/portfolio-api /usr/local/bin/portfolio-api
ENV API_ADDR=0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/portfolio-api"]
