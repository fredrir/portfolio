terraform {
  backend "s3" {
    bucket       = "hansteen-portfolio-terraform-state"
    key          = "prod/terraform.tfstate"
    region       = "eu-north-1"
    encrypt      = true
    use_lockfile = true
  }
}
