// playwright.visual.config.ts
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for visual regression testing.
 *
 * This configuration runs visual snapshot tests in OFFLINE MODE to ensure
 * deterministic content rendering via local fixtures.
 *
 * CRITICAL: Tests MUST run with STORYBLOK_DELIVERY_API_TOKEN unset to force
 * getSafeStory() to use LOCAL_FIXTURES during SSR.
 *
 * Usage:
 * npm run test:e2e:visual
 *
 * First time setup (generate baselines):
 * npx playwright test --config=playwright.visual.config.ts --update-snapshots
 *
 * @see https://playwright.dev/docs/test-snapshots
 */
export default defineConfig({
  testDir: "./tests/e2e",

  // Only run visual regression tests
  testMatch: "**/visual.spec.ts",

  fullyParallel: false, // Run visual tests sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for visual tests to avoid resource contention

  reporter: [
    ["html"],
    ["list"],
    // Add JSON reporter for CI/CD integration
    ["json", { outputFile: "test-results/visual-results.json" }],
  ],

  use: {
    // Use the offline dev server port
    baseURL: "https://127.0.0.1:4322",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,

    // Visual test specific settings
    locale: "en-US", // Ensure consistent text rendering
    timezoneId: "America/Chicago", // Consistent timezone for date formatting
  },

  // Expect timeout for visual assertions
  expect: {
    // Longer timeout for screenshot comparisons
    timeout: 30000,
    toHaveScreenshot: {
      // Animation settling time
      animations: "disabled",
      // Maximum difference threshold
      maxDiffPixels: 100,
    },
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 }, // Standard desktop
      },
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        // Pixel 5 dimensions are already in the device preset
      },
    },
  ],

  // Web server configuration - OFFLINE MODE (no API token)
  webServer: {
    command: "npm run dev:offline",
    url: "https://127.0.0.1:4322",
    reuseExistingServer: false, // Always restart for clean state
    ignoreHTTPSErrors: true,
    timeout: 120000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      // CRITICAL: Ensure API token is NOT set
      // This forces getSafeStory() to use LOCAL_FIXTURES
      STORYBLOK_DELIVERY_API_TOKEN: "",
    },
  },
});
