/**
 * @file feature-alternating.spec.ts
 * @description End-to-End tests for the Feature Alternating component.
 * Validates rendering, zig-zag layout application, and responsiveness.
 */
import { test, expect } from "@playwright/test";

test.describe("Feature Alternating Component", () => {
  // Block third-party scripts to ensure stability
  test.beforeEach(async ({ context }) => {
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());
  });

  test("renders correctly on desktop with zig-zag layout", async ({ page }) => {
    await page.goto("/dev/feature-alternating", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const container = page.getByTestId("feature-alternating");
    await expect(container).toBeVisible();

    // Verify Content
    await expect(
      page.getByRole("heading", { name: "Core Platform Capabilities" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Server-Side Rendering" }),
    ).toBeVisible();

    // Verify Layout Classes
    // Item 1 (Index 0): Should NOT have row-reverse
    const row0 = page.getByTestId("feature-row-0");
    await expect(row0).not.toHaveClass(/lg:flex-row-reverse/);

    // Item 2 (Index 1): SHOULD have row-reverse
    const row1 = page.getByTestId("feature-row-1");
    await expect(row1).toHaveClass(/lg:flex-row-reverse/);

    // Wait for network idle before screenshot
    await page.waitForLoadState("networkidle");

    // Visual Check
    await expect(container).toHaveScreenshot(
      "feature-alternating-desktop.png",
      {
        maxDiffPixelRatio: 0.02,
        timeout: 10000,
      },
    );
  });

  test("stacks vertically on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dev/feature-alternating", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const container = page.getByTestId("feature-alternating");
    await expect(container).toBeVisible();

    // On mobile, flex-direction defaults to column (from 'flex flex-col' class).
    // We check that the element is visible and roughly correct.
    await expect(
      page.getByRole("heading", { name: "Edge Network Distribution" }),
    ).toBeVisible();

    await page.waitForLoadState("networkidle");

    await expect(container).toHaveScreenshot("feature-alternating-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
