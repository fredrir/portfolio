#!/bin/bash
# Instant rollback: point Caddy at the previous slot, which still runs the
# prior release.
set -euo pipefail

CONF=$HOME/.config/portfolio
SLOTS=$HOME/caddy/slots
PUBLIC_BASE=${PUBLIC_BASE:-https://new.hansteen.dev}

ACTIVE=$(cat "$CONF/active-slot" 2>/dev/null || echo none)
[ "$ACTIVE" != "none" ] || { echo "nothing deployed"; exit 1; }
if [ "$ACTIVE" = "blue" ]; then TARGET=green; else TARGET=blue; fi

cat > "$SLOTS/active.caddy" <<CADDY
handle /api/* {
	reverse_proxy api-$TARGET:8080
}
handle /readyz {
	reverse_proxy api-$TARGET:8080
}
handle {
	reverse_proxy web-$TARGET:3000
}
CADDY
podman exec caddy caddy reload --config /etc/caddy/Caddyfile

sleep 3
curl -sf -m 10 -o /dev/null "$PUBLIC_BASE/healthz" \
    || { echo "rollback smoke failed" >&2; exit 1; }

echo "$TARGET" > "$CONF/active-slot"
echo "$(date -u +%FT%TZ) sha=rollback target=$TARGET result=success" >> "$CONF/deploys.log"
echo "rolled back to $TARGET"
