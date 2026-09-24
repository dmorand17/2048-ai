# 2048-ai Infrastructure

AWS ECS Express Mode deployment using Terraform.

## Prerequisites

- Terraform >= 1.9
- AWS CLI configured with appropriate credentials
- An S3 bucket and DynamoDB table for Terraform state

## Bootstrap: Create State Backend

Run once before the first `terraform init`:

```bash
# Create the S3 bucket (choose a globally unique name)
aws s3api create-bucket \
  --bucket YOUR_TERRAFORM_STATE_BUCKET \
  --region us-east-1

aws s3api put-bucket-versioning \
  --bucket YOUR_TERRAFORM_STATE_BUCKET \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket YOUR_TERRAFORM_STATE_BUCKET \
  --server-side-encryption-configuration \
    '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

State locking uses S3 native locking (`use_lockfile = true`, requires Terraform >= 1.10) — no DynamoDB table needed.

Then update `YOUR_TERRAFORM_STATE_BUCKET` in `envs/prod/backend.config` and `envs/dev/backend.config`.

## Usage

All commands run from the `infra/` directory.

### Deploy to prod

```bash
terraform init -backend-config=envs/prod/backend.config
terraform plan  -var-file=envs/prod/terraform.tfvars
terraform apply -var-file=envs/prod/terraform.tfvars
```

### Deploy to dev

```bash
terraform init -reconfigure -backend-config=envs/dev/backend.config
terraform plan  -var-file=envs/dev/terraform.tfvars
terraform apply -var-file=envs/dev/terraform.tfvars
```

> Use `-reconfigure` when switching environments to reinitialize the backend.

### Useful outputs

```bash
terraform output service_url          # HTTPS URL(s) from ECS Express
terraform output ecr_repository_url   # Push images here
```

## First Deploy: Bootstrapping the Image

The ECS service references the ECR repo created by Terraform. On the very first deploy:

1. Run `terraform apply` — this creates the ECR repo (the ECS service may fail to start with no image).
2. Build and push an image to the ECR repo:
   ```bash
   ECR_URL=$(terraform output -raw ecr_repository_url)
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$ECR_URL"
   docker build -t "$ECR_URL:latest" .
   docker push "$ECR_URL:latest"
   ```
3. Run `terraform apply` again — the service will now start successfully.

Subsequent deploys are handled automatically by the GitHub Actions workflow.

## IAM: Infrastructure Role

ECS Express Mode requires an **infrastructure role** (`infrastructure_role_arn`) that allows ECS to create and manage AWS resources on your behalf (ALB, target groups, security groups, auto-scaling, SSL/TLS).

`iam.tf` attaches the managed policy `AmazonECSInfrastructureRolePolicyForExpressGateway`.

**If that policy name doesn't exist in your account**, attach this inline policy to the `${env}-infrastructure-role` instead:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticloadbalancing:*",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs",
        "ec2:RevokeSecurityGroupIngress",
        "application-autoscaling:DeregisterScalableTarget",
        "application-autoscaling:DescribeScalableTargets",
        "application-autoscaling:DescribeScalingPolicies",
        "application-autoscaling:PutScalingPolicy",
        "application-autoscaling:RegisterScalableTarget",
        "cloudwatch:DeleteAlarms",
        "cloudwatch:DescribeAlarms",
        "cloudwatch:PutMetricAlarm",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

> **The infrastructure role cannot be changed after the service is created.** Get this right before the first apply, or you'll need to destroy and recreate the service. Apply to `dev` first to verify.

## GitHub Actions: Required Variables

Set these in your GitHub repo → Settings → Variables:

| Variable | Description | Example |
|---|---|---|
| `AWS_ACCOUNT_ID` | Your 12-digit AWS account ID | `123456789012` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `ECR_REPOSITORY` | ECR repo name (matches `app_name-environment`) | `2048-ai-prod` |
| `OIDC_ROLE_NAME` | IAM role name assumed by GitHub Actions | `github-actions-2048-ai` |
| `ECS_CLUSTER` | ECS cluster name | `2048-ai-prod` |
| `ECS_SERVICE` | ECS service name | `2048-ai-prod` |

The OIDC role needs these permissions:
- `AmazonEC2ContainerRegistryPowerUser` (ECR push — existing)
- `ecs:UpdateService`, `ecs:DescribeServices` (ECS redeploy — new)

## ECS Redeploy: CI/CD Notes

The workflow uses `aws ecs update-service --force-new-deployment` to trigger a rolling redeploy after pushing a new image tagged `latest`.

ECS Express Mode services are still ECS services under the hood, so this command is compatible. The service name and cluster name are the outputs of `terraform output ecs_service_name` and `terraform output ecs_cluster_name`.
