# hansteen.dev

- TanStack Start
- Rust (Axum) API
- PostgreSQL
- Private Hetzner origin behind a Cloudflare Worker Access and Tunnel
- Deployed blue-green from signed, attested images.

## Architecture

### System context

```mermaid
flowchart LR
    V["Visitor / Recruiter<br/>(browser)"] --> CF["hansteen.dev platform<br/>(this system)"]
    A["Administrator<br/>(fredrir)"] --> CF
    CF --> GH["GitHub<br/>source, CI, GHCR, deployments API"]
    CF --> AWS["AWS eu-north-1<br/>S3 + SQS"]
    CF --> EXT["External APIs<br/>GitHub REST, Spotify, reCAPTCHA, Formspree"]
```

### Containers

```mermaid
flowchart TD
    B["Browser"] --> W["Cloudflare Worker (portfolio-edge)<br/>request ids, security headers,<br/>immutable asset cache, /media SigV4 reads"]
    W -->|"CF-Access-Client-Id/Secret"| ACC["Cloudflare Access<br/>service-token-only policy"]
    ACC --> T["Cloudflare Tunnel e84346c3<br/>(cloudflared, outbound-only)"]
    T --> C["Caddy :8080<br/>slots/active.caddy switch,<br/>x-origin-slot header"]
    C -->|"/api/*, /readyz"| API["Axum API (blue/green)<br/>visits, contact, media, version<br/>RFC 9457, request-id spans"]
    C -->|"everything else"| WEB["TanStack Start SSR (blue/green)<br/>node .output, server functions"]
    WEB -->|"generated TS client"| API
    API --> PG[("PostgreSQL 17<br/>visitors, contact_messages,<br/>media, variants, idempotency")]
    API -->|"presigned PUT"| S3[("S3 media bucket<br/>originals/, variants/")]
    S3 -->|"ObjectCreated originals/"| Q[["SQS media-processing<br/>+ DLQ (5 receives)"]]
    Q --> WK["Rust worker<br/>validate, sha256, AVIF/WebP,<br/>content-hashed keys"]
    WK --> S3
    WK --> PG
    W -->|"GET /media/variants/*<br/>SigV4, read-only key"| S3
    BK["backup.timer (nightly)"] --> PG
    BK --> S3B[("S3 backup bucket<br/>postgres/, SSE-KMS")]
```

### Deployment

```mermaid
flowchart TD
    subgraph GH["GitHub (main branch)"]
        CI["deploy.yml: checks →<br/>build web/api/worker once<br/>SBOM + provenance + cosign keyless"] --> GHCR[("GHCR<br/>images by SHA + digest")]
    end
    CI -->|"forced-command SSH<br/>'deploy &lt;sha&gt;', GHCR token on stdin"| HOST

    subgraph HOST["Hetzner llunde-parser (shared, no public web ports)"]
        subgraph LEPLOY["leploy tenant (untouched)"]
            PY["pyparser stack<br/>rootful Docker + own tunnel"]
        end
        subgraph PORTFOLIO["portfolio user — rootless podman quadlets"]
            D["deploy.sh<br/>cosign verify → digest drop-ins →<br/>health gate → caddy switch →<br/>public smoke → auto-rollback"]
            CFD["cloudflared"] --> CAD["caddy"]
            CAD --> BLUE["web-blue + api-blue"]
            CAD -.-> GREEN["web-green + api-green"]
            WKQ["worker"]
            PGQ[("postgres + pgdata volume")]
            TIMERS["backup.timer / restore-test.timer"]
        end
    end

    DOPPLER["Doppler prd config"] -->|"read-only service token<br/>render-env.sh"| PORTFOLIO
    TF["Terraform (S3 state, native locking)"] --> AWSR["S3/SQS/IAM/OIDC role"]
    TF --> CFR["Tunnel, DNS, Access,<br/>Worker placeholder records"]
```

## Layout

| Path | What it is |
|---|---|
| `apps/web` | TanStack Start app |
| `apps/api` | Axum API|
| `apps/worker` | Rust SQS consumer + CV release sync |
| `apps/edge` | Cloudflare Worker |
| `crates/terminal-plugins` | WASM terminal command |
| `packages/api-client` | TypeScript client|
| `infra/terraform` | AWS and Cloudflare|
| `infra/host` | bootstraps, rootless quadlets, deploy/rollback/backup scripts |

## Development

Requirements: [Bun](https://bun.sh), Rust (stable), Docker with compose, and the
[Doppler CLI](https://docs.doppler.com/docs/cli) (`doppler login`). Configuration
lives in the Doppler project `portfolio` (`dev`/`preview`/`prd`); `doppler.yaml`
binds this repo to the `dev` config — there is no `.env` file
(`.env.example` documents the variable names).

```bash
doppler setup --no-interactive              
docker compose up -d                      
bun install

bun run dev                                 # db/localstack + API + web
bun run dev:web                             # web app only, http://localhost:3000
bun run dev:api                             # API only, http://localhost:8080
doppler run -- cargo run -p portfolio-worker
```

### Checks

```bash
bun run lint
bun run --filter '@portfolio/web' typecheck build
cargo fmt --all --check && cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace      
cd packages/api-client && bun run check   
```


### Regenerating the API client

After changing API routes or schemas in `apps/api`:

```bash
cd packages/api-client && bun run generate
```

## Production-like containers

```bash
GIT_SHA=$(git rev-parse HEAD) docker compose --profile app up --build
```
