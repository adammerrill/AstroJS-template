/**
 * @file storyblok-image.spec.ts
 * @description E2E verification of Image Component DOM output.
 * @module tests/e2e/storyblok-image
 */

import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

test.describe("Storyblok Image Component", () => {
  test.beforeEach(async ({ page }) => {
    await mockGlobalSettings(page);
  });

  test("renders correctly on the Logo Cloud (Real usage)", async ({ page }) => {
    // Navigate to the Logo Cloud dev page which uses the image component
    await page.goto("/dev/logo-cloud", { waitUntil: "domcontentloaded" });

    const firstLogo = page.locator('[data-testid="logo-cloud"] img').first();
    
    await expect(firstLogo).toBeVisible();

    // Verify Lazy Loading default
    await expect(firstLogo).toHaveAttribute("loading", "lazy");
    
    // Verify decoding async
    await expect(firstLogo).toHaveAttribute("decoding", "async");

    // Verify Object Fit class application
    await expect(firstLogo).toHaveClass(/object-contain/);
  });
});
