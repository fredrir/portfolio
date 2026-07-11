variable "account_id" {
  type = string
}

variable "zone_id" {
  description = "Zone id for the apex domain (hansteen.dev)"
  type        = string
}

variable "hostname" {
  description = "Public hostname served through the tunnel"
  type        = string
}

variable "tunnel_name" {
  type = string
}

variable "origin_service" {
  description = "Service URL cloudflared forwards to (container-network address of Caddy)"
  type        = string
  default     = "http://caddy:8080"
}

variable "edge_hostnames" {
  description = "Hostnames routed to the edge Worker (proxied placeholder records; routes live in wrangler config)"
  type        = list(string)
  default     = []
}

variable "enable_workers_vpc" {
  description = "Use Workers VPC private origins instead of the Access service-token fallback (pending plan verification)"
  type        = bool
  default     = false
}

variable "admin_hostname" {
  description = "Access-protected administration hostname (null disables)"
  type        = string
  default     = null
}

variable "admin_emails" {
  description = "Identities allowed through the admin Access application"
  type        = list(string)
  default     = []
}
