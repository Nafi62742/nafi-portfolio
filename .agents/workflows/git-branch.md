---
description: Git workflow — stage and commit changes after completing work
---

# Git Commit Workflow

Run this workflow after completing a task to properly stage and commit your work.

> **Note**: This workflow does NOT push, merge, or create branches automatically. All git operations beyond committing require your explicit approval.

## Steps

// turbo
1. **Check for uncommitted changes** — see what files were modified:
```bash
git status
```

2. **Review the diff** — confirm the changes look correct before staging:
```bash
git diff
```

3. **Stage all changes**:
```bash
git add .
```

4. **Commit with a descriptive message** — you provide the commit message, or confirm a suggested one:
```bash
git commit -m "<descriptive commit message>"
```

Commit message format examples:
- `feat: add testimonials section with EN labels`
- `fix: remove relative imports in project-details component`
- `refactor: add JSDoc to portfolio service methods`
- `style: move inline styles to SCSS in contact component`
- `docs: update workflow files for portfolio project`

## Branch Naming Convention

If you create a new branch manually, use this format: `feature/<short-description>`

Examples:
- `feature/add-testimonials`
- `feature/fix-contact-form`
- `bugfix/project-details-scroll`
- `hotfix/vercel-routing`

## Notes

- Always branch from `dev`, never from `main` or another feature branch
- Use kebab-case for branch names
- Keep branch names short but descriptive
- Pushing and creating pull requests must be done manually by you
