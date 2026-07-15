# Monthly cost and capacity

## Cost (estimated, July 2026)

| Item | Detail | Monthly |
|---|---|---|
| Hetzner VPS | Existing shared host (4 vCPU / 16 GB / 150 GB) already paid for another project; this platform's marginal cost is ~€0. Honest attribution if split 50/50: ~€8. | €0–8 |
| AWS S3 (media + backups + state) | Well under 1 GB total today (`variants/` in KBs, nightly ~50 KB dumps × 30-day retention, state file). Storage ≈ $0.02; requests incl. the 30-min synthetic freshness checks ≈ $0.01. SSE uses AWS-managed keys (no key fee, bucket-key enabled). | < $0.05 |
| AWS SQS | Thousands of requests/month; first million free. | $0 |
| Cloudflare | Free plan: DNS, proxy, Tunnel, Access (≤50 users), Workers free tier (100k req/day ≫ current traffic). | $0 |
| Doppler | Developer (free) tier. | $0 |
| GitHub | Public repo: Actions minutes and GHCR storage free. | $0 |
| Domain | hansteen.dev registration ≈ $12/year. | ~$1 |

**Out-of-pocket marginal total: ≈ $1/month** (plus the pre-existing VPS).

Cost guards: S3 lifecycle rules (30-day backup expiry, 90-day noncurrent
versions, 7-day multipart abort), DLQ retention 14 days, image cache in
GitHub Actions (type=gha) rather than a paid registry cache.

## Capacity limits

- **Host:** 4 vCPU / 16 GB shared with the pyparser tenant (~1.1 GB).
  Portfolio memory caps: postgres 1 GB, each app slot container 512 MB
  (×4 when both slots run), worker 768 MB, caddy + cloudflared 256 MB each
  → ~3.8 GB worst case; plenty of headroom, enforced by quadlet limits.
- **Media worker:** AVIF encode of a ~2 MP JPEG ≈ 10 s in debug builds,
  a few seconds in release; SQS visibility timeout (120 s) bounds
  per-message processing; poison messages park in the DLQ after 5
  receives.
- **Uploads:** presigned PUTs capped at 30 MiB, content-type allowlisted.
- **Delivery:** one production deploy at a time (GitHub concurrency
  group); a deploy takes ~8–15 min with warm build caches, dominated by
  the Rust release build (rav1e).
- **Single failure domain:** blue-green is for release safety, not HA —
  the VPS itself is the availability bound (see slo.md and ADR 0003).
- **Workers free tier:** 100k requests/day; a traffic spike beyond that
  serves errors at the edge unless the plan is upgraded.
