/**
 * @file feature-grid.spec.ts
 * @description End-to-End tests for the Feature Grid component.
 * Validates rendering, layout application, and responsiveness while mocking global dependencies.
 *
 * @module tests/e2e/feature-grid.spec
 * @requires Playwright test, expect, Page, BrowserContext
 * * * ISO 8601:2004 - Implements global settings mock to ensure test isolation and deterministic environment.
 */
import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

/**
 * @name FeatureGridComponent
 * @description Group of tests for the Feature Grid component.
 */
test.describe("Feature Grid Component", () => {
  /**
   * @function beforeEach
   * @description Setup routine for each test.
   * Includes global settings mock, storyblok toolbar blocking, and console error filtering.
   */
  test.beforeEach(async ({ page, context }) => {
    /**
     * This ensures any calls to 'config/global-settings' by Layout.astro
     * are intercepted and return mock data (status 200).
     */
    await mockGlobalSettings(page);

    /**
     * Block unnecessary storyblok toolbars to prevent module load failures and noise.
     */
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );

    /**
     * Block Astro development toolbar for test isolation.
     */
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    /**
     * Filter console errors and log only relevant, non-filtered messages.
     * Ignores known Storyblok and ERR_FAILED noise.
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
  });

  /**
   * @function rendersGridLayoutCorrectlyOnDesktop
   * @description Verifies the grid component renders correctly on standard desktop viewport.
   * Includes content check and visual snapshot verification.
   */
  test("renders grid layout correctly on desktop", async ({ page }) => {
    // Robust Navigation Wait to the component's test route
    await page.goto("/dev/feature-grid", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // Check main container visibility
    const grid = page.getByTestId("feature-grid");
    await expect(grid).toBeVisible({ timeout: 10000 });

    // Check header content visibility
    await expect(
      page.getByRole("heading", { name: "Why Choose Astro Enterprise" }),
    ).toBeVisible();

    // Check key feature items existence
    await expect(
      page.getByRole("heading", { name: "Zero JS Runtime" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Svelte 5 Runes" }),
    ).toBeVisible();

    // Stability Wait to ensure all assets are loaded before snapshot
    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual Snapshot for desktop layout verification
    await expect(grid).toHaveScreenshot("feature-grid-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  /**
   * @function stacksCorrectlyOnMobile
   * @description Verifies the grid component stacks correctly on a mobile viewport.
   * Includes viewport setting, content check, and visual snapshot verification.
   */
  test("stacks correctly on mobile", async ({ page }) => {
    // Set viewport to a common mobile size (iPhone 8/SE dimensions)
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/dev/feature-grid", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const grid = page.getByTestId("feature-grid");
    await expect(grid).toBeVisible({ timeout: 10000 });

    // Verify key content exists on the mobile view
    await expect(
      page.getByRole("heading", { name: "Tailwind v4" }),
    ).toBeVisible();

    // Stability Wait to ensure all assets are loaded before snapshot
    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual Snapshot for mobile layout verification (stacked layout)
    await expect(grid).toHaveScreenshot("feature-grid-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
