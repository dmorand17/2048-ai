resource "aws_ecs_cluster" "main" {
  name = local.name_prefix

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = local.name_prefix
  }
}

resource "aws_ecs_express_gateway_service" "main" {
  service_name            = local.name_prefix
  cluster                 = aws_ecs_cluster.main.name
  execution_role_arn      = aws_iam_role.execution.arn
  infrastructure_role_arn = aws_iam_role.infrastructure.arn
  cpu                     = var.cpu
  memory                  = var.memory
  health_check_path       = "/health"
  wait_for_steady_state   = true

  primary_container {
    image          = "${aws_ecr_repository.main.repository_url}:${var.image_tag}"
    container_port = 80

    aws_logs_configuration {
      log_group          = aws_cloudwatch_log_group.ecs.name
      log_stream_prefix  = "ecs"
    }
  }

  network_configuration {
    subnets = aws_subnet.public[*].id
  }
}
