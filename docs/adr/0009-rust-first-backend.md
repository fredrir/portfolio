# ADR 0009: Rust-first backend, thin React server

Status: accepted (2026-07-11)

## Context

Data fetching and third-party integration (GitHub scrape, Spotify OAuth,
reCAPTCHA verification, analytics aggregation) originally lived in TanStack
server functions. That split business logic across two languages, duplicated
caching, and exposed the browser's IP to the GitHub API on every page load.

## Decision

Move the heavy lifting into the Axum API: `/api/v1/github`, `/api/v1/spotify`,
captcha verification (visits/contact/spotify), `/api/v1/analytics`,
`/api/v1/analytics/posthog`, `/api/v1/deployments`, and the hash-chained
audit log. The React server functions become thin forwarders; panes fetch
same-origin JSON. Secrets (Spotify, reCAPTCHA, PostHog query key) live only
in the API's environment.

## Consequences

- One place for caching, one language for domain logic, one typed contract
  (the generated client; drift-checked in CI).
- The browser never calls GitHub/PostHog APIs directly — no IP exposure, no
  third-party rate-limit coupling to visitor traffic.
- Captcha verification is centralized; the web tier only forwards tokens.
- Spotify is captcha-gated, so it loads client-side in its pane rather than
  during SSR (no server-side captcha token exists) — a deliberate trade of
  a first-paint Spotify card for not weakening the captcha.
- Supabase left the web app entirely (gallery now reads the media API).
