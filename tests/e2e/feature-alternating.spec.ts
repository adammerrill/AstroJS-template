/**
 * @file feature-alternating.spec.ts
 * @description End-to-End tests for the Feature Alternating component.
 * Validates rendering, zig-zag layout application, and responsiveness.
 *
 * @module tests/e2e/feature-alternating.spec
 * @version 1.1.0
 * * ISO 8601:2004 - Includes global mock setup for reliable Storyblok data.
 */
import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup"; // 🎯 Import the new mocking utility

test.describe("Feature Alternating Component", () => {
  /**
   * Setup: Blocks toolbars and applies global settings mock before each test.
   *
   */
  test.beforeEach(async ({ page, context }) => {
    // --- Configuration: Block known third-party scripts/toolbars for stability ---
    // Storyblok Bridge/Dependencies
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    // Astro Dev Toolbar
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // Apply the mock for global settings
    // This intercepts the Layout's call to fetch 'config/global-settings'
    // and prevents repetitive 404 errors in the test log.
    await mockGlobalSettings(page);
  });

  test("renders correctly on desktop with zig-zag layout", async ({ page }) => {
    /**
     * Test Case: Verifies the component loads and correctly applies CSS classes
     * to implement the alternating (zig-zag) layout pattern on desktop viewports.
     */
    await page.goto("/dev/feature-alternating", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const container = page.getByTestId("feature-alternating");
    await expect(container).toBeVisible();

    // --- Content Verification ---
    await expect(
      page.getByRole("heading", { name: "Core Platform Capabilities" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Server-Side Rendering" }),
    ).toBeVisible();

    // --- Layout Class Verification ---
    // Item 1 (Index 0, Even): Should NOT have row-reverse (lg:flex-row is default)
    const row0 = page.getByTestId("feature-row-0");
    await expect(row0).not.toHaveClass(/lg:flex-row-reverse/);

    // Item 2 (Index 1, Odd): SHOULD have row-reverse
    const row1 = page.getByTestId("feature-row-1");
    await expect(row1).toHaveClass(/lg:flex-row-reverse/);

    // Wait for network idle before screenshot
    await page.waitForLoadState("networkidle");

    // --- Visual Check (Screenshot) ---
    await expect(container).toHaveScreenshot(
      "feature-alternating-desktop.png",
      {
        maxDiffPixelRatio: 0.02,
        timeout: 10000,
      },
    );
  });

  test("stacks vertically on mobile", async ({ page }) => {
    /**
     * Test Case: Verifies the layout correctly collapses to a vertical stack
     * on smaller viewports for optimal responsiveness.
     */
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dev/feature-alternating", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const container = page.getByTestId("feature-alternating");
    await expect(container).toBeVisible();

    // Verify content exists
    await expect(
      page.getByRole("heading", { name: "Edge Network Distribution" }),
    ).toBeVisible();

    await page.waitForLoadState("networkidle");

    // --- Visual Check (Screenshot) ---
    await expect(container).toHaveScreenshot("feature-alternating-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
