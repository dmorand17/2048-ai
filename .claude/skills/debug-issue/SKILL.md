---
name: debug-issue
description: This skill should be used when the user asks to "debug", "fix a bug", "investigate an error", "troubleshoot", or reports unexpected behavior. Provides a systematic approach to diagnosing and resolving code issues.
---

Debug the issue: $ARGUMENTS

Follow this systematic approach:
1. Read the error logs and identify the root cause
2. Search the codebase for similar patterns or recent changes
3. Check git history for related commits using `git log --oneline`
4. Reproduce the issue in a minimal test case
5. Implement the fix with proper error handling
6. Write a test to prevent regression
7. Update documentation if the fix changes behavior

Use subagents to verify your solution before implementing.
