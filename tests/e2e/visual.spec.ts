/**
 * @file visual.spec.ts
 * @description Performs pixel-perfect comparisons of critical UI paths using Playwright's visual regression tools.
 * Uses strict selector matching and isolated mocking for deterministic results.
 * * @module tests/e2e/visual.spec
 * * @remark This file adheres to best practices by removing redundant JSDoc type annotations,
 * eliminating TypeScript warnings (ts80004).
 */

import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

/**
 * @group VisualRegression
 * @description Test suite for capturing deterministic visual snapshots of key pages and components.
 */
test.describe("Visual Regression", () => {
  /**
   * @function beforeEach
   * @description Helper to ensure Storyblok global settings are mocked before each navigation.
   * This guarantees Header/Footer fallbacks are triggered consistently, resolving repetitive Storyblok 404 errors.
   */
  test.beforeEach(async ({ page }) => {
    // Apply the mock for global settings BEFORE navigation in all tests.
    // This is crucial for test isolation and deterministic visual results.
    await mockGlobalSettings(page);
  });

  /**
   * @test
   * @name Homepage visual snapshot
   * @description Captures a full-page desktop snapshot of the homepage for visual regression testing.
   */
  test("Homepage visual snapshot", async ({ page }) => {
    await page.goto("/");
    // Wait for all network activity to cease after navigation for a stable DOM state.
    await page.waitForLoadState("networkidle");

    // The 'homepage-desktop.png' snapshot should now reflect the 'MOCK SITE' title
    // or the default fallback data, ensuring consistency without a live CMS connection.
    await expect(page).toHaveScreenshot("homepage-desktop.png", {
      maxDiffPixelRatio: 0.02, // Allow a small tolerance for minor rendering differences.
      fullPage: true,
    });
  });

  /**
   * @test
   * @name Mobile header visual snapshot
   * @description Captures a snapshot of the fixed header on a mobile viewport.
   */
  test("Mobile header visual snapshot", async ({ page }) => {
    // Set a common mobile viewport size (e.g., iPhone 12/13/14) for consistency.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Use specific ID to isolate the header component and avoid ambiguity with toolbars.
    const header = page.locator("#main-header");

    await expect(header).toBeVisible();
    // Capture only the header component, not the full page.
    await expect(header).toHaveScreenshot("header-mobile.png");
  });
});
