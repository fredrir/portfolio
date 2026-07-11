# ADR 0003 — Blue-green slots on a single VPS

Status: accepted (2026-07-11)

## Context

Releases must be low-downtime with instant rollback, but the platform runs
on one shared Hetzner host. Kubernetes or a second host would add cost and
operational surface the portfolio does not need; plain in-place restarts
would drop requests and make rollback slow.

## Decision

Run two complete app slots (`web-blue`+`api-blue`, `web-green`+`api-green`)
as rootless podman quadlets. Deploys start the inactive slot with
digest-pinned images, health-gate it from inside the container network,
then atomically switch Caddy's imported `slots/active.caddy` and reload.
The previous slot keeps running the prior release, so rollback is a config
flip (`rollback.sh`), not a redeploy. The media worker and PostgreSQL are
single instances: the worker tolerates brief restarts (SQS redelivers) and
the database is shared by both slots, which forces expand-contract
migrations.

## Consequences

- Zero-downtime switches and sub-second rollback, verified by the
  broken-release drill.
- Not high availability: the VPS remains a single failure domain (accepted;
  DR is restore-from-backup onto a rebuilt host).
- Both slots may run after a reboot (both are `WantedBy=default.target`);
  Caddy routes only to the active one, the other idles (~300 MB accepted).
- Database schema changes must stay compatible with the previous app
  version while both slots exist.
