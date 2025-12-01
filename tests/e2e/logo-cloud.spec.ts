/**
 * @file logo-cloud.spec.ts
 * @description E2E tests for LogoCloud component.
 */
import { test, expect } from "@playwright/test";

test.describe("Logo Cloud Component", () => {
  // Block third-party scripts
  test.beforeEach(async ({ context }) => {
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());
  });

  test("renders correctly on desktop", async ({ page }) => {
    await page.goto("/dev/logo-cloud", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const cloud = page.getByTestId("logo-cloud");
    await expect(cloud).toBeVisible();

    // Check headline
    await expect(page.getByText("Powering Next-Gen Companies")).toBeVisible();

    // Check grid logic (at least one logo fallback visible)
    await expect(page.getByText("Logo").first()).toBeVisible();

    // Visual Snapshot
    await page.waitForLoadState("networkidle");
    await expect(cloud).toHaveScreenshot("logo-cloud-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  test("responsiveness: grid adjusts on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dev/logo-cloud", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const cloud = page.getByTestId("logo-cloud");
    await expect(cloud).toBeVisible();

    // Visual Snapshot Mobile
    await page.waitForLoadState("networkidle");
    await expect(cloud).toHaveScreenshot("logo-cloud-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
