# ADR 0001 — TanStack Start over Next.js

Status: accepted (2026-07-11)

## Context

The portfolio was a single-package Next.js 16 app deployed on Vercel, with
server actions talking to Supabase. The platform plan requires a
self-hosted origin, a Rust API owning business logic, and immutable
container artifacts. Next.js couples routing, data access and deployment
assumptions to its own server runtime and optimizes for Vercel hosting.

## Decision

Port the frontend to TanStack Start (Vite + TanStack Router, Nitro
`node-server` output pinned so the artifact is identical regardless of
build runtime). Server functions replace server actions but hold no
business logic: visits, contact and media flow through the Axum API via a
TypeScript client generated from the API's OpenAPI document, with a CI
drift check.

## Consequences

- The SSR server is a plain node process in a container — trivially
  blue-green deployable and runnable anywhere.
- The API contract is explicit and CI-enforced; the frontend cannot drift
  from the backend silently.
- Costs of the port: next/image optimization was replaced with a plain
  `<img>` wrapper (media optimization moved to the worker pipeline),
  next/font with self-hosted fontsource, and ISR caching with a
  module-level cache for GitHub data.
- Vercel analytics/speed-insights were dropped; product analytics is
  planned via PostHog (deferred).
