# Runbooks

All host commands run as root via `ssh letzner` unless stated; user-level
service commands need the `XDG_RUNTIME_DIR`/`DBUS_SESSION_BUS_ADDRESS`
prefix shown in `infra/host/install.sh`.

## Deploy

Automatic: merge to `main`. The Deploy workflow re-runs checks, builds the
three images once (SBOM + provenance), signs them with keyless Cosign,
pushes to GHCR and invokes `deploy <sha>` over the forced-command SSH key.
The host verifies signatures, starts the inactive slot, health-gates it,
switches Caddy, smoke-tests publicly and rolls back on failure.

Manual re-run: `gh run rerun <run-id> --failed` reuses already-built
images for the same SHA. Deploy state on the host:
`ssh letzner 'sudo -u portfolio cat /home/portfolio/.config/portfolio/deploys.log | tail'`.

## Rollback

The previous slot keeps running the prior release.

```bash
# from CI's key (or root on the host):
ssh portfolio@95.217.135.164 rollback
# as root on the host:
sudo -u portfolio /home/portfolio/bin/rollback.sh
```

Verify: `curl -sI https://new.hansteen.dev/en | grep x-origin-slot` and
`/api/v1/version` shows the previous commit.

## Disaster recovery (RPO 24h, RTO target 2h)

Nightly backups land in `s3://hansteen-portfolio-backups-prod/postgres/`
(SSE-KMS, 30-day retention). To rebuild on a fresh host:

1. Point the `letzner` alias (or a new alias) at the replacement server.
2. `ssh <host> 'bash -s' < infra/host/bootstrap.sh`
3. Install the Doppler prd service token and CI deploy key
   (`infra/host/install.sh` does the key + cosign; the Doppler token is
   created with `doppler configs tokens create` and written to
   `/home/portfolio/.config/portfolio/doppler.token`).
4. `CLOUDFLARE_API_TOKEN=... ./infra/host/install.sh <host>` — this also
   fetches the tunnel connector token, so the tunnel reattaches to the
   same Cloudflare tunnel ID with no DNS change.
5. Start postgres, restore the newest dump (the inverse of
   `bin/backup.sh`: `aws s3 cp ... - | gunzip | podman exec -i postgres
   psql -U portfolio portfolio`).
6. Trigger a deploy (`gh workflow run deploy.yml` or rerun the latest) and
   let the health gates confirm.
7. Run `bin/restore-test.sh` and the synthetic workflow manually.

The shared production host is never the rebuild target for exercises
(ADR 0005).

## Secret rotation

- **Application secret (Spotify, reCAPTCHA, …):** change in Doppler prd →
  `sudo -u portfolio /home/portfolio/bin/render-env.sh` → restart the
  affected user services. No rebuild.
- **Runtime IAM keys:** `aws iam create-access-key` for the user, put the
  new pair in Doppler prd (`API_AWS_*`/`WORKER_AWS_*`/`BACKUP_AWS_*`),
  render + restart, then `aws iam delete-access-key` for the old pair.
- **Access service token (edge → origin):** `terraform taint
  'module.ingress.cloudflare_zero_trust_access_service_token.edge_worker[0]'`
  → apply → extract from state and `wrangler secret put
  CF_ACCESS_CLIENT_ID/SECRET` (values via stdin, then verify with a public
  request before the old token expires).
- **Tunnel connector token:** re-run `install.sh` (fetches a fresh token
  from the API) and restart `cloudflared.service`.
- **Deploy SSH key:** generate a new keypair, update
  `infra/host/deploy_key.pub`, run `install.sh`, update the
  `DEPLOY_SSH_KEY` GitHub secret.
- **Doppler service token:** `doppler configs tokens create` a new one,
  replace the host file, revoke the old in Doppler.

## Backup restore verification

Weekly automatic (`restore-test.timer`, Sundays 05:00 UTC): newest dump
into a disposable postgres container; validates visitor and migration
counts; logs to `/home/portfolio/.config/portfolio/backups.log`.

Manual: `ssh letzner 'sudo -u portfolio /home/portfolio/bin/restore-test.sh'`.
Backup freshness (<26h) is also asserted every 30 minutes by the synthetic
workflow, which emails on failure.

## Release rollback

The old Vercel deployment has been decommissioned; rollback is
slot-and-tunnel only, which is faster than DNS anyway:

1. `ssh portfolio@<host> rollback` (forced command) flips Caddy back to the
   previous blue/green slot, which still runs the prior release. Traffic
   returns immediately; no image pull, no DNS wait.
2. For a bad edge deploy, `cd apps/edge && bunx wrangler rollback`.
3. `new.hansteen.dev` and the apex both flow through the same Worker →
   origin path, so there is no separate fallback host to maintain.

## Point-in-time recovery (PITR)

Continuous protection on top of the nightly dumps: `wal-receiver` streams WAL
over a replication slot into the `waldata` volume; `wal-ship.timer` syncs it
(after `pg_switch_wal`) to `s3://…-backups-prod/wal/` every 15 minutes;
`basebackup.timer` uploads a weekly `pg_basebackup` tarball under
`basebackups/`. Effective RPO ≤ 15 minutes.

Restore to time T:

1. Fetch the newest base backup older than T and unpack it into a fresh data
   directory: `aws s3 cp s3://…/basebackups/base-<stamp>.tar.gz - | gunzip |
   tar -x -C /restore` (base.tar contains the cluster; pg_wal is empty).
2. Fetch WAL: `aws s3 sync s3://…/wal/ /restore-wal/`.
3. In the restored data dir create `recovery.signal` and set in
   `postgresql.auto.conf`:
   `restore_command = 'cp /restore-wal/%f %p || cp /restore-wal/%f.partial %p'`
   `recovery_target_time = '<T ISO8601>'`
   `recovery_target_action = 'promote'`
   The `.partial` fallback matters: the most recent transactions live in the
   segment pg_receivewal has not finished, and without the fallback recovery
   stops early with "recovery ended before configured recovery target".
4. Start a disposable postgres container mounting the data dir (rootless
   podman: `podman unshare chown -R 70:70` the data dir first, run with
   `--user 70:70`); wait for promotion; validate row counts.
5. For production recovery, follow the DR runbook with this data directory in
   place of the pg_dump restore.

Drilled 2026-07-11: a marker row committed at 20:09:03Z (after the 19:26Z
base backup) was recovered into a disposable instance via WAL replay,
including the `.partial` segment.
