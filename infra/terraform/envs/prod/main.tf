terraform {
  required_version = ">= 1.10"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      project     = var.project
      environment = "prod"
      managed-by  = "terraform"
    }
  }
}

# Reads CLOUDFLARE_API_TOKEN from the environment.
provider "cloudflare" {}

module "media" {
  source               = "../../modules/aws-media"
  project              = var.project
  environment          = "prod"
  create_backup_bucket = true
  create_iam_users     = true
}

module "github_oidc" {
  source               = "../../modules/github-oidc"
  project              = var.project
  github_repository    = var.github_repository
  state_bucket         = var.state_bucket
  create_oidc_provider = var.create_oidc_provider
}

module "ingress" {
  source             = "../../modules/cloudflare-ingress"
  account_id         = var.cloudflare_account_id
  zone_id            = var.cloudflare_zone_id
  hostname           = var.hostname
  tunnel_name        = "${var.project}-origin"
  edge_hostnames     = var.edge_hostnames
  enable_workers_vpc = var.enable_workers_vpc
}
