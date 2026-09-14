FROM rust:1.98-slim-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY apps/api/Cargo.toml ./apps/api/Cargo.toml
COPY apps/worker/Cargo.toml ./apps/worker/Cargo.toml
RUN mkdir -p apps/api/src apps/worker/src && \
    : > apps/api/src/lib.rs && \
    printf 'fn main() {}\n' > apps/api/src/main.rs && \
    : > apps/worker/src/lib.rs
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    cargo build --release --locked -p portfolio-api
RUN rm -rf apps/api/src
COPY apps/api ./apps/api
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    touch apps/api/src/lib.rs apps/api/src/main.rs && \
    cargo build --release --locked -p portfolio-api && \
    install -Dm755 /app/target/release/portfolio-api /out/portfolio-api && \
    rm -rf /app/target

FROM gcr.io/distroless/cc-debian12:nonroot
COPY --from=build /out/portfolio-api /usr/local/bin/portfolio-api
ARG GIT_SHA
ARG APP_VERSION
ENV GIT_SHA=${GIT_SHA} \
    APP_VERSION=${APP_VERSION} \
    API_ADDR=0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/portfolio-api"]
