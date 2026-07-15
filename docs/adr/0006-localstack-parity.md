# ADR 0006 — LocalStack parity for the media pipeline

Status: accepted (2026-07-11)

## Context

The media pipeline (presigned S3 PUT → S3 event → SQS → Rust worker →
AVIF/WebP variants) spans three AWS services. Developing it against real
AWS would couple local work to cloud credentials, cost and shared state,
and make integration tests unrunnable in CI without secrets.

## Decision

`compose.yaml` runs LocalStack (S3 + SQS) with a ready-hook
(`scripts/localstack-init.sh`) that provisions the same topology as
production Terraform: media bucket, `media-processing` queue, DLQ with
`maxReceiveCount 5`, and the `ObjectCreated originals/` notification. The
backend access uses the internal `AWS_ENDPOINT_URL`; the API can separately use
`MEDIA_UPLOAD_ENDPOINT_URL` when signing browser PUTs. This distinction matters
in containers, where `localstack:4566` is reachable by services while the host
browser needs `localhost:4566`. Both custom endpoints use path-style addressing.

## Consequences

- The exact flow verified locally (presigned PUT, event fan-out, variant
  generation, terminal failure states, queue drain) ran unchanged against
  real AWS on first try; the only production-only surprise was the
  `s3:TestEvent` message, which the worker already tolerated.
- The Nitro build preset had to be pinned (`node-server`) for a related
  reason: environment-sensitive defaults break "build once, run anywhere".
- LocalStack fidelity has limits (signature validation is lax); security
  properties like presigned-header enforcement are still validated against
  real S3.
