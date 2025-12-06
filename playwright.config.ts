import { defineConfig, devices } from "@playwright/test";

/**
 * @file Playwright Configuration (Modernized)
 * @description Native orchestration for Astro 5 + Svelte 5 stack.
 * Replaces custom wrapper scripts with declarative configuration.
 * @see https://playwright.dev/docs/test-webserver
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  // Timeout for individual tests
  timeout: 60_000,

  use: {
    baseURL: "https://localhost:4321",
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    // CRITICAL: Allow self-signed certs for local dev (mkcert)
    ignoreHTTPSErrors: true,
  },

  // NATIVE ORCHESTRATION REPLACES scripts/start-and-test.ts
  webServer: {
    // Use the package.json script directly
    command: "pnpm run dev",
    // Playwright will poll this URL to know when the server is ready
    url: "https://localhost:4321",
    // Reuse local server if running, ensuring fast DX.
    // In CI (CI=true), this is ignored and a fresh server is always started.
    reuseExistingServer: !process.env.CI,
    // CRITICAL: Do NOT leak real API tokens to the test environment
    env: {
      // ❌ DO NOT DO THIS:
      // STORYBLOK_DELIVERY_API_TOKEN: process.env.STORYBLOK_DELIVERY_API_TOKEN
      STORYBLOK_DELIVERY_API_TOKEN: "",
    },
    // CRITICAL: Ensure the orchestrator accepts the self-signed cert during polling
    ignoreHTTPSErrors: true,
    // Give Astro 5 plenty of time to warm up (cold start can be slow)
    timeout: 120 * 1000,
    // Pipe output so we can see server errors in CI logs
    stdout: "pipe",
    // Pipe error output as well
    stderr: "pipe",
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
});
