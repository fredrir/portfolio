# Service level objectives

Targets from the delivery plan (§13) and how each is measured **today**.
Measurement is intentionally lightweight: synthetic checks + headers, not
a metrics stack (see the observability deviation note at the bottom).

| Objective | Target | Measured by |
|---|---|---|
| Public availability | 99.9% monthly (~43 min error budget) | Synthetic workflow every 30 min probes `/healthz`, `/en`, `/api/v1/version`, `/sitemap.xml`; any failure emails immediately and is visible in the public Actions history |
| Cached page latency (p95) | < 300 ms at the edge | `server-timing: edge;dur=…` + `x-edge-cache` headers on every response; spot-checked from the Engineering pane |
| API latency (p95) | < 500 ms end to end | Same headers on `/api/*` responses through the edge |
| Undetected failed backups | zero | Freshness assertion (<26h) every 30 min via the OIDC AWS role; weekly restore test into a disposable database validates content, not just existence |
| Health-gated releases | 100% | `deploy.sh` refuses to switch traffic without slot health + public smoke incl. version match; failures auto-rollback and are red in GitHub |
| Queue age | < 10 min normal; poison messages parked ≤ 5 receives | SQS visibility timeout 120 s, DLQ redrive after 5 receives, 14-day DLQ retention |

## Error budget policy

A synthetic failure run = 30 minutes of assumed downtime (worst case
between probes). Two consecutive failures trigger manual investigation via
the runbooks; the budget is reviewed when planning risky changes (schema
contractions, ingress changes).

## Deviation note (reviewed 2026-07-11)

The plan's full OpenTelemetry stack (collector + trace backend +
dashboards) is deferred to keep the shared 4-core host lean. What shipped
instead: `x-request-id` generated at the edge and propagated through web
server functions into API tracing spans and responses; structured logs
(JSON-capable) in both Rust services; `x-edge-colo`/`x-edge-cache`/
`x-origin-slot`/`server-timing` on every response; media pipeline
correlation via `media_id` + content hashes. A collector can be added
later without application changes since instrumentation is already
tracing-native.
