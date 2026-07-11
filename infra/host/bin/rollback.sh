#!/bin/bash
# Instant rollback: point Caddy at the previous slot, which still runs the
# prior release. Refuses to flip onto a slot that isn't actually healthy.
set -euo pipefail

CONF=$HOME/.config/portfolio
SLOTS=$HOME/caddy/slots
PUBLIC_BASE=${PUBLIC_BASE:-https://hansteen.dev}
# shellcheck source=slot-lib.sh
source "$(dirname "$0")/slot-lib.sh"

ACTIVE=$(cat "$CONF/active-slot" 2>/dev/null || echo none)
[ "$ACTIVE" != "none" ] || { echo "nothing deployed"; exit 1; }
if [ "$ACTIVE" = "blue" ]; then TARGET=green; else TARGET=blue; fi

# Do not flip onto a dead slot: the previous release must still be serving.
if ! slot_healthy "$TARGET"; then
    echo "rollback target ($TARGET) is not healthy — refusing to flip" >&2
    exit 1
fi

write_slot "$TARGET"

# Smoke a slot-specific route through the public edge (not the static /healthz,
# which never touches a slot).
sleep 3
if ! curl -sf -m 10 -o /dev/null "$PUBLIC_BASE/en" \
    || ! curl -sf -m 10 -o /dev/null "$PUBLIC_BASE/api/v1/version"; then
    echo "rollback smoke failed" >&2
    exit 1
fi

echo "$TARGET" > "$CONF/active-slot"
echo "$(date -u +%FT%TZ) sha=rollback target=$TARGET result=success" >> "$CONF/deploys.log"
echo "rolled back to $TARGET"
