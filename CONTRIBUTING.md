# Contributing to Astro 5 Enterprise Boilerplate

Thank you for your interest in contributing! This document outlines our contribution process and guidelines.

## Code of Conduct

By participating, you agree to maintain a respectful and inclusive environment. Harassment or discrimination will not be tolerated.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and configure tokens
4. Run tests: `pnpm test`

## Branching Strategy

We use GitFlow:

- **main** - Production-ready code
- **develop** - Integration branch
- **feature/descriptive-name** - New features
- **bugfix/issue-description** - Bug fixes
- **hotfix/critical-issue** - Critical production fixes

## Commit Convention

We follow Conventional Commits to automate SemVer:

- `feat:` - New feature (MINOR bump)
- `fix:` - Bug fix (PATCH bump)
- `docs:` - Documentation only
- `style:` - Code style changes
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**

```bash
git commit -m "feat: add dark mode toggle component"
git commit -m "fix: resolve mobile navigation bar overflow"
git commit -m "docs: update API endpoint documentation"
```

## Pull Request Process

1. Create a feature branch from `develop`
2. Sync with upstream: `git pull upstream develop`
3. Run quality checks:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   ```

4. Push your branch: `git push origin feature/your-feature`
5. Open a PR against `develop` with:
   - Clear title following commit convention
   - Detailed description with screenshots (if UI-related)
   - Link to related issues
   - Checklist confirming tests and docs updated

## Testing Requirements

- All features must include Playwright E2E tests
- Unit tests for utility functions
- Minimum 80% code coverage
- Tests must pass in CI before merge

## Style Guidelines

- Use TypeScript strict mode
- Follow existing component patterns
- Use Tailwind CSS utility classes
- Run Prettier before commit: `pnpm format`
- Audit styles: `node audit-styles.ts`

## Reporting Issues

Use GitHub Issues with template:

- **Bug Report**: Include reproduction steps, environment, expected/actual behavior
- **Feature Request**: Explain use case and proposed solution
- **Performance Issue**: Include Lighthouse scores and profiler data

## Release Process

1. PR from `develop` → `main` triggers release workflow
2. Changesets determine version bump
3. GitHub Release created automatically
4. Vercel deploys from `main`

## Recognition

Contributors are recognized in README.md and release notes.
