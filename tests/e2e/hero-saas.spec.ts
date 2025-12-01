import { test, expect } from "@playwright/test";

test.describe("Hero SaaS Component", () => {
  test.beforeEach(async ({ page, context }) => {
    // 1. Block Storyblok toolbar to prevent 504 errors
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );

    // 2. Block Astro dev toolbar
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // 3. Filter console/network errors for blocked resources
    page.on("console", (msg) => {
      if (
        msg.type() === "error" &&
        !msg.text().includes("storyblok") &&
        !msg.text().includes("ERR_FAILED")
      ) {
        console.error(`[Browser Error]: ${msg.text()}`);
      }
    });

    page.on("response", (response) => {
      if (
        response.status() >= 400 &&
        !response.url().includes("storyblok") &&
        !response.url().includes("__astro_dev_toolbar__")
      ) {
        console.error(
          `[Network Error]: ${response.status()} ${response.url()}`,
        );
      }
    });
  });

  test("renders correctly on desktop", async ({ page }) => {
    await page.goto("/dev/hero-saas", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // Scope the search to the container to avoid matching debug JSON
    const hero = page.getByTestId("hero-saas");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Use specific role for heading
    await expect(
      page.getByRole("heading", { name: /Automate Your Enterprise Workflow/i }),
    ).toBeVisible();

    // FIX: Scope the badge check to the hero container to avoid strict mode violations
    await expect(hero.getByText("v2.0 Released")).toBeVisible();

    // Wait for stability
    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual Snapshot
    await expect(hero).toHaveScreenshot("hero-saas-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  test("is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/dev/hero-saas", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const hero = page.getByTestId("hero-saas");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Check specific content visible on mobile
    await expect(hero.getByText("v2.0 Released")).toBeVisible();

    // Wait for stability
    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual Snapshot Mobile
    await expect(hero).toHaveScreenshot("hero-saas-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
