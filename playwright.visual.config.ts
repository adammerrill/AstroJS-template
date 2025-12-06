import { defineConfig, devices } from "@playwright/test";

/**
 * @file Visual Regression Testing Configuration
 * @module config/playwright-visual
 * @classification Internal
 * @compliance ISO/IEC 25010 (Product Quality) - Portability & Usability
 * @compliance SOC 2 (Availability) - Change Management & Testing
 * @author Atom Merrill
 * @version 1.0.0
 * * @description
 * Defines the execution environment for automated visual comparison (snapshot) testing.
 * Strictly adheres to the "Offline Mode" architecture to ensure deterministic rendering
 * necessary for pixel-perfect baselines.
 * * @security_control
 * Forces `STORYBLOK_DELIVERY_API_TOKEN` to an empty string to prevent
 * accidental exposure of live content during snapshot generation.
 */
export default defineConfig({
  // Directory containing visual spec files
  testDir: "./tests/visual",

  // Regex to strictly match visual test files
  testMatch: "**/*.spec.ts",

  /**
   * @configuration Execution Strategy
   * @description Rationale: Visual tests are resource-intensive (GPU/CPU for rendering).
   * Running sequentially (workers: 1) prevents "flaky" snapshots caused by 
   * resource contention affecting rendering timing.
   */
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, 

  reporter: [
    ["html"],
    ["list"],
    // JSON artifact for CI/CD audit trails (SOC 2 requirement)
    ["json", { outputFile: "test-results/visual-results.json" }],
  ],

  use: {
    // Targets the dedicated offline server port defined in scripts/start-offline-server.ts
    baseURL: "https://127.0.0.1:4322",
    
    // Diagnostic artifacts for failure root cause analysis
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,

    /**
     * @configuration Determinism Settings
     * Critical for minimizing "false positives" in visual diffs.
     */
    locale: "en-US", 
    timezoneId: "America/Chicago",
    colorScheme: 'light', // Force light mode for consistency
  },

  expect: {
    timeout: 30000,
    toHaveScreenshot: {
      // Disable CSS animations to ensure static capture
      animations: "disabled",
      // ISO 9241-11: Allow minor anti-aliasing differences (human imperceptible)
      maxDiffPixels: 100,
      threshold: 0.1,
    },
  },

  /**
   * @configuration Browser Projects
   * Covers standard desktop and mobile viewports.
   */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 }, 
      },
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],

  /**
   * @configuration Server Orchestration
   * Automatically spins up the application in "Offline Mode" before testing.
   */
  webServer: {
    command: "pnpm run dev:offline",
    url: "https://127.0.0.1:4322",
    reuseExistingServer: false,
    ignoreHTTPSErrors: true,
    timeout: 120000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      // SECURITY: Explicitly revoke API access
      STORYBLOK_DELIVERY_API_TOKEN: "",
    },
  },
});
