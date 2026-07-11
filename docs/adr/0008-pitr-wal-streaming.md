# ADR 0008: Point-in-time recovery via streamed WAL

Status: accepted (2026-07-11)

## Context

Nightly `pg_dump` gave a 24-hour recovery-point objective — a full day of
writes could be lost. The platform stores visitor history, contact messages,
media metadata and the audit chain; the acceptable data-loss window is
minutes, not a day.

## Decision

Stream write-ahead log continuously with `pg_receivewal` (a dedicated
`replicator` role + physical replication slot) into a volume, ship segments
to S3 every 15 minutes, and take a weekly `pg_basebackup`. Recovery replays
WAL on top of the newest base backup to any chosen timestamp. The nightly
logical dump stays as a second, portable recovery path.

## Consequences

- RPO drops from 24h to ≤15 min (the WAL-ship interval; `pg_switch_wal`
  forces a segment each run so quiet periods still flush).
- A replication slot pins WAL on the primary until consumed — if the
  receiver stops, disk can fill. The receiver runs as an always-restart
  quadlet and the restore test asserts WAL-shipping freshness (< 45 min).
- PgBouncer (session pooling) sits in front for connection efficiency;
  backups and the receiver talk to Postgres directly, bypassing the pool.
- Recovery is documented in runbooks.md and exercised by the weekly restore
  test into a disposable database.
