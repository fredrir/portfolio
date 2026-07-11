terraform {
  required_version = ">= 1.10"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      project     = var.project
      environment = "preview"
      managed-by  = "terraform"
    }
  }
}

# Preview keeps only the media pipeline; no backups, no runtime users,
# no Cloudflare ingress until preview deployments exist (plan §17).
module "media" {
  source      = "../../modules/aws-media"
  project     = var.project
  environment = "preview"
}
