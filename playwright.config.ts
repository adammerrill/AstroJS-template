/**
 * @fileoverview Playwright test configuration for end-to-end (E2E) testing.
 * Date (ISO): 2025-11-30
 *
 * Purpose:
 * - Configure Playwright to run reproducible, parallelized E2E tests in CI and locally.
 * - Use localhost with relaxed TLS checks for local self-signed cert development.
 * - Provide pragmatic defaults for reporters, tracing, video/screenshot capture, and server orchestration.
 *
 * Developer notes:
 * - Use the PLAYWRIGHT_TEST env var to enable the built-in webServer orchestration (useful for CI or local dev runs).
 * - When running in CI we restrict workers and enable retries to increase reliability across ephemeral CI environments.
 * - ignoreHTTPSErrors: true is intentionally set for localhost with self-signed certs; DO NOT enable this for remote production endpoints.
 *
 * ASCII and ISO-compliant comments only (no special characters).
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // ====================
  // Core Test Settings
  // ====================
  // Directory where E2E tests live (updated per requested change).
  testDir: "./tests/e2e",

  // Run tests in files in parallel.
  fullyParallel: true,

  // Fail fast on `test.only` in CI.
  forbidOnly: !!process.env.CI,

  // Retries: helpful in flaky CI envs.
  retries: process.env.CI ? 2 : 0,

  // Workers: limit parallelism in CI to improve stability.
  workers: process.env.CI ? 1 : undefined,

  // Per-test timeout. Keep reasonably high for E2E interactions.
  timeout: 120_000,

  // Assertion timeout (expect).
  expect: { timeout: 5_000 },

  // ====================
  // Reporter Settings
  // ====================
  // Use 'html' by default as requested. Teams can override via env/CLI if needed.
  reporter: "html",

  // ====================
  // Shared Test Context (use)
  // ====================
  use: {
    // Run headless by default (CI-friendly). Locally, override with PWDEBUG=1 or --headed if needed.
    headless: true,

    // Typical desktop viewport for deterministic layouts.
    viewport: { width: 1280, height: 800 },

    // No per-action timeout (0) lets complex user flows complete under the test timeout.
    actionTimeout: 0,

    // CRITICAL FIX: prefer 'localhost' domain for local dev cert resolution.
    // Using 'https://localhost:4321' allows browsers to consider the host canonical when using
    // developer self-signed certificates and local host routing. Accept self-signed certs below.
    baseURL: "https://localhost:4321",

    // Accept self-signed certificates for local dev only.
    // Security: Do NOT reuse this setting against remote production endpoints.
    ignoreHTTPSErrors: true,

    // Tracing: enabled on first retry to capture context for flaky failures.
    trace: "on-first-retry",

    // Screenshots and video management to assist debugging failures.
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // ====================
  // Browser Projects
  // ====================
  // Two example targets: Desktop Chrome and a mobile emulation (Pixel 5).
  // Each project also forces context-level TLS acceptance for localhost.
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Force per-context option to accept TLS issues in the browser context.
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
      },
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
      },
    },
  ],

  // ====================
  // Dev Server Orchestration
  // ====================
  // Toggle webServer orchestration with PLAYWRIGHT_TEST. This keeps default behavior
  // unchanged unless explicitly requested (safer for local dev workflows).
  webServer: process.env.PLAYWRIGHT_TEST
    ? {
        // Prefer npm script to align with common project setups (package.json: "dev").
        command: "npm run dev",

        // Ensure we point at localhost (matches baseURL above).
        url: "https://localhost:4321",

        // Wait up to 120s for the server to become available.
        timeout: 120_000,

        // Reuse an existing server unless running in CI.
        reuseExistingServer: !process.env.CI,

        // Accept self-signed certs for the dev server.
        ignoreHTTPSErrors: true,
        stdout: "pipe",
        stderr: "pipe",
      }
    : undefined,
});
