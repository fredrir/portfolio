terraform {
  backend "s3" {
    bucket       = "hansteen-portfolio-terraform-state"
    key          = "preview/terraform.tfstate"
    region       = "eu-north-1"
    encrypt      = true
    use_lockfile = true
  }
}
