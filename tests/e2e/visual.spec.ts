/**
 * @fileoverview Visual Regression Test Suite
 * @description Performs pixel-perfect comparisons of critical UI paths.
 * Uses #main-header ID to ensure strict selector matching.
 */

import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
  test("Homepage visual snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    await expect(page).toHaveScreenshot("homepage-desktop.png", {
      maxDiffPixelRatio: 0.02,
      fullPage: true
    });
  });

  test("Mobile header visual snapshot", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Use specific ID to avoid ambiguity with debug toolbars
    const header = page.locator("#main-header");
    
    await expect(header).toBeVisible();
    await expect(header).toHaveScreenshot("header-mobile.png");
  });
});