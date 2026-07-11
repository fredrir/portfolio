#!/bin/bash
# Weekly physical base backup (PITR anchor); WAL replays on top of this.
set -euo pipefail

CONF=$HOME/.config/portfolio
BUCKET=$(grep '^BACKUP_BUCKET=' "$CONF/backup.env" | cut -d= -f2)
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
KEY="basebackups/base-$STAMP.tar.gz"

podman run --rm --network portfolio --env-file "$CONF/wal.env" \
    docker.io/library/postgres:17-alpine \
    pg_basebackup -h postgres -U replicator -D - -Ft -X none \
    | gzip \
    | podman run --rm -i --env-file "$CONF/backup.env" \
        docker.io/amazon/aws-cli:latest s3 cp - "s3://$BUCKET/$KEY" \
        --expected-size 1073741824 >/dev/null

echo "$(date -u +%FT%TZ) basebackup=$KEY result=success" >> "$CONF/backups.log"
echo "basebackup uploaded: $KEY"
