/**
 * @file logo-cloud.spec.ts
 * @description E2E tests for LogoCloud component.
 * @version 2.0.0
 *
 * @iso_compliance
 * - ISO/IEC 29119-4:2015 - Test Techniques (Component Testing)
 *
 * @changes
 * - Updated assertions to verify `<img>` rendering instead of text fallbacks.
 * - Added attribute verification for lazy loading compliance.
 */
import { test, expect, type Page } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

test.describe("Logo Cloud Component", () => {
  /**
   * Setup: Block third-party scripts and mock global settings.
   */
  test.beforeEach(async ({ page, context }) => {
    // Block toolbars and dev tools to ensure clean snapshots
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // Mock Global Settings to prevent 404s in Layout
    await mockGlobalSettings(page);
  });

  /**
   * @test Desktop Rendering
   * Verifies the component renders images correctly on large screens.
   */
  test("renders correctly on desktop", async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    await page.goto("/dev/logo-cloud", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const cloud = page.getByTestId("logo-cloud");
    await expect(cloud).toBeVisible();

    // Check headline text visibility
    await expect(page.getByText("Powering Next-Gen Companies")).toBeVisible();

    // FIX: Assert that an image is rendered, NOT the text "Logo"
    // The dev page now provides valid dummy image URLs
    const firstLogo = cloud.locator("img").first();
    await expect(firstLogo).toBeVisible();
    
    // Verify performance attribute
    await expect(firstLogo).toHaveAttribute("loading", "lazy");

    // Visual Snapshot
    await page.waitForLoadState("networkidle");
    await expect(cloud).toHaveScreenshot("logo-cloud-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  /**
   * @test Mobile Responsiveness
   * Verifies the grid adjusts layout on small screens.
   */
  test("responsiveness: grid adjusts on mobile", async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    // Standard mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dev/logo-cloud", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const cloud = page.getByTestId("logo-cloud");
    await expect(cloud).toBeVisible();

    // Verify images are still visible on mobile
    const firstLogo = cloud.locator("img").first();
    await expect(firstLogo).toBeVisible();

    // Visual Snapshot Mobile
    await page.waitForLoadState("networkidle");
    await expect(cloud).toHaveScreenshot("logo-cloud-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
