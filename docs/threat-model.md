# Threat model

Scope: the production platform serving hansteen.dev (edge Worker, private
origin, media pipeline, delivery pipeline). Personal-data footprint is
small (visitor rows with IP + user agent, contact messages) but treated as
confidential.

## Trust boundaries

| # | Boundary | Crossing |
|---|---|---|
| 1 | Browser ↔ Cloudflare edge | TLS; WAF/DDoS at Cloudflare; Worker adds security headers |
| 2 | Edge Worker ↔ origin | Access service token over the tunnel; origin has no public web ports |
| 3 | Origin ↔ AWS | Per-service IAM users with prefix-scoped policies |
| 4 | CI ↔ host | Forced-command SSH key (deploy/rollback/status only); ephemeral GHCR token on stdin |
| 5 | CI ↔ AWS | GitHub OIDC role scoped to project-prefixed resources |
| 6 | portfolio tenant ↔ leploy tenant | Separate unix users; rootless podman vs rootful docker; no shared ports |
| 7 | Application ↔ administrator | Bearer `ADMIN_TOKEN` on media administration endpoints |

## Assets

- Doppler configs (all runtime secrets), host-side read-only prd service token
- Cloudflare Access service token (the only path to the origin)
- Tunnel connector token (host file, mode 600)
- CI deploy key (restricted by forced command + no-pty/no-forwarding)
- Runtime IAM users: api (Put/Get/DeleteObject originals/* + DeleteObject
  unreferenced variants/*), worker (queue consume +
  GetObject originals/* + PutObject variants/* and cv/*), media-reader
  (GetObject variants/* and cv/*), backup (Put/GetObject postgres/* + scoped
  ListBucket)
- Signed container images in GHCR (SBOM + provenance attached)
- PostgreSQL data and encrypted S3 backups

## Threats and mitigations

| Threat | Mitigation in place |
|---|---|
| Spoofed origin traffic bypassing the edge | Access rejects anything without the service token (verified 403); no public 80/443 |
| Tampered/substituted release images | Host runs `cosign verify` pinned to the repo's OIDC identity before any pull is used; quadlet drop-ins pin digests |
| Malicious PR exfiltrating deploy credentials | Deploy job gated by the `production` environment; secrets absent from PR-triggered workflows; OIDC role trust restricted to repo subjects |
| Stolen deploy SSH key | Forced command limits it to `deploy <sha>`/`rollback`/`status`; sha format validated; no pty/forwarding |
| Registry credential theft from the host | None stored: CI passes its ephemeral `GITHUB_TOKEN` on stdin, logout after deploy |
| Hostile upload (polyglot/decompression bomb) | Presigned PUT constrains content-type/length; worker validates magic bytes and decodes with limits; failures are terminal, queues drain to DLQ |
| Media key traversal at the edge | `/media/` only serves `variants/` and `cv/` keys, rejects `..`; IAM policy enforces the same server-side |
| Admin endpoint brute force | Constant-time token compare (`subtle`); endpoint disabled entirely when no token configured |
| Container escape / lateral movement | Rootless podman, read-only rootfs, `no-new-privileges`, dropped capabilities (minimal add-backs documented), memory/pid limits |
| Timing/log leakage of secrets | Secrets never in argv or logs; wrangler/Doppler writes via stdin; deploy logs redact nothing because nothing secret is printed |
| SQL injection | sqlx bound parameters exclusively |
| Cross-tenant interference (leploy) | Additive-only host changes; separate users; audited port usage; Terraform never manages the shared server (ADR 0005) |

## Accepted risks (reviewed 2026-07-11)

1. **SSH port 22 world-open** — required by both tenants today; moving SSH
   behind Cloudflare Access needs coordination with leploy. Key-only auth.
2. **Service token and tunnel secrets transit Terraform state** — state
   bucket is KMS-encrypted, versioned, access-blocked; rotation procedure
   exists (runbooks).
3. **Formspree third-party contact delivery** — message content leaves our
   trust domain until the queue-worker delivery consumer replaces it.
4. **CSP relies on `'unsafe-inline'`** — a Content-Security-Policy is enforced
   at the edge on every response, but script/style still allow `'unsafe-inline'`
   (the window-manager UI needs an inline audit before nonces/hashes can
   replace it). All other security headers are in place.

Resolved since the initial model: Supabase is out of every runtime path — the
gallery and Spotify data now come from the Axum API and S3 (ADR 0009); only the
one-off `scripts/migrate-*.ts` still reference it.
