variable "project" {
  description = "Name prefix for every resource"
  type        = string
}

variable "environment" {
  description = "prod or preview"
  type        = string
  validation {
    condition     = contains(["prod", "preview"], var.environment)
    error_message = "environment must be prod or preview"
  }
}

variable "create_backup_bucket" {
  description = "Provision the PostgreSQL backup bucket (prod only)"
  type        = bool
  default     = false
}

variable "create_iam_users" {
  description = "Provision runtime IAM users (api, worker, media-reader, backup)"
  type        = bool
  default     = false
}

variable "backup_retention_days" {
  type    = number
  default = 30
}

variable "max_receive_count" {
  description = "SQS redrives before a message lands in the DLQ"
  type        = number
  default     = 5
}

variable "visibility_timeout_seconds" {
  type    = number
  default = 120
}
