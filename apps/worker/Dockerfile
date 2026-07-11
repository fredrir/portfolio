# Build from the repository root: docker build -f apps/worker/Dockerfile .
FROM rust:1.96-slim-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY apps/api ./apps/api
COPY apps/worker ./apps/worker
RUN cargo build --release --locked -p portfolio-worker

FROM gcr.io/distroless/cc-debian12:nonroot
COPY --from=build /app/target/release/portfolio-worker /usr/local/bin/portfolio-worker
ENTRYPOINT ["/usr/local/bin/portfolio-worker"]
