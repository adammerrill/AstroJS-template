/**
 * @fileoverview Playwright test configuration for end-to-end testing.
 *
 * Defines test execution parameters, browser targets, and CI integration.
 * Ensures reproducible, parallelized, and multi-browser E2E tests.
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // ====================
  // Core Test Settings
  // ====================
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 120_000,
  expect: { timeout: 5000 },

  // ====================
  // Reporter Settings
  // ====================
  reporter: [
    [process.env.CI ? "github" : "html"],
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "playwright-results.json" }],
  ],

  // ====================
  // Shared Test Context
  // ====================
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 0,
    baseURL: "https://127.0.0.1:4321",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // ====================
  // Browser Projects
  // ====================
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],

  // ====================
  // Dev Server Orchestration
  // ====================
  webServer: process.env.SKIP_PW_SERVER ? undefined : {
    command: "pnpm dev -- --host 127.0.0.1 --port 4321",
    url: "https://127.0.0.1:4321",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
  },
});
