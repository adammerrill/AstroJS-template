// tests/e2e/hero-saas.spec.ts
/**
 * @file hero-saas.spec.ts
 * @description End-to-End tests for the Hero SaaS component.
 * Verifies rendering, responsiveness, and interaction patterns.
 *
 * @module tests/e2e/hero-saas.spec
 * @requires Playwright Page, Playwright BrowserContext
 * * ISO 8601:2004 - Includes mock setup to ensure deterministic global settings retrieval,
 * eliminating live API calls and 404 errors during testing.
 */
import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

/**
 * @function test.describe
 * @description Groups tests for the 'Hero SaaS Component'.
 */
test.describe("Hero SaaS Component", () => {
  /**
   * @function test.beforeEach
   * @description Sets up mocking for external services and filters console errors before each test.
   * @param {object} fixtures - Playwright test fixtures.
   * @param {BrowserContext} fixtures.context - The Playwright BrowserContext object.
   */
  test.beforeEach(async ({ page, context }) => {
    // 1. Block Storyblok toolbar to prevent 504 errors and network noise.
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );

    // 2. Block Astro dev toolbar to remove unnecessary network requests.
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // Apply the mock for global settings BEFORE any page navigates.
    // This intercepts the 'config/global-settings' fetch used by Layout.astro,
    // solving the repeated 404 errors in the console log.
    await mockGlobalSettings(page);

    // 3. Filter console/network errors for blocked resources.
    /**
     * @event page.on('console')
     * @description Filters browser console errors, ignoring those related to blocked Storyblok or network failures.
     */
    page.on("console", (msg) => {
      if (
        msg.type() === "error" &&
        !msg.text().includes("storyblok") &&
        !msg.text().includes("ERR_FAILED")
      ) {
        console.error(`[Browser Error]: ${msg.text()}`);
      }
    });

    /**
     * @event page.on('response')
     * @description Filters network response errors (4xx/5xx status codes), ignoring blocked services.
     */
    page.on("response", (response) => {
      if (
        response.status() >= 400 &&
        !response.url().includes("storyblok") &&
        !response.url().includes("__astro_dev_toolbar__")
      ) {
        console.error(
          `[Network Error]: ${response.status()} ${response.url()}`,
        );
      }
    });
  });

  /**
   * @function test
   * @description Tests correct rendering and visual integrity on desktop viewport.
   * @param {object} fixtures - Playwright test fixtures.
   */
  test("renders correctly on desktop", async ({ page }) => {
    // Navigate to the test page with a 30-second timeout for slow CI environments.
    await page.goto("/dev/hero-saas", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // Scope the search to the container by data-testid.
    const hero = page.getByTestId("hero-saas");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Assert the primary heading is visible using its role.
    await expect(
      page.getByRole("heading", { name: /Automate Your Enterprise Workflow/i }),
    ).toBeVisible();

    // Assert the badge is visible, scoped to the hero container.
    await expect(hero.getByText("v2.0 Released")).toBeVisible();

    // Wait for network stability before taking a snapshot.
    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual Snapshot for desktop.
    await expect(hero).toHaveScreenshot("hero-saas-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  /**
   * @function test
   * @description Tests responsiveness and visual integrity on a mobile viewport (375x812).
   * @param {object} fixtures - Playwright test fixtures.
   */
  test("is responsive on mobile", async ({ page }) => {
    // Set the viewport size to simulate a common mobile device.
    await page.setViewportSize({ width: 375, height: 812 });

    // Navigate to the test page.
    await page.goto("/dev/hero-saas", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // Scope the search to the container.
    const hero = page.getByTestId("hero-saas");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Check specific content visible on mobile (e.g., the badge).
    await expect(hero.getByText("v2.0 Released")).toBeVisible();

    // Wait for network stability before taking a snapshot.
    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual Snapshot for mobile.
    await expect(hero).toHaveScreenshot("hero-saas-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
