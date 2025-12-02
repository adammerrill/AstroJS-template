/**
 * @file logo-cloud.spec.ts
 * @description E2E tests for LogoCloud component.
 * * ISO 8601:2004 - Includes global mock setup to ensure deterministic content loading.
 *
 * @module tests/e2e/logo-cloud.spec
 * @requires Playwright Page
 */
import { test, expect, type Page } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

test.describe("Logo Cloud Component", () => {
  /**
   * Blocks third-party Storyblok/Vite development scripts and applies a global content mock.
   *
   * @param {object} fixtures - Playwright test fixtures.
   * @param {BrowserContext} fixtures.context - The Playwright BrowserContext object.
   */
  test.beforeEach(async ({ page, context }) => {
    // 1. Toolbars and Dev Deps Blocking (Original Logic)
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // 2. Mock the global settings endpoint.
    // This intercepts the Layout.astro fetch, preventing the 404 console noise.
    await mockGlobalSettings(page);
  });

  /**
   * Tests that the Logo Cloud component renders correctly on a desktop viewport.
   * Checks for visibility of the component, headline, and a logo.
   * Includes a visual snapshot for regression testing.
   *
   * @param {object} fixtures - Playwright test fixtures.
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

    // Check grid logic (at least one logo fallback visible)
    await expect(page.getByText("Logo").first()).toBeVisible();

    // Visual Snapshot
    await page.waitForLoadState("networkidle");
    await expect(cloud).toHaveScreenshot("logo-cloud-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  /**
   * Tests the responsiveness of the Logo Cloud component on a mobile viewport.
   * Sets the viewport size to a common mobile dimension (375x812).
   * Includes a visual snapshot for regression testing.
   *
   * @param {object} fixtures - Playwright test fixtures.
   */
  test("responsiveness: grid adjusts on mobile", async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    // Set a standard mobile viewport size
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
