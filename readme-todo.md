# README.md Completion Implementation Plan

## Overview

This document provides a phased approach to completing all placeholder content in the README.md. Each phase builds upon the previous one, allowing for systematic improvement and validation.

---

## 🎯 Phase 1: Foundational Metrics & CI/CD (Week 1)

**Goal**: Establish baseline performance metrics and automated quality checks.

### Task 1.1: GitHub Actions CI Badge

**Placeholder Location**: Line 9
```markdown
![Build Status](https://img.shields.io/github/actions/workflow/status/adammerrill/AstroJS-template/ci.yml?branch=main)
<!-- TODO: Add actual CI workflow badge once GitHub Actions is configured -->
```

**Required Information**:
- GitHub Actions workflow file name
- Repository owner and name
- Branch to track (main/develop)

**Implementation Steps**:
1. Create `.github/workflows/ci.yml` file
2. Configure workflow with:
   ```yaml
   name: CI
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - run: pnpm install
         - run: pnpm lint
         - run: pnpm typecheck
         - run: pnpm test
   ```
3. Push workflow and verify it runs
4. Update badge URL with actual workflow filename
5. Remove TODO comment

**Validation**: Badge should show "passing" status after successful workflow run.

---

### Task 1.2: Performance Metrics & Lighthouse Scores

**Placeholder Location**: Lines 35-41
```markdown
## 📊 Performance Metrics

<!-- TODO: Add Lighthouse scores screenshot -->
<!-- TODO: Add Core Web Vitals benchmarks -->
<!-- TODO: Add bundle size analysis -->
```

**Required Information**:
- Lighthouse audit results (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals metrics (LCP, FID, CLS)
- Production bundle sizes (JavaScript, CSS, total)
- Comparison with industry benchmarks

**Implementation Steps**:

**Step 1: Run Lighthouse Audit**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit on local build
pnpm build
pnpm preview
lighthouse http://localhost:4321 --output=html --output-path=./lighthouse-report.html
```

**Step 2: Capture Scores**
- Open `lighthouse-report.html`
- Take screenshot of score summary (top section)
- Record individual scores:
  - Performance: __/100
  - Accessibility: __/100
  - Best Practices: __/100
  - SEO: __/100

**Step 3: Extract Core Web Vitals**
From the Lighthouse report, document:
- **LCP (Largest Contentful Paint)**: __ seconds
- **TBT (Total Blocking Time)**: __ ms
- **CLS (Cumulative Layout Shift)**: __

**Step 4: Analyze Bundle Size**
```bash
# Build for production
pnpm build

# Check dist folder sizes
du -sh dist/
du -sh dist/_astro/

# For detailed analysis, add this to package.json:
"scripts": {
  "analyze": "astro build --verbose"
}
```

Record:
- Total dist size: __ MB
- JavaScript bundle: __ KB
- CSS bundle: __ KB
- Images/assets: __ MB

**Step 5: Create Performance Section**
Save screenshot to `public/docs/lighthouse-scores.png` and update README:

```markdown
## 📊 Performance Metrics

![Lighthouse Scores](./public/docs/lighthouse-scores.png)

### Current Benchmarks (as of [DATE])

| Metric | Score | Status |
|--------|-------|--------|
| Performance | 95/100 | ✅ Excellent |
| Accessibility | 98/100 | ✅ Excellent |
| Best Practices | 100/100 | ✅ Perfect |
| SEO | 100/100 | ✅ Perfect |

### Core Web Vitals

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP (Largest Contentful Paint) | 1.1s | < 2.5s | ✅ Good |
| TBT (Total Blocking Time) | 120ms | < 300ms | ✅ Good |
| CLS (Cumulative Layout Shift) | 0.02 | < 0.1 | ✅ Good |

### Bundle Analysis

- **Total Bundle Size**: 185KB (gzipped)
- **JavaScript**: 95KB (gzipped)
- **CSS**: 12KB (gzipped)
- **Initial Page Load**: < 1.2s on 3G

*Benchmarks measured on [Vercel production deployment / local build] using Lighthouse 11.x*
```

**Validation**: Run Lighthouse again after any major changes to verify consistency.

---

### Task 1.3: Test Coverage Statistics

**Placeholder Location**: Lines 315-320
```markdown
### Test Coverage

<!-- TODO: Add test coverage statistics -->
<!-- TODO: Document testing patterns and best practices -->
```

**Required Information**:
- Line coverage percentage
- Branch coverage percentage
- Function coverage percentage
- Uncovered files/areas
- Coverage by test type (unit, integration, e2e)

**Implementation Steps**:

**Step 1: Install Coverage Tools**
```bash
pnpm add -D @playwright/test nyc c8
```

**Step 2: Configure Playwright Coverage**
Update `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    trace: 'on-first-retry',
    // Enable coverage collection
    screenshot: 'only-on-failure',
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
});
```

**Step 3: Run Tests with Coverage**
```bash
# Run tests
pnpm test

