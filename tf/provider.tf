terraform {
  required_version = ">= 0.14.8"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
  # It is possible to implement by writing the access_key and secret_key to a file, but this is not recommended.
  # access_key = "my-access-key"
  # secret_key = "my-secret-key"
}