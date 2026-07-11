#!/bin/bash
# Weekly: restore the newest backup into a disposable database and validate.
set -euo pipefail

CONF=$HOME/.config/portfolio
BUCKET=$(grep '^BACKUP_BUCKET=' "$CONF/backup.env" | cut -d= -f2)

fail() {
    echo "$(date -u +%FT%TZ) restore-test result=failed reason=$1" >> "$CONF/backups.log"
    podman rm -f restore-test >/dev/null 2>&1 || true
    echo "restore test FAILED: $1" >&2
    exit 1
}

LATEST=$(podman run --rm --env-file "$CONF/backup.env" \
    docker.io/amazon/aws-cli:latest s3 ls "s3://$BUCKET/postgres/" \
    | sort | tail -1 | awk '{print $4}')
[ -n "$LATEST" ] || fail "no-backups-found"

podman rm -f restore-test >/dev/null 2>&1 || true
podman run -d --name restore-test -e POSTGRES_PASSWORD=restore-test \
    docker.io/library/postgres:17-alpine >/dev/null
for _ in $(seq 1 30); do
    podman exec restore-test pg_isready -U postgres >/dev/null 2>&1 && break
    sleep 2
done

podman run --rm --env-file "$CONF/backup.env" \
    docker.io/amazon/aws-cli:latest s3 cp "s3://$BUCKET/postgres/$LATEST" - \
    | gunzip \
    | podman exec -i restore-test psql -q -U postgres >/dev/null \
    || fail "restore-errored"

VISITORS=$(podman exec restore-test psql -tA -U postgres -c "select count(*) from visitors;")
MIGRATIONS=$(podman exec restore-test psql -tA -U postgres -c "select count(*) from _sqlx_migrations;")
podman rm -f restore-test >/dev/null

[ "$VISITORS" -gt 0 ] || fail "visitors-empty"
[ "$MIGRATIONS" -gt 0 ] || fail "migrations-missing"

echo "$(date -u +%FT%TZ) restore-test backup=$LATEST visitors=$VISITORS migrations=$MIGRATIONS result=success" >> "$CONF/backups.log"
echo "restore test OK: $LATEST visitors=$VISITORS migrations=$MIGRATIONS"
