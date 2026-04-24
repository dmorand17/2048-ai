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

## Project Structure

```
src/
  components/   # Reusable Vue components
  composables/  # Custom Vue composables
  utils/        # Pure utility functions
  types/        # TypeScript type definitions
```
