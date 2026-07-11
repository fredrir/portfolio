# ADR 0007: Edge rate limiting with Durable Objects

Status: accepted (2026-07-11)

## Context

The private origin has one failure domain (a shared VPS). Cloudflare's
plan-level rate limiting is coarse and mostly per-zone; the API needs
per-client limits, stricter on mutating routes, applied before traffic ever
reaches the tunnel.

## Decision

Rate-limit in the edge Worker using a Durable Object (`RateLimiter`), one
instance per client IP via `idFromName`, holding a sliding window in memory.
General traffic is capped at 300 req/min; `POST /api/*` at 20 req/min.
Breaches get 429 + `retry-after`. DO errors fail open — this is an abuse
brake, not an authorization control, and availability wins.

## Consequences

- Counts are globally consistent per IP across colos (single DO instance).
- Hibernation wipes in-memory state, resetting the window; acceptable and
  keeps the object free-tier friendly (no SQLite storage cost).
- Abuse is stopped at the edge, sparing the origin and the DB connection
  pool. Verified: 20 rapid POSTs pass, the 21st returns 429.
- Not a substitute for auth or the API's own validation — layered with the
  constant-time admin-token check and captcha verification.
