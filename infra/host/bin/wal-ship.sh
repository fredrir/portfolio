#!/bin/bash
# Ship streamed WAL (including the in-progress .partial segment) to S3.
# pg_switch_wal first so low-traffic periods still finalize segments.
set -euo pipefail

CONF=$HOME/.config/portfolio
BUCKET=$(grep '^BACKUP_BUCKET=' "$CONF/backup.env" | cut -d= -f2)

podman exec postgres psql -q -U portfolio -d portfolio -c "select pg_switch_wal();" >/dev/null

podman run --rm -v waldata:/wal:ro --env-file "$CONF/backup.env" \
    docker.io/amazon/aws-cli:latest s3 sync /wal "s3://$BUCKET/wal/" \
    --no-progress >/dev/null

echo "$(date -u +%FT%TZ) wal-ship result=success" >> "$CONF/backups.log"
