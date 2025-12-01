import { test, expect } from "@playwright/test";

test.describe("Hero Local Component", () => {
  // Common setup to block toolbars
  test.beforeEach(async ({ context }) => {
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());
  });

  test("renders content and layout correctly on desktop", async ({ page }) => {
    await page.goto("/dev/hero-local", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const hero = page.getByTestId("hero-local");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // FIX: Scope text checks to the container to ignore debug JSON
    await expect(hero.getByText("Emergency HVAC")).toBeVisible();
    await expect(hero.getByText("Dallas-Fort Worth Metroplex")).toBeVisible();
    await expect(hero.getByText("Quick Quote in 60 Seconds")).toBeVisible();

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    await expect(hero).toHaveScreenshot("hero-local-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  test("is responsive on mobile (content stacks)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dev/hero-local", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const hero = page.getByTestId("hero-local");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // FIX: Scope check
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
