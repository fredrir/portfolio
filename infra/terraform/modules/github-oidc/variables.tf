variable "project" {
  type = string
}

variable "github_repository" {
  description = "owner/name of the repository allowed to assume the role"
  type        = string
}

variable "state_bucket" {
  description = "Terraform state bucket the CI role may read and write"
  type        = string
}

variable "allowed_subs" {
  description = "OIDC sub claims allowed to assume the role"
  type        = list(string)
  default     = null
}
