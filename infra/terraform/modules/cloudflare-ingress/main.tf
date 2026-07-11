terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

# Remotely-managed tunnel: configuration lives in Cloudflare, and the
# connector token is fetched at deploy time via the API rather than being
# exported through Terraform outputs.
resource "cloudflare_zero_trust_tunnel_cloudflared" "origin" {
  account_id = var.account_id
  name       = var.tunnel_name
  config_src = "cloudflare"
}

resource "cloudflare_dns_record" "origin" {
  zone_id = var.zone_id
  name    = var.hostname
  type    = "CNAME"
  content = "${cloudflare_zero_trust_tunnel_cloudflared.origin.id}.cfargotunnel.com"
  proxied = true
  ttl     = 1
}

# Fallback ingress control while Workers VPC availability is unverified:
# the origin hostname is wrapped in an Access application whose only
# non-interactive path is a service token held by the edge Worker.
resource "cloudflare_zero_trust_access_service_token" "edge_worker" {
  count      = var.enable_workers_vpc ? 0 : 1
  account_id = var.account_id
  name       = "${var.tunnel_name}-edge-worker"
}

resource "cloudflare_zero_trust_access_policy" "edge_worker_only" {
  count      = var.enable_workers_vpc ? 0 : 1
  account_id = var.account_id
  name       = "service-token-only"
  decision   = "non_identity"
  include = [{
    service_token = {
      token_id = cloudflare_zero_trust_access_service_token.edge_worker[0].id
    }
  }]
}

resource "cloudflare_zero_trust_access_application" "origin" {
  count            = var.enable_workers_vpc ? 0 : 1
  zone_id          = var.zone_id
  name             = "${var.tunnel_name}-origin"
  domain           = var.hostname
  type             = "self_hosted"
  session_duration = "24h"
  policies = [{
    id         = cloudflare_zero_trust_access_policy.edge_worker_only[0].id
    precedence = 1
  }]
}
