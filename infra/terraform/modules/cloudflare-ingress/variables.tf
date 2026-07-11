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

variable "enable_workers_vpc" {
  description = "Use Workers VPC private origins instead of the Access service-token fallback (pending plan verification)"
  type        = bool
  default     = false
}
