# Performance experiments

## HTTP/3 (2026-07-11)

Verified already enabled at the zone (Cloudflare default): responses carry
`alt-svc: h3=":443"`. Browsers negotiate QUIC on repeat visits; no origin
changes required (the tunnel speaks HTTP/2 to cloudflared; H3 terminates at
the edge).

## Early Hints + 0-RTT (blocked, pending token permission)

Enabling `early_hints` and `0rtt` zone settings requires an API token with
Zone Settings:Edit, which the current infrastructure token lacks (403 on
PATCH). One-minute fix: extend the token in the Cloudflare dashboard, restore
the `cloudflare_zone_setting` resources (git history: commit that removed
them) and `terraform apply`. Early Hints additionally needs `Link:
rel=preload` response headers for the hashed CSS/JS bundles — worth wiring in
the web tier at the same time; measure via `server-timing` cold-load deltas.

## Edge caching for signed media (2026-07-11, shipped)

SigV4 subrequests carry an Authorization header, which made `cf-cache-status`
report BYPASS. Explicit `caches.default` match/put keyed on the public URL
fixed it: second request serves `x-edge-cache: HIT` without an S3 read.
Content-hashed keys make invalidation unnecessary.