# Generate coverage report (if using c8)
pnpm c8 report --reporter=html --reporter=text
```

**Step 4: Document Coverage**
Open `coverage/index.html` and record:
- Statements: ___%
- Branches: ___%
- Functions: ___%
- Lines: ___%

**Step 5: Update README**
```markdown
### Test Coverage

| Type | Coverage | Target | Status |
|------|----------|--------|--------|
| Statements | 85% | > 80% | ✅ |
| Branches | 78% | > 75% | ✅ |
| Functions | 82% | > 80% | ✅ |
| Lines | 86% | > 80% | ✅ |

### Coverage by Area

- **Components**: 92% - Comprehensive Svelte component testing
- **Pages**: 88% - All major routes covered
- **Utilities**: 95% - Full unit test coverage
- **Storyblok Integration**: 75% - Core functionality tested

### Test Suite Breakdown

- **E2E Tests**: 24 tests across 8 spec files
- **Component Tests**: 45 tests for UI components
- **Integration Tests**: 12 tests for API/CMS integration
- **Total Test Execution Time**: ~45 seconds

*Run `pnpm test` to generate the latest coverage report in `coverage/index.html`*
```

**Validation**: Coverage reports should be reproducible and consistent across environments.

---

## 🏗️ Phase 2: Documentation & Guides (Week 2)

**Goal**: Create comprehensive supporting documentation for developers.

### Task 2.1: Testing Guide

**Placeholder Location**: Line 356
```markdown
See our [Testing Guide](./docs/TESTING.md) for detailed documentation.
<!-- TODO: Create comprehensive testing guide -->
```

**Required Information**:
- Testing philosophy and approach
- How to write new tests
- Test organization patterns
- Mocking strategies
- Debugging techniques
- CI integration details

**Implementation Steps**:

**Step 1: Create Documentation Structure**
```bash
mkdir -p docs
touch docs/TESTING.md
```

**Step 2: Gather Testing Information**
Document the following from your current setup:
- Playwright configuration options
- Test file naming conventions
- Fixture usage patterns
- Page Object Model (if used)
- Common test utilities
- Environment setup for tests

**Step 3: Create TESTING.md Content**
Structure the guide with these sections:

```markdown
# Testing Guide

## Overview
[Brief description of testing philosophy]

## Getting Started
### Running Tests
[Commands and options]

### Writing Your First Test
[Step-by-step example]

## Test Organization
### File Structure
[Explain tests/ directory layout]

### Naming Conventions
[Test file naming patterns]

## Testing Patterns
### Page Object Model
[Examples if applicable]

### Component Testing
[How to test Svelte components]

### API/Integration Testing
[Storyblok integration tests]

## Debugging
### Debug Mode
[How to use Playwright debug features]

### Common Issues
[Troubleshooting section]

## CI Integration
[How tests run in GitHub Actions]

## Best Practices
[List of testing best practices]
```

**Step 4: Extract Examples from Existing Tests**
```bash
# Find all test files
find tests/ -name "*.spec.ts"

