// /tests/e2e/hero-consultant.spec.ts
/**
 * @file hero-consultant.spec.ts
 * @description End-to-End tests for the Hero Consultant component.
 * Verifies layout, content rendering, and responsiveness.
 *
 * @module tests/e2e/hero-consultant.spec
 * @version 1.0.1
 * @date 2025-12-01
 *
 * ISO 8601:2004 - Implements global settings mocking for test determinism.
 */

import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

/**
 * @description Defines a suite of tests for the Hero Consultant Component.
 */
test.describe("Hero Consultant Component", () => {
  /**
   * @description Setup hook that runs before every test.
   * Blocks external Storyblok toolbars and applies the global settings mock.
   */
  test.beforeEach(async ({ page, context }) => {
    // 1. Block toolbars and extraneous Vite dependencies to prevent timeouts
    //    The original logic is essential for stability in the development environment.
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // 2. Mock Storyblok API call for global settings
    // This intercepts the Layout's API call for config/global-settings,
    // eliminating 404 errors and ensuring the Header/Footer fallbacks are used.
    await mockGlobalSettings(page);

    // 3. Filter console noise
    // The original logic remains to monitor browser errors excluding known noise.
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
   * @test
   * @description Verifies the component renders content and split layout correctly on a desktop viewport.
   */
  test("renders content and split layout correctly on desktop", async ({
    page,
  }) => {
    // Explicitly force desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto("/dev/hero-consultant", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // Scope selectors to the component to avoid matching debug JSON dumps
    const hero = page.getByTestId("hero-consultant");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Verify key content elements
    await expect(
      hero.getByRole("heading", { name: /Unlock Elite Performance/i }),
    ).toBeVisible();

    // Scoped text check
    await expect(
      hero.getByText("I combine decades of C-level experience"),
    ).toBeVisible();

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual regression test
    await expect(hero).toHaveScreenshot("hero-consultant-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  /**
   * @test
   * @description Verifies the component is responsive on a mobile viewport (image/text stacking).
   */
  test("is responsive on mobile (image/text stacking)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/dev/hero-consultant", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const hero = page.getByTestId("hero-consultant");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Verify content stacking (text should be visible)
    await expect(hero.getByText("Headshot Placeholder")).toBeVisible();

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual regression test
    await expect(hero).toHaveScreenshot("hero-consultant-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
