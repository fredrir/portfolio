# ADR 0004 — Doppler as the single configuration source

Status: accepted (2026-07-11)

## Context

Secrets initially lived in a local `.env` and Vercel's dashboard. The plan
(§12) names Doppler for development, preview and production configuration,
with machine identities holding the narrowest possible credentials.

## Decision

One Doppler project (`portfolio`) with `dev`, `preview` and `prd` configs.
There is no `.env` file: local development runs through `doppler run --`
(`doppler.yaml` binds the repo to `dev`), and `.env.example` documents
variable names only. The host holds a read-only `prd` service token
(mode 600); `render-env.sh` renders per-service systemd environment files
(postgres, api, worker, web-blue/green, backup) on every deploy, mapping
per-identity AWS keys (`API_AWS_*`, `WORKER_AWS_*`, `BACKUP_AWS_*`) to
each container's standard variables.

CI needs no Doppler access: images build without secrets (the reCAPTCHA
site key is public and passed as a GitHub Actions variable), and the host
pulls its own secrets at deploy time.

## Consequences

- Rotation is a Doppler value change + `render-env.sh` + service restart —
  no image rebuild, satisfying the plan's rotation requirement.
- The dev config carries LocalStack endpoints; Terraform must NOT run
  under `doppler run` (it would target LocalStack) — extract single values
  instead (`doppler secrets get ... --plain`).
- The Doppler service token on the host is a standing credential, scoped
  read-only to one config; compromise exposes prd values but grants no
  write or AWS/Cloudflare control beyond the runtime users' policies.
