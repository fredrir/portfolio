# hansteen.dev

Personal portfolio built as a small production platform: TanStack Start frontend,
Rust (Axum) API, PostgreSQL, and a private Hetzner origin behind Cloudflare.
The full architecture and delivery plan live in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Layout

| Path | What it is |
|---|---|
| `apps/web` | TanStack Start app (Vite, React 19, Tailwind v4) |
| `apps/api` | Axum API (SQLx, utoipa OpenAPI, RFC 9457 errors) |
| `apps/worker` | Rust SQS consumer: validates uploads, generates AVIF/WebP variants |
| `packages/api-client` | TypeScript client generated from the API's OpenAPI document |
| `infra/terraform` | AWS (S3/SQS/IAM/OIDC) and Cloudflare (Tunnel/DNS/Access) provisioning |
| `docs/` | Architecture plan, decisions, and the shared-VPS audit |
| `scripts/` | One-off tooling (e.g. Supabase → Postgres visitor migration) |

## Development

Requirements: [Bun](https://bun.sh), Rust (stable), Docker with compose.

```bash
cp .env.example .env           # adjust if needed
docker compose up -d           # Postgres 17 (5432) + LocalStack S3/SQS (4566)
bun install

bun run dev                    # web app on http://localhost:3000
cargo run -p portfolio-api     # API on http://localhost:8080
cargo run -p portfolio-worker  # media worker (SQS consumer)
```

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
