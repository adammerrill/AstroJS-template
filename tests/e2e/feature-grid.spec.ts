import { test, expect } from "@playwright/test";

test.describe("Feature Grid Component", () => {
  // Route Blocking and Error Filtering
  test.beforeEach(async ({ page, context }) => {
    // Block Storyblok toolbar
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );

    // Block Astro dev toolbar
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // Filter console errors
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

  test("renders grid layout correctly on desktop", async ({ page }) => {
    // Robust Navigation Wait
    await page.goto("/dev/feature-grid", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // Check main container
    const grid = page.getByTestId("feature-grid");
    await expect(grid).toBeVisible({ timeout: 10000 });

    // Check header content
    await expect(
      page.getByRole("heading", { name: "Why Choose Astro Enterprise" }),
    ).toBeVisible();

    // Check feature items exist
    await expect(
      page.getByRole("heading", { name: "Zero JS Runtime" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Svelte 5 Runes" }),
    ).toBeVisible();
    // -------------------------

    // Stability Wait
    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual Snapshot
    await expect(grid).toHaveScreenshot("feature-grid-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  test("stacks correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/dev/feature-grid", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const grid = page.getByTestId("feature-grid");
    await expect(grid).toBeVisible({ timeout: 10000 });

    // Verify content exists
    // Using exact: true or scoping to heading is safer here too
    await expect(
      page.getByRole("heading", { name: "Tailwind v4" }),
    ).toBeVisible();

    // Stability Wait
    await page.waitForLoadState("networkidle", { timeout: 15000 });

    // Visual Snapshot Mobile
    await expect(grid).toHaveScreenshot("feature-grid-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
