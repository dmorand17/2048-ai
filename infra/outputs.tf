output "service_url" {
  description = "HTTPS URL(s) provided by ECS Express Mode"
  value       = aws_ecs_express_gateway_service.main.ingress_paths
}

output "service_arn" {
  description = "ARN of the ECS Express Gateway service"
  value       = aws_ecs_express_gateway_service.main.service_arn
}

output "ecr_repository_url" {
  description = "ECR repository URL for pushing images"
  value       = aws_ecr_repository.main.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS Express service name"
  value       = aws_ecs_express_gateway_service.main.service_name
}
