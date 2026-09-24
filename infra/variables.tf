variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name, used as a prefix for all resources"
  type        = string
  default     = "2048-ai"
}

variable "environment" {
  description = "Deployment environment (e.g. prod, dev)"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "cpu" {
  description = "Fargate task CPU units (powers of 2: 256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Fargate task memory in MiB (512–8192)"
  type        = number
  default     = 512
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}
