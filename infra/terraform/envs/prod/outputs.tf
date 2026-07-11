output "media_bucket" {
  value = module.media.media_bucket
}

output "backup_bucket" {
  value = module.media.backup_bucket
}

output "media_queue_url" {
  value = module.media.media_queue_url
}

output "media_dlq_url" {
  value = module.media.media_dlq_url
}

output "terraform_role_arn" {
  value = module.github_oidc.terraform_role_arn
}

output "tunnel_id" {
  value = module.ingress.tunnel_id
}

output "access_service_token_client_id" {
  value = module.ingress.access_service_token_id
}

output "ci_reader_role_arn" {
  value = module.github_oidc.reader_role_arn
}