# Review each test for examples to document
```

Copy actual code examples from your test suite into the guide.

**Step 5: Update README Link**
Remove TODO comment and verify link works.

**Validation**: Ask a team member to follow the guide and write a new test.

---

### Task 2.2: Architecture Decision Records (ADR)

**Placeholder Location**: Line 587
```markdown
- [Architecture Decision Records](./docs/ADR.md) <!-- TODO: Create ADR documentation -->
```

**Required Information**:
- Why Astro was chosen
- Why Svelte 5 over React/Vue
- Why Tailwind v4
- Why Storyblok as CMS
- Why pnpm over npm/yarn
- Deployment platform decision
- Testing framework choice

**Implementation Steps**:

**Step 1: Create ADR Template**
```bash
touch docs/ADR.md
```

**Step 2: Document Each Decision**
For each architectural choice, document:
1. **Context**: What problem were we solving?
2. **Decision**: What did we choose?
3. **Rationale**: Why did we choose it?
4. **Consequences**: What are the trade-offs?
5. **Alternatives Considered**: What else did we evaluate?

**Step 3: Create ADR.md Structure**
```markdown
# Architecture Decision Records

## ADR-001: Web Framework Selection (Astro 5)

**Date**: 2025-01-15

**Context**: 
Needed a framework optimized for content-heavy sites with excellent performance...

**Decision**: 
Chose Astro 5 as the primary web framework.

**Rationale**:
- Zero JavaScript by default
- Island architecture for selective hydration
- Framework-agnostic (can use Svelte, React, Vue)
- Excellent build times
- Native TypeScript support

**Consequences**:
- (+) Superior performance metrics
- (+) Smaller bundle sizes
- (-) Learning curve for team
- (-) Smaller ecosystem compared to Next.js

**Alternatives Considered**:
- Next.js 14: More mature, but heavier runtime
- SvelteKit: Great, but less flexible for mixed frameworks
- Remix: Good SSR, but more complex routing

---

## ADR-002: UI Framework Selection (Svelte 5)
[Continue pattern...]
```

**Step 4: Interview Decision Makers**
If you weren't involved in initial decisions:
- Review commit history for initial framework choices
- Check project planning documents
- Interview team lead or architect
- Review any RFCs or proposal documents

**Step 5: Keep ADRs Updated**
Create a process for adding new ADRs:
```markdown
## How to Add New ADRs

1. Copy the template above
2. Increment the ADR number
3. Fill in all sections
4. Create a PR for team review
5. Merge after approval
```

**Validation**: Each major architectural component should have a documented decision.

---

### Task 2.3: Component Documentation

**Placeholder Location**: Line 588
```markdown
- [Component Documentation](./docs/COMPONENTS.md) <!-- TODO: Create component docs -->
```

**Required Information**:
- List of all UI components
- Component props and types
- Usage examples
- Styling guidelines
- Accessibility features
- Storyblok component mapping

**Implementation Steps**:

**Step 1: Inventory Components**
```bash
# List all components
find src/components -name "*.astro" -o -name "*.svelte"
find src/storyblok -name "*.svelte"
```

Create a spreadsheet or document listing:
- Component name
- File location
- Purpose
- Props (with types)
- Dependencies

**Step 2: Document Each Component Category**

Create `docs/COMPONENTS.md`:

```markdown
# Component Documentation

## Overview
This document catalogs all reusable components in the application.

## Component Categories

### UI Components (`src/components/ui/`)
Shadcn-based primitive components.

#### Button
**Location**: `src/components/ui/Button.svelte`

**Purpose**: Primary interactive element for user actions.

**Props**:
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
```

**Usage**:
```svelte
<Button variant="default" size="md" on:click={handleClick}>
  Click Me
</Button>
```

**Accessibility**: Includes proper ARIA attributes, keyboard navigation support.

---

[Continue for each component...]
```

**Step 3: Extract Prop Types**
```bash
# For TypeScript/Svelte components
# Review each file and extract interface definitions

# Example extraction script
grep -r "interface.*Props" src/components/
```

**Step 4: Create Usage Examples**
For each component:
1. Copy from actual usage in pages
2. Create minimal working example
3. Show different variants/props
4. Include accessibility considerations

**Step 5: Document Storyblok Mappings**
```markdown
## Storyblok Component Mapping

| Storyblok Block | Svelte Component | Location |
|----------------|------------------|----------|
| `hero_section` | `HeroSection.svelte` | `src/storyblok/` |
| `feature_grid` | `FeatureGrid.svelte` | `src/storyblok/` |
| `cta_banner` | `CtaBanner.svelte` | `src/storyblok/` |

### Creating New Mappings

1. Create Svelte component in `src/storyblok/`
2. Name using PascalCase matching Storyblok snake_case
3. Register in `astro.config.mjs`:
   ```javascript
   storyblok({
     components: {
       hero_section: 'storyblok/HeroSection',
     }
   })
   ```
```

