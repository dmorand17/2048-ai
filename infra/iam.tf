data "aws_iam_policy_document" "ecs_tasks_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs.amazonaws.com"]
    }
  }
}

# Standard task execution role — allows ECS to pull from ECR and write to CloudWatch Logs
resource "aws_iam_role" "execution" {
  name               = "${local.name_prefix}-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

resource "aws_iam_role_policy_attachment" "execution_policy" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Infrastructure role — allows ECS Express Mode to manage AWS resources on our behalf
# (ALB, target groups, security groups, auto-scaling, SSL/TLS)
#
# NOTE: The exact AWS managed policy for ECS Express Mode infrastructure roles may vary.
# Verify the policy ARN in the AWS console or docs before first apply.
# See infra/README.md for the fallback inline policy if the managed policy is unavailable.
resource "aws_iam_role" "infrastructure" {
  name               = "${local.name_prefix}-infrastructure-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

resource "aws_iam_role_policy_attachment" "infrastructure_policy" {
  role       = aws_iam_role.infrastructure.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonECSInfrastructureRolePolicyForExpressGateway"
}
