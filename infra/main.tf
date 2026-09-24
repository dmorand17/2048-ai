provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      project     = var.app_name
      environment = var.environment
      managed-by  = "terraform"
    }
  }
}
