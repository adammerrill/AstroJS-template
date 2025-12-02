// playwright.offline.config.ts
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for offline resilience testing.
 *
 * This configuration is designed to test the application's behavior when
 * the Storyblok API is unavailable (offline mode). It uses a different port
 * (4322) to allow running alongside the normal dev server.
 *
 * Usage:
 * 1. Terminal 1: npm run dev:offline
 * 2. Terminal 2: npm run test:e2e:offline
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",

  // Only run tests that match the offline pattern
  testMatch: "**/offline-resilience.spec.ts",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [["html"], ["list"]],

  use: {
    // Use the offline dev server port
    baseURL: "https://127.0.0.1:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  // Web server configuration - expects the offline dev server to be running
  webServer: {
    command: "npm run dev:offline",
    url: "https://127.0.0.1:4321",
    reuseExistingServer: false, // Always restart to ensure clean state
    ignoreHTTPSErrors: true,
    timeout: 120000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
