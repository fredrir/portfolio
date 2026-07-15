# Build from the repository root: docker build -f apps/worker/Dockerfile .
FROM rust:1.96-slim-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY apps/api/Cargo.toml ./apps/api/Cargo.toml
COPY apps/worker/Cargo.toml ./apps/worker/Cargo.toml
# Keep dependencies in an exported layer; GitHub's BuildKit cache does not
# preserve the contents of cache mounts between runners.
RUN mkdir -p apps/api/src apps/worker/src && \
    : > apps/api/src/lib.rs && \
    printf 'fn main() {}\n' > apps/api/src/main.rs && \
    : > apps/worker/src/lib.rs && \
    printf 'fn main() {}\n' > apps/worker/src/main.rs
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    cargo build --release --locked -p portfolio-worker
RUN rm -rf apps/worker/src
COPY apps/worker ./apps/worker
RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    touch apps/worker/src/lib.rs apps/worker/src/main.rs && \
    cargo build --release --locked -p portfolio-worker && \
    install -Dm755 /app/target/release/portfolio-worker /out/portfolio-worker && \
    install -Dm755 /app/target/release/backfill-exif /out/backfill-exif && \
    rm -rf /app/target

FROM gcr.io/distroless/cc-debian12:nonroot
COPY --from=build /out/portfolio-worker /usr/local/bin/portfolio-worker
# Oneshot EXIF backfill; run manually with --entrypoint /usr/local/bin/backfill-exif
COPY --from=build /out/backfill-exif /usr/local/bin/backfill-exif
ENTRYPOINT ["/usr/local/bin/portfolio-worker"]
