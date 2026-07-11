#!/bin/bash
# Shared Caddy slot-routing helpers, sourced by deploy.sh and rollback.sh so
# the two always emit byte-identical config (active + admin vhosts, header
# hygiene). Expects $SLOTS to point at the caddy slots directory.

# Point both the public and admin vhosts at slot $1 (blue|green) and reload.
write_slot() {
    local slot="$1"
    cat > "$SLOTS/active.caddy" <<CADDY
handle /api/* {
	header +x-origin-slot $slot
	reverse_proxy api-$slot:8080 {
		header_up -x-admin-origin
	}
}
handle /readyz {
	reverse_proxy api-$slot:8080
}
handle {
	header +x-origin-slot $slot
	reverse_proxy web-$slot:3000 {
		header_up -x-admin-origin
	}
}
CADDY
    cat > "$SLOTS/admin.caddy" <<CADDY
@root path /
redir @root /admin
handle {
	reverse_proxy web-$slot:3000 {
		header_up x-admin-origin 1
	}
}
CADDY
    podman exec caddy caddy reload --config /etc/caddy/Caddyfile 2>/dev/null
}

# True if the api and web containers of slot $1 answer their health endpoints.
slot_healthy() {
    local slot="$1"
    podman run --rm --network portfolio docker.io/curlimages/curl:latest \
        -sf -o /dev/null -m 5 "http://api-$slot:8080/readyz" 2>/dev/null \
        && podman run --rm --network portfolio docker.io/curlimages/curl:latest \
            -sf -o /dev/null -m 5 "http://web-$slot:3000/en" 2>/dev/null
}
