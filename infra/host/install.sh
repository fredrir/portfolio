#!/bin/bash
# Install/update the portfolio host services (run locally from the repo root).
#
#   CLOUDFLARE_API_TOKEN=... ./infra/host/install.sh [ssh-host]
#
# Requires: the bootstrap has run once (infra/host/bootstrap.sh), and the
# Cloudflare API token with Tunnel:Edit to fetch the connector token.
set -euo pipefail

HOST=${1:-letzner}
ACCOUNT_ID=8786559b30fcebd08d0c594b6e899eef
TUNNEL_ID=e84346c3-e3db-45ff-bc80-8b290679da23

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "CLOUDFLARE_API_TOKEN is required" >&2
  exit 1
fi

echo "==> syncing quadlets, Caddyfile and scripts"
tar -C "$(dirname "$0")" -cf - quadlets caddy bin | ssh "$HOST" '
  set -e
  rm -rf /tmp/portfolio-host && mkdir -p /tmp/portfolio-host
  tar -C /tmp/portfolio-host -xf -
  install -o portfolio -g portfolio -m 600 /tmp/portfolio-host/quadlets/* /home/portfolio/.config/containers/systemd/
  install -d -o portfolio -g portfolio /home/portfolio/caddy/slots /home/portfolio/bin
  install -o portfolio -g portfolio -m 644 /tmp/portfolio-host/caddy/Caddyfile /home/portfolio/caddy/Caddyfile
  install -o portfolio -g portfolio -m 755 /tmp/portfolio-host/bin/* /home/portfolio/bin/
  if [ ! -f /home/portfolio/caddy/slots/active.caddy ]; then
    printf "handle {\n\trespond \"no application deployed yet\" 503\n}\n" > /home/portfolio/caddy/slots/active.caddy
    chown portfolio:portfolio /home/portfolio/caddy/slots/active.caddy
  fi
  rm -rf /tmp/portfolio-host
'

echo "==> installing tunnel connector token"
TOKEN=$(curl -sf "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cfd_tunnel/${TUNNEL_ID}/token" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | python3 -c "import json,sys; print(json.load(sys.stdin)['result'])")
printf 'TUNNEL_TOKEN=%s\n' "$TOKEN" | ssh "$HOST" '
  umask 077
  cat > /home/portfolio/.config/portfolio/cloudflared.env
  chown portfolio:portfolio /home/portfolio/.config/portfolio/cloudflared.env
'

echo "==> reloading user services"
ssh "$HOST" '
  set -e
  uid=$(id -u portfolio)
  run_as() { sudo -u portfolio env XDG_RUNTIME_DIR=/run/user/$uid DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$uid/bus "$@"; }
  run_as systemctl --user daemon-reload
  run_as systemctl --user restart caddy.service cloudflared.service
  sleep 3
  run_as systemctl --user --no-pager --plain list-units "caddy.service" "cloudflared.service"
'
echo "==> done"
