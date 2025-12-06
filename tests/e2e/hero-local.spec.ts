/**
 * @file hero-local.spec.ts
 * @author Atom Merrill
 * @description End-to-End tests for the Hero Local Component.
 *
 * Verifies content rendering, responsive stacking, and ensures deterministic behavior
 * by mocking global settings data.
 *
 * @version 1.0.0
 * @since 2025-12-01
 *
 * ISO 8601:2004 - Implements global setting mocking to prevent 404 console errors.
 */

import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

/**
 * Executes a suite of E2E tests for the Hero Local Component.
 */
test.describe("Hero Local Component", () => {
  /**
   * Performs common setup before each test run.
   *
   * Blocks Storyblok/Vite toolbars and mocks the global settings API call.
   *
   * @param {object} fixtures - Playwright fixture object containing `page` and `context`.
   * @param {BrowserContext} fixtures.context - The Playwright BrowserContext object.
   */
  test.beforeEach(async ({ page, context }) => {
    // TypeScript types Page and BrowserContext are inferred/used here.
    // 1. Block Storyblok Toolbars and Vite Dependencies
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // 2. Apply the mock for global settings before navigation.
    // This intercepts the 'config/global-settings' API call and prevents 404s.
    await mockGlobalSettings(page);

    // Filter console output noise
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
   * Tests content rendering and layout on a standard desktop viewport.
   *
   * @param {object} fixtures - Playwright fixture object.
   */
  test("renders content and layout correctly on desktop", async ({ page }) => {
    await page.goto("/dev/hero-local", {
      timeout: 30000,
      // Use 'domcontentloaded' or 'load' as 'networkidle' can hang if mocks aren't fast
      waitUntil: "domcontentloaded",
    });

    const hero = page.getByTestId("hero-local");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Scope text checks to the container to ignore debug JSON
    await expect(hero.getByText("Emergency HVAC")).toBeVisible();
    await expect(hero.getByText("Dallas-Fort Worth Metroplex")).toBeVisible();
    await expect(hero.getByText("Quick Quote in 60 Seconds")).toBeVisible();

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    await expect(hero).toHaveScreenshot("hero-local-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  /**
   * Tests the responsive behavior on a mobile viewport, verifying content stacking.
   *
   * @param {object} fixtures - Playwright fixture object.
   */
  test("is responsive on mobile (content stacks)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dev/hero-local", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const hero = page.getByTestId("hero-local");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Scope check: verify a key mobile element is visible
    await expect(
      hero.getByRole("link", { name: "Call Now (214) 555-0101" }),
    ).toBeVisible();

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    await expect(hero).toHaveScreenshot("hero-local-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
