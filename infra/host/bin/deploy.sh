#!/bin/bash
# Blue-green deploy of one immutable release. Called via the forced-command
# entry with a git SHA; an ephemeral GHCR token may be provided on stdin.
set -euo pipefail

SHA=${1:?usage: deploy.sh <git-sha>}
[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "invalid sha" >&2; exit 2; }

REGISTRY=ghcr.io/fredrir
IDENTITY_RE='^https://github.com/fredrir/portfolio/'
ISSUER=https://token.actions.githubusercontent.com
PUBLIC_BASE=${PUBLIC_BASE:-https://new.hansteen.dev}
CONF=$HOME/.config/portfolio
SLOTS=$HOME/caddy/slots
QUADLET=$HOME/.config/containers/systemd
export DOCKER_CONFIG=$HOME/.docker
export REGISTRY_AUTH_FILE=$HOME/.docker/config.json

log() { echo "[deploy] $(date -u +%FT%TZ) $*"; }
record() {
    echo "$(date -u +%FT%TZ) sha=$SHA target=$TARGET result=$1" >> "$CONF/deploys.log"
}

ACTIVE=$(cat "$CONF/active-slot" 2>/dev/null || echo none)
if [ "$ACTIVE" = "blue" ]; then TARGET=green; else TARGET=blue; fi
log "release=$SHA active=$ACTIVE target=$TARGET"

# Ephemeral registry token on stdin (expires with the CI job).
if read -r -t 2 REGISTRY_TOKEN && [ -n "$REGISTRY_TOKEN" ]; then
    mkdir -p "$DOCKER_CONFIG"
    printf '%s' "$REGISTRY_TOKEN" | podman login ghcr.io \
        --username ci --password-stdin --authfile "$REGISTRY_AUTH_FILE" >/dev/null
    log "registry login ok"
fi

for img in web api worker; do
    ref="$REGISTRY/portfolio-$img:$SHA"
    log "verify signature: $ref"
    cosign verify "$ref" \
        --certificate-identity-regexp "$IDENTITY_RE" \
        --certificate-oidc-issuer "$ISSUER" >/dev/null 2>&1 \
        || { record failed-signature; log "SIGNATURE VERIFICATION FAILED for $img"; exit 1; }
    podman pull -q "$ref" >/dev/null
done

digest_of() {
    podman image inspect --format '{{index .RepoDigests 0}}' "$REGISTRY/portfolio-$1:$SHA"
}

for unit in "api-$TARGET" "web-$TARGET" worker; do
    case $unit in
        api-*) img=api ;;
        web-*) img=web ;;
        worker) img=worker ;;
    esac
    mkdir -p "$QUADLET/$unit.container.d"
    printf '[Container]\nImage=%s\n' "$(digest_of $img)" > "$QUADLET/$unit.container.d/image.conf"
done

"$HOME/bin/render-env.sh" >/dev/null
systemctl --user daemon-reload
systemctl --user restart "api-$TARGET.service" "web-$TARGET.service" worker.service

probe() {
    podman run --rm --network portfolio docker.io/curlimages/curl:8 \
        -sf -o /dev/null -m 5 "$1" 2>/dev/null
}

log "health gate for $TARGET slot"
healthy=""
for _ in $(seq 1 30); do
    if probe "http://api-$TARGET:8080/readyz" && probe "http://web-$TARGET:3000/en"; then
        healthy=1
        break
    fi
    sleep 3
done
if [ -z "$healthy" ]; then
    record failed-health
    log "HEALTH GATE FAILED — $ACTIVE slot untouched, aborting"
    exit 1
fi
systemctl --user is-active --quiet worker.service \
    || { record failed-worker; log "worker not running, aborting"; exit 1; }

write_slot() {
    cat > "$SLOTS/active.caddy" <<CADDY
handle /api/* {
	header +x-origin-slot $1
	reverse_proxy api-$1:8080
}
handle /readyz {
	reverse_proxy api-$1:8080
}
handle {
	header +x-origin-slot $1
	reverse_proxy web-$1:3000
}
CADDY
    podman exec caddy caddy reload --config /etc/caddy/Caddyfile 2>/dev/null
}

log "switching traffic to $TARGET"
write_slot "$TARGET"

smoke() {
    curl -sf -m 10 -o /dev/null "$PUBLIC_BASE/healthz" \
        && curl -sf -m 10 -o /dev/null "$PUBLIC_BASE/en" \
        && curl -sf -m 10 "$PUBLIC_BASE/api/v1/version" | grep -q "$SHA"
}

log "public smoke tests + stabilization window"
ok=1
for _ in 1 2 3; do
    smoke || { ok=""; break; }
    sleep 5
done
if [ -z "$ok" ]; then
    log "SMOKE FAILED — rolling back to $ACTIVE"
    if [ "$ACTIVE" != "none" ]; then
        write_slot "$ACTIVE"
    fi
    record rolled-back
    exit 1
fi

echo "$TARGET" > "$CONF/active-slot"
record success
podman logout ghcr.io --authfile "$REGISTRY_AUTH_FILE" >/dev/null 2>&1 || true
log "release $SHA live on $TARGET"
