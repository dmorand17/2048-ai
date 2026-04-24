# EPCC Tracking

---

## 2026-04-24 — Containerize 2048-AI for ECS Deployment

**Source plan**: `EPCC_PLAN.md`

- Two-stage Docker build: `oven/bun:1` builder compiles the Vue/Vite SPA; `nginx:alpine` serves the static `dist/`
- Custom `nginx.conf` with SPA fallback (`try_files`), gzip compression, 1-year cache headers for hashed assets, and `/health` 200 endpoint
- GitHub Actions workflow (`deploy.yml`) authenticates to AWS via OIDC, builds and pushes image to ECR tagged with commit SHA + `latest` on push to `main`
- No runtime env vars — pure static SPA, all config baked at build time
- Pre-requisites: ECR repo created, IAM OIDC role configured, three GitHub repository variables set (`AWS_ACCOUNT_ID`, `AWS_REGION`, `ECR_REPOSITORY`, `OIDC_ROLE_NAME`)
