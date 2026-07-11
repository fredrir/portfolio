# ADR 0002 — Private origin via Cloudflare Tunnel + Access service token

Status: accepted (2026-07-11)

## Context

The plan requires the origin VPS to expose no public web ports. The
original design proposed Workers VPC private origins; that feature is
available on the account (verified via wrangler, open beta) but its
provisioning still runs through wrangler rather than Terraform, and the
platform needed a proven path first.

## Decision

Ingress is: edge Worker → Cloudflare Access → remotely-managed Tunnel →
cloudflared container → Caddy. The origin hostname
(`origin.hansteen.dev`) is wrapped in an Access application whose only
policy is `non_identity` with a service token that the edge Worker
presents on every request (`CF-Access-Client-Id/Secret`). Tunnel ingress
rules live in Terraform; the connector token is fetched from the
Cloudflare API at install time and exists only on the host (mode 600).

Workers VPC remains behind the `enable_workers_vpc` Terraform variable
for adoption once the routing is built and tested.

## Consequences

- Ports 80/443 stay closed; the host firewall audit confirmed nothing else
  needs them.
- Anyone hitting `origin.hansteen.dev` without the token gets a 403 from
  Access before reaching the tunnel.
- The Worker is a hard dependency for public traffic; its secrets are
  synced via `wrangler secret put` at deploy time, not through Terraform.
- The service token value passes through Terraform state (accepted risk,
  see threat model) and is rotated via `terraform taint` + re-sync.