**Step 6: Add Component Screenshots**
```bash
mkdir -p docs/assets/components
```

For visual components, capture screenshots:
```bash
# Use Playwright to capture component screenshots
# Or manually screenshot from Storybook/dev server
```

**Validation**: Every component in `src/components/` should have documentation entry.

---

### Task 2.4: API Documentation

**Placeholder Location**: Line 589
```markdown
- [API Documentation](./docs/API.md) <!-- TODO: Create API docs -->
```

**Required Information**:
- Storyblok API endpoints used
- Custom API routes (if any)
- Environment variables required
- Rate limits and quotas
- Error handling patterns
- Authentication flow

**Implementation Steps**:

**Step 1: Audit API Usage**
```bash
# Find all API calls in codebase
grep -r "fetch(" src/
grep -r "storyblok" src/
grep -r "api.storyblok.com" src/
```

Document each API interaction:
- Endpoint URL
- HTTP method
- Required parameters
- Response format
- Error responses

**Step 2: Create API.md Structure**
```markdown
# API Documentation

## Storyblok API Integration

### Authentication
All requests require the `STORYBLOK_TOKEN` environment variable.

**Token Types**:
- **Preview Token**: Used for draft content in development
- **Public Token**: Used for published content in production

### Base Configuration
```typescript
const storyblokApi = useStoryblokApi({
  accessToken: import.meta.env.STORYBLOK_TOKEN,
  use: [apiPlugin],
});
```

### Endpoints Used

#### 1. Get Story by Slug
**Endpoint**: `GET /v2/cdn/stories/{slug}`

**Purpose**: Fetch a single story/page by its slug.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Story slug or path |
| `version` | string | No | `draft` or `published` |
| `cv` | timestamp | No | Cache version |

**Example Request**:
```typescript
const story = await storyblokApi.get(`cdn/stories/${slug}`, {
  version: 'draft',
});
```

**Response**:
```json
{
  "story": {
    "id": 12345,
    "uuid": "abc-123",
    "slug": "home",
    "content": { ... },
    "published_at": "2025-01-15T10:00:00.000Z"
  }
}
```

**Error Responses**:
- `404`: Story not found
- `401`: Invalid token
- `429`: Rate limit exceeded

---

[Continue for each endpoint...]
```

**Step 3: Document Rate Limits**
Research Storyblok documentation:
- Requests per hour/day limits
- Caching recommendations
- CDN usage vs. Management API

```markdown
### Rate Limits & Best Practices

**CDN API (Content Delivery)**:
- No strict rate limits
- Cached at CDN edge
- Use for production reads

**Management API**:
- Rate limited based on plan
- Use sparingly
- Implement exponential backoff

**Caching Strategy**:
```typescript
// Cache stories for 1 hour
const cacheVersion = Math.floor(Date.now() / (1000 * 60 * 60));
```

**Step 4: Document Custom Endpoints**
If you have custom API routes:

```markdown
## Custom API Routes

### POST /api/contact
**Purpose**: Handle contact form submissions.

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Form submitted successfully"
}
```
```

**Step 5: Add Environment Variables Reference**
```markdown
## Environment Variables

### Required

| Variable | Purpose | Example | Where to Get |
|----------|---------|---------|--------------|
| `STORYBLOK_TOKEN` | CMS API access | `abc123...` | Storyblok Dashboard → Settings → Access Tokens |
| `SITE_URL` | Base URL for sitemap | `https://example.com` | Your domain |

### Optional

| Variable | Purpose | Default |
|----------|---------|---------|
| `STORYBLOK_VERSION` | Content version | `published` |
```

**Validation**: Try following the API docs to make a new API call without referring to existing code.

---

### Task 2.5: Deployment Guide

**Placeholder Location**: Line 590
```markdown
- [Deployment Guide](./docs/DEPLOYMENT.md) <!-- TODO: Create deployment guide -->
```

**Required Information**:
- Step-by-step Vercel deployment
- Alternative platform instructions
- Environment variable setup
- Domain configuration
- SSL/TLS setup
- Monitoring and alerts
- Rollback procedures

**Implementation Steps**:

**Step 1: Document Current Deployment**
If already deployed:
- Screenshot your Vercel dashboard
- Note all configuration settings
- Document build commands
- List environment variables
- Capture deployment logs

**Step 2: Create DEPLOYMENT.md**

```markdown
# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Storyblok preview/public token

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/adammerrill/AstroJS-template)

