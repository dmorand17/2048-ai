# 2048 AI

A Vue + TypeScript implementation of the 2048 game.

> Inspired by the [Claude Code on Amazon Bedrock](https://catalog.workshops.aws/claude-code-on-amazon-bedrock/en-US) workshop.

---

## Claude Code Setup

This project is configured with skills and plugins for Claude Code to assist with development.

### Project Skills

Custom slash commands defined in `.claude/skills/`:

| Skill | Command | Description |
|---|---|---|
| New Component | `/new-component <name>` | Scaffold a Vue component with TypeScript, tests, and docs |
| Debug Issue | `/debug-issue <description>` | Systematically debug and fix an issue with regression tests |
| Review PR | `/review-pr <ref>` | Review code changes against the team style guide |

### Installed Plugins

| Plugin | Description |
|---|---|
| **[epcc-workflow](https://claudemarketplaces.com/plugins/aws-solutions-library-samples-guidance-for-claude-code-with-amazon-bedrock)** | End-to-end engineering workflow from AWS: Explore → Plan → Code → Commit. Includes agents for business analysis, system design, QA, security review, documentation, and deployment orchestration. |

---

## Development

```bash
bun run dev        # Start dev server (port 3000)
bun run build      # Production build
bun run test       # Run Jest unit tests
bun run lint       # ESLint + Prettier
bun run typecheck  # TypeScript compiler check
```

## Docker

```bash
bun run docker:build                  # Build image locally (tagged 2048-ai)
docker run --rm -p 8080:80 2048-ai   # Run locally at http://localhost:8080
curl localhost:8080/health            # ECS health check endpoint
```

## CI/CD (GitHub Actions → ECR)

The `.github/workflows/deploy.yml` workflow builds and pushes the image to ECR on every push to `main`.

**Prerequisites** — configure these as GitHub repository variables (`Settings → Variables → Actions`):

| Variable | Description | Example |
|---|---|---|
| `AWS_ACCOUNT_ID` | AWS account number | `123456789012` |
| `AWS_REGION` | ECR region | `us-east-1` |
| `ECR_REPOSITORY` | ECR repo name | `2048-ai` |
| `OIDC_ROLE_NAME` | IAM role name for OIDC | `github-actions-2048-ai` |

**One-time AWS setup**:

1. Create the ECR repository:
   ```bash
   aws ecr create-repository --repository-name 2048-ai --region us-east-1
   ```

2. Create an IAM OIDC identity provider for GitHub Actions and an IAM role with the following trust policy:
   ```json
   {
     "Statement": [{
       "Effect": "Allow",
       "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
       "Action": "sts:AssumeRoleWithWebIdentity",
       "Condition": {
         "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
         "StringLike": { "token.actions.githubusercontent.com:sub": "repo:<org>/<repo>:ref:refs/heads/main" }
       }
     }]
   }
   ```
   Attach the `AmazonEC2ContainerRegistryPowerUser` managed policy to the role.

## Project Structure

```
src/
  components/   # Reusable Vue components
  composables/  # Custom Vue composables
  utils/        # Pure utility functions
  types/        # TypeScript type definitions
```
