# Shared VPS audit — 2026-07-11

Read-only audit of the Hetzner host (`ssh letzner`, hostname `llunde-parser`)
required before Phase 3 firewall/Terraform work. See ARCHITECTURE.md addendum
item 2 for why.

## Host

- Ubuntu 26.04 LTS, kernel 7.0.0-15-generic
- 4 vCPU, 16 GiB RAM (~1.1 GiB used), 150 GB disk (24 GB used)
- Users with home directories: `deploy`, `leploy` — no `portfolio` user yet
- No podman, caddy, or system-level cloudflared installed

## Existing tenant (leploy)

A `pyparser` stack runs under **rootful Docker**: postgres, two workers, a
review app, dozzle, a docker-socket proxy, db-backup and backup-ship
containers, and — notably — **`pyparser-cloudflared`**: ingress already goes
through a Cloudflare Tunnel. No container publishes a port to the host.

## Network posture

- Public TCP listeners: **sshd on 22 only** (plus loopback resolver).
  Ports 80/443 are not in use by anything.
- ufw is active: allow 22/tcp, otherwise deny. Docker manages its own
  nftables NAT chains alongside.

## Consequences for the plan

1. **No firewall conflict.** The "no public web ingress" posture already
   holds. Keep ufw (do not replace it with a raw nftables ruleset — Docker's
   chains coexist with ufw today and a rewrite risks breaking the pyparser
   stack). A Hetzner Cloud Firewall (default-deny inbound + 22/tcp) can be
   added additively at the cloud layer.
2. **Port 22 stays world-open for now.** Moving SSH behind Cloudflare Access
   affects leploy's access too and must be coordinated explicitly — deferred,
   tracked as a Phase 3 decision.
3. **Coexistence is clean.** Our stack (rootless Podman under a new
   `portfolio` user, own outbound-only cloudflared, Postgres bound to
   localhost) collides with nothing: no port, user, or runtime overlap.
4. **Terraform must not manage the server resource.** The host pre-exists and
   is shared; scope Terraform to Cloudflare + AWS resources (and at most an
   additive Hetzner firewall). The DR "rebuild a blank VPS" exercise runs on a
   scratch server, never this host.
5. **Capacity is ample** for the portfolio stack under the plan's per-service
   resource limits.