### Manual Deployment

#### Step 1: Prepare Repository
```bash
# Ensure code is pushed to GitHub
git push origin main
```

#### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

#### Step 3: Configure Project
Vercel will auto-detect Astro. Verify these settings:

**Build Settings**:
- Framework Preset: `Astro`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

**Root Directory**: `./` (leave blank)

#### Step 4: Add Environment Variables
Click "Environment Variables" and add:

| Name | Value | Note |
|------|-------|------|
| `STORYBLOK_TOKEN` | `your_token_here` | Get from Storyblok Settings |
| `SITE_URL` | `https://your-domain.vercel.app` | Auto-populated after first deploy |
| `NODE_VERSION` | `20` | Ensures Node 20+ |

#### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Visit your deployment URL

#### Step 6: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your domain: `example.com`
3. Configure DNS records as shown:
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
4. Wait for DNS propagation (up to 48 hours)

---

## Deploy to Netlify

### Prerequisites
- Netlify account
- GitHub repository

### Steps

#### 1. Install Netlify Adapter
```bash
pnpm add @astrojs/netlify
```

#### 2. Update astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
});
```

#### 3. Deploy via Netlify Dashboard
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select repository
5. Configure:
   - Build command: `pnpm build`
   - Publish directory: `dist`
6. Add environment variables
7. Click "Deploy site"

---

## Deploy to Cloudflare Pages

### Prerequisites
- Cloudflare account
- Wrangler CLI installed

### Steps

#### 1. Install Cloudflare Adapter
```bash
pnpm add @astrojs/cloudflare
```

#### 2. Update Configuration
```javascript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
```

#### 3. Deploy via Wrangler
```bash
# Login to Cloudflare
npx wrangler login

# Deploy
pnpm build
npx wrangler pages publish dist
```

---

## Environment Variables per Environment

### Development
```bash
# .env.local (not committed)
STORYBLOK_TOKEN=preview_token_here
SITE_URL=http://localhost:4321
```

### Staging
Set in your platform dashboard:
```
STORYBLOK_TOKEN=preview_token_here
SITE_URL=https://staging.example.com
```

### Production
```
STORYBLOK_TOKEN=public_token_here
SITE_URL=https://example.com
```

---

## Post-Deployment Checklist

- [ ] Verify home page loads
- [ ] Test dynamic routes
- [ ] Check Storyblok Visual Editor connection
- [ ] Test contact forms (if applicable)
- [ ] Verify analytics tracking
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Check console for errors
- [ ] Verify sitemap: `/sitemap-index.xml`
- [ ] Test 404 page

---

## Monitoring & Alerts

### Vercel Analytics
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. View real-time metrics

### Error Tracking with Sentry (Optional)
```bash
pnpm add @sentry/astro
```

```javascript
// astro.config.mjs
import sentry from '@sentry/astro';

export default defineConfig({
  integrations: [
    sentry({
      dsn: process.env.SENTRY_DSN,
    }),
  ],
});
```

---

## Rollback Procedures

### Vercel Rollback
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." menu
4. Select "Promote to Production"

### Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

---

## Troubleshooting

### Build Fails
- Check build logs in deployment platform
- Verify all environment variables are set
- Ensure Node version is 20+
- Check for missing dependencies

### 404 on Dynamic Routes
- Verify `output: 'server'` in astro.config.mjs
- Check adapter is configured correctly
- Ensure [...slug].astro exists

### Storyblok Content Not Loading
- Verify STORYBLOK_TOKEN is set correctly
- Check token has correct permissions
- Ensure using preview token in staging, public in production
```

**Step 3: Test Deployment Process**
Actually go through deployment on a test account:
1. Create fresh Vercel project
2. Follow your documentation
3. Note any missing steps
4. Update guide accordingly

