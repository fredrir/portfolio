#!/bin/bash
# Ship streamed WAL to S3, then prune old completed segments locally so the
# waldata volume stays bounded. S3 retention is handled by the bucket lifecycle
# rule on the wal/ prefix. A flock prevents overlap if a run overruns the timer.
set -euo pipefail

CONF=$HOME/.config/portfolio
BUCKET=$(grep '^BACKUP_BUCKET=' "$CONF/backup.env" | cut -d= -f2-)

exec 9>"$CONF/wal-ship.lock"
if ! flock -n 9; then
    echo "$(date -u +%FT%TZ) wal-ship result=skipped reason=locked" >> "$CONF/backups.log"
    exit 0
fi

# Finalize the current segment so idle periods still ship progress, then wait
# for the switched segment to appear complete (poll rather than a fixed sleep).
podman exec postgres psql -q -U portfolio -d portfolio -c "select pg_switch_wal();" >/dev/null
for _ in $(seq 1 10); do
    sleep 1
    podman run --rm -v waldata:/wal:ro docker.io/library/alpine:3 \
        sh -c 'ls -1 /wal | grep -qE "^[0-9A-F]{24}$"' && break
done

podman run --rm -v waldata:/wal:ro --env-file "$CONF/backup.env" \
    docker.io/amazon/aws-cli:latest s3 sync /wal "s3://$BUCKET/wal/" \
    --no-progress >/dev/null

# Drop completed (non-.partial) segments older than 3 days locally; they live
# in S3 for restore and pg_receivewal never rewrites a finished segment.
podman run --rm -v waldata:/wal docker.io/library/alpine:3 \
    sh -c 'find /wal -maxdepth 1 -type f -name "[0-9A-F]*" ! -name "*.partial" -mtime +3 -delete' || true

echo "$(date -u +%FT%TZ) wal-ship result=success" >> "$CONF/backups.log"
