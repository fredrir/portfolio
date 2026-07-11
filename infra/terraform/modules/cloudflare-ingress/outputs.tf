output "tunnel_id" {
  value = cloudflare_zero_trust_tunnel_cloudflared.origin.id
}

output "access_service_token_id" {
  value = var.enable_workers_vpc ? null : cloudflare_zero_trust_access_service_token.edge_worker[0].client_id
}
