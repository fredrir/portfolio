# Host setup

Rootless runtime for the portfolio stack on the shared VPS. Everything runs as
the unprivileged `portfolio` user via Podman Quadlets; nothing here touches the
existing tenant (see ../../docs/vps-audit.md).

| File | Purpose |
|---|---|
| `bootstrap.sh` | One-time, as root: `portfolio` user, subuid/subgid, lingering, podman |
| `quadlets/` | systemd user units: `portfolio` network, cloudflared, caddy |
| `caddy/Caddyfile` | Origin entrypoint (placeholder until Phase 4 blue-green) |
| `install.sh` | Sync quadlets + Caddyfile, install tunnel token, restart services |

## Usage

```bash
ssh letzner 'bash -s' < infra/host/bootstrap.sh                    # once
CLOUDFLARE_API_TOKEN=$(doppler secrets get -p portfolio -c ops CLOUDFLARE_API_TOKEN --plain) \
  ./infra/host/install.sh                                          # each change
```

Ingress path: Cloudflare edge → Access (service token only) → tunnel
`e84346c3…` → cloudflared container → `http://caddy:8080` on the `portfolio`
podman network. The tunnel is remotely managed; its ingress rules live in
Terraform (`cloudflare-ingress` module). The connector token is fetched from
the Cloudflare API at install time and stored only in
`/home/portfolio/.config/portfolio/cloudflared.env` (mode 600).
