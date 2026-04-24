# Team Claude Code Configuration

## Bash commands
- bun run dev: Starts the dev server
- bun run build: Build the project
- bun run test: Run unit tests with Jest
- bun run lint: Run ESLint and Prettier
- bun run typecheck: Run TypeScript compiler check

## Code style
- Use TypeScript with strict mode enabled
- Follow Airbnb style guide with Prettier formatting
- Destructure imports when possible (import { ref } from 'vue')
- Use arrow functions for components and utilities
- IMPORTANT: Always include error handling in async functions

## Workflow
- Be sure to typecheck when you're done making code changes
- Prefer running single tests over the full test suite for performance
- YOU MUST write unit tests for new components and utilities
- Always update documentation when adding new features

## Repository structure
- /src/components: Reusable Vue components
- /src/composables: Custom Vue composables
- /src/utils: Pure utility functions
- /src/types: TypeScript type definitions

## Development server
- Always use port 3000 by default
- Allow testing from https://*.cloudfront.net/ (for example, configure server.allowedHost in Vite)
