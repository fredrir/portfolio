variable "project" {
  type    = string
  default = "hansteen-portfolio"
}

variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "github_repository" {
  type    = string
  default = "fredrir/portfolio"
}

variable "state_bucket" {
  type    = string
  default = "hansteen-portfolio-terraform-state"
}

variable "hostname" {
  type    = string
  default = "hansteen.dev"
}

variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_zone_id" {
  type = string
}

variable "enable_workers_vpc" {
  type    = bool
  default = false
}

variable "create_oidc_provider" {
  type    = bool
  default = true
}

variable "edge_hostnames" {
  type    = list(string)
  default = []
}
