# Offline Resilience Testing

This document explains how to test the application's offline resilience features.

## Overview

The offline resilience test suite (`offline-resilience.spec.ts`) verifies that the application gracefully handles scenarios where the Storyblok CMS API is unavailable by falling back to local fixture data.

## Why a Separate Configuration?

Playwright's route interception only works for **client-side requests** made by the browser. However, in SSR (Server-Side Rendering) mode, the Astro server makes API calls directly from Node.js, which bypass browser-level route blocks.

To properly test offline mode, we need to start the dev server **without** the `STORYBLOK_DELIVERY_API_TOKEN` environment variable.

## Running Offline Tests

### Automatic Method (Recommended)

The easiest way to run offline tests is using the provided npm script:

```bash
npm run test:e2e:offline
```

This command:

1. Automatically starts the dev server in offline mode (port 4322)
2. Runs only the offline resilience tests
3. Shuts down the server when tests complete

### Manual Method

If you prefer more control:

**Terminal 1 - Start offline dev server:**

```bash
npm run dev:offline
```

**Terminal 2 - Run tests:**

```bash
npx playwright test tests/e2e/offline-resilience.spec.ts --config=playwright.offline.config.ts
```

## Configuration Details

### Port Separation

- **Normal dev server:** `https://localhost:4321` (with API token)
- **Offline dev server:** `https://localhost:4322` (without API token)

This allows both servers to run simultaneously if needed.

### Environment Variables

The offline server is started with:

```bash
STORYBLOK_DELIVERY_API_TOKEN= npm run dev
```

The empty value forces the `getSafeStory()` function into offline mode, serving local fixtures instead of making API calls.

## Test Scenarios

### 1. Home Page with Fixture Data

Verifies that the home page (`/`) loads successfully using fixture data when no API token is available.

**Expected behavior:**

- Page loads without errors
- Shows "Deterministic QA" headline from fixture
- Displays 3 feature cards with fixture content
- No API calls are made

### 2. Unknown Route Fallback

Tests that non-existent routes fall back to the home fixture instead of showing a 404.

**Expected behavior:**

- `/random-missing-page` loads successfully
- Shows home fixture content
- Same behavior as home route

### 3. Navigation Consistency

Ensures fixture data remains consistent across multiple page navigations.

**Expected behavior:**

- Multiple navigations maintain fixture data
- No memory leaks or state corruption
- Consistent user experience

## Fixture Data Location

```
tests/fixtures/storyblok-home.json
```

This fixture is automatically loaded when the API token is missing. To update the fixture content:

1. Edit the JSON file
2. Ensure the structure matches your component expectations
3. Run tests to verify

## Troubleshooting

### Tests still calling live API

**Problem:** Test logs show `[getSafeStory] API SUCCESS`

**Solution:** Make sure you're using the offline configuration:

```bash
npm run test:e2e:offline
```

Not the regular test command.

### Port already in use

**Problem:** Error: `EADDRINUSE: address already in use :::4322`

**Solution:**

1. Stop any running dev:offline servers
2. Check for orphaned processes: `lsof -i :4322`
3. Kill if needed: `kill -9 <PID>`

### Fixture not found

**Problem:** Error: `Cannot find module '../../tests/fixtures/storyblok-home.json'`

**Solution:** Verify the fixture file exists at the correct path relative to `src/lib/storyblok.ts`

## CI/CD Integration

For continuous integration, add this to your workflow:

```yaml
- name: Run Offline Resilience Tests
  run: npm run test:e2e:offline
```

The tests will automatically start the offline server, run the tests, and clean up.

## Adding New Fixtures

To add fixtures for additional pages:

1. Create a new JSON file in `tests/fixtures/`
2. Update the `LOCAL_FIXTURES` registry in `src/lib/storyblok.ts`:

```typescript
const LOCAL_FIXTURES: Record<string, ISbStoryData<any>> = {
  home: homeFixture.story as unknown as ISbStoryData<any>,
  about: aboutFixture.story as unknown as ISbStoryData<any>, // Add new fixture
};
```

3. Add test cases in `offline-resilience.spec.ts`

## Related Files

- `playwright.offline.config.ts` - Playwright configuration for offline tests
- `src/lib/storyblok.ts` - Contains `getSafeStory()` with fallback logic
- `tests/fixtures/storyblok-home.json` - Home page fixture data
- `src/pages/[...slug].astro` - Route handler that uses `getSafeStory()`
