#!/bin/bash
# Nightly: stream a compressed pg_dump to the encrypted backup bucket.
set -euo pipefail

CONF=$HOME/.config/portfolio
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
BUCKET=$(grep '^BACKUP_BUCKET=' "$CONF/backup.env" | cut -d= -f2)
KEY="postgres/portfolio-$STAMP.sql.gz"

podman exec postgres pg_dump -U portfolio portfolio | gzip \
    | podman run --rm -i --env-file "$CONF/backup.env" \
        docker.io/amazon/aws-cli:latest s3 cp - "s3://$BUCKET/$KEY" \
        --expected-size 209715200 >/dev/null

echo "$(date -u +%FT%TZ) backup=$KEY result=success" >> "$CONF/backups.log"
echo "backup uploaded: $KEY"