**Step 4: Add Platform Comparison**
```markdown
## Platform Comparison

| Feature | Vercel | Netlify | Cloudflare |
|---------|--------|---------|------------|
| Build time | Fast | Fast | Fastest |
| Free tier | Generous | Generous | Generous |
| Edge functions | ✅ | ✅ | ✅ |
| Analytics | Built-in | Add-on | Built-in |
| DDoS protection | ✅ | ✅ | ✅ |
| Custom domains | Unlimited | 1 free | Unlimited |
| Best for | Astro/SSR | Static sites | Global apps |
```

**Validation**: Have someone deploy the project following only the guide.

---

### Task 2.6: Troubleshooting Guide

**Placeholder Location**: Line 591
```markdown
- [Troubleshooting](./docs/TROUBLESHOOTING.md) <!-- TODO: Create troubleshooting guide -->
```

**Required Information**:
- Common error messages
- Solutions to frequent issues
- Debugging techniques
- Known limitations
- Platform-specific issues

**Implementation Steps**:

**Step 1: Collect Common Issues**
Methods to gather:
1. Review GitHub Issues (current and closed)
2. Check Discord/Slack support channels
3. Review your own debugging history
4. Ask team for frequent problems
5. Monitor error logs from production

**Step 2: Create TROUBLESHOOTING.md**

```markdown
# Troubleshooting Guide

## Common Issues & Solutions

### Build & Development Issues

#### Issue: `pnpm install` fails with EACCES error
**Symptoms**:
```
Error: EACCES: permission denied
```

**Cause**: npm global folder permissions issue

**Solution**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm which handles permissions better
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

---

#### Issue: Port 4321 already in use
**Symptoms**:
```
Error: listen EADDRINUSE: address already in use :::4321
```

**Cause**: Another process is using port 4321

**Solution**:
```bash
# Find process using port
lsof -i :4321

# Kill the process
kill -9 <PID>

# Or use a different port
pnpm dev -- --port 3000
```

---

#### Issue: Astro dev server crashes on save
**Symptoms**: Server restarts or crashes when editing files

**Cause**: File watchers limit reached

**Solution**:
```bash
# Increase file watcher limit (Linux/Mac)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# For Mac, install watchman
brew install watchman
```

---

### Storyblok Integration Issues

#### Issue: "Invalid access token" error
**Symptoms**:
```
Error: You provided an invalid access token
```

**Cause**: Wrong token or token not set

**Solution**:
1. Verify token in `.env`:
   ```bash
   cat .env | grep STORYBLOK_TOKEN
   ```
2. Ensure no extra spaces or quotes
3. Check token type (preview vs. public)
4. Regenerate token if needed:
   - Go to Storyblok Dashboard
   - Settings → Access Tokens
   - Create new token
   - Update `.env` file

---

#### Issue: Content not updating in Visual Editor
**Symptoms**: Changes in Storyblok don't reflect immediately

**Cause**: Caching or preview URL misconfigured

**Solution**:
1. Clear browser cache
2. Verify preview URL in Storyblok:
   - Settings → Visual Editor
   - Should be: `http://localhost:4321`
3. Check token version:
   ```typescript
   // Use preview token, not public
   version: 'draft'
   ```
4. Disable cache during development:
   ```typescript
   cv: Date.now() // Bust cache
   ```

---

### TypeScript Issues

#### Issue: Type errors in Svelte files
**Symptoms**:
```
Cannot find name 'props'
```

**Cause**: TypeScript not recognizing Svelte 5 runes

**Solution**:
1. Update `tsconfig.json`:
   ```json
   {
     "extends": "astro/tsconfigs/strict",
     "compilerOptions": {
       "types": ["svelte"]
     }
   }
   ```
2. Restart TypeScript server in VS Code:
   - Cmd/Ctrl + Shift + P
   - "TypeScript: Restart TS Server"

---

#### Issue: Module not found errors
**Symptoms**:
```
Cannot find module '@/components/ui/button'
```

**Cause**: Path alias not configured

**Solution**:
Check `tsconfig.json` has paths:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

### Testing Issues

#### Issue: Playwright tests timeout
**Symptoms**:
```
Test timeout of 30000ms exceeded
```

**Cause**: Server not starting or page not loading

**Solution**:
1. Increase timeout in `playwright.config.ts`:
   ```typescript
   timeout: 60000
   ```
2. Ensure dev server is running:
   ```bash
   pnpm dev
   # In another terminal:
   pnpm test:e2e
   ```