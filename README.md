# hansteen.dev

Personal portfolio built as a small production platform: TanStack Start frontend,
Rust (Axum) API, PostgreSQL, and a private Hetzner origin behind a Cloudflare
Worker, Access and Tunnel — deployed blue-green from signed, attested images.
The plan lives in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md); the platform
inspects itself live in the Engineering, Deployments, Media Lab and Analytics
panes on the site. Data heavy-lifting (GitHub, Spotify, analytics, captcha,
deployments, audit) runs in the Rust API; React only renders. Media is
administered at `admin.hansteen.dev` behind Cloudflare Access.

## Layout

| Path | What it is |
|---|---|
| `apps/web` | TanStack Start app (Vite, React 19, Tailwind v4) |
| `apps/api` | Axum API (SQLx, utoipa OpenAPI, RFC 9457 errors) |
| `apps/worker` | Rust SQS consumer: media variants (AVIF/WebP) + CV release sync |
| `apps/edge` | Cloudflare Worker: routing, CSP, DO rate limiting, signed S3 media reads |
| `crates/terminal-plugins` | WASM terminal command (`fract`), loaded on demand in the browser |
| `packages/api-client` | TypeScript client generated from the API's OpenAPI document |
| `infra/terraform` | AWS (S3/SQS/IAM/OIDC) and Cloudflare (Tunnel/DNS/Access) provisioning |
| `infra/host` | Host bootstrap, rootless quadlets, deploy/rollback/backup scripts |
| `docs/` | Plan, C4 diagrams, ADRs, threat model, runbooks, SLOs, costs, postmortems |
| `scripts/` | One-off tooling (e.g. Supabase → Postgres visitor migration) |

## Development

Requirements: [Bun](https://bun.sh), Rust (stable), Docker with compose, and the
[Doppler CLI](https://docs.doppler.com/docs/cli) (`doppler login`). Configuration
lives in the Doppler project `portfolio` (`dev`/`preview`/`prd`); `doppler.yaml`
binds this repo to the `dev` config — there is no `.env` file
(`.env.example` documents the variable names).

```bash
doppler setup --no-interactive              # once per checkout
docker compose up -d                        # Postgres 17 (5432) + LocalStack S3/SQS (4566)
bun install

bun run dev                                 # web app on http://localhost:3000 (wraps `doppler run`)
doppler run -- cargo run -p portfolio-api   # API on http://localhost:8080
doppler run -- cargo run -p portfolio-worker
```

The web `dev` script invokes `doppler run` internally, so it needs no prefix; the
Rust binaries still take an explicit `doppler run --`.

The media flow runs fully locally: `POST /api/v1/media/uploads` (bearer
`ADMIN_TOKEN`) returns a presigned S3 PUT; the S3 event fans through SQS to the
worker, which produces AVIF/WebP variants and flips the record to `ready`.

### Checks

```bash
bun run --filter '@portfolio/web' lint typecheck build
cargo fmt --all --check && cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace      # integration tests use disposable per-test databases
cd packages/api-client && bun run check   # fails if the generated client drifted
```

The same checks run in CI on every branch push and pull request.

### Regenerating the API client

After changing API routes or schemas in `apps/api`:

```bash
cd packages/api-client && bun run generate
```

## Production-like containers

```bash
GIT_SHA=$(git rev-parse HEAD) docker compose --profile app up --build
```

Runs db + api + web with read-only root filesystems. Web serves on
`localhost:3000`, API on `localhost:8080`; the deployed version is visible at
`/api/v1/version`.
