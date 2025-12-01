import { test, expect } from "@playwright/test";

test.describe("Hero Consultant Component", () => {
  test.beforeEach(async ({ page, context }) => {
    // Block toolbars to prevent timeouts
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());

    // Filter noise
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

  test("renders content and split layout correctly on desktop", async ({
    page,
  }) => {
    // FIX 1: Explicitly force desktop viewport, otherwise mobile-chrome project runs this on Pixel 5
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto("/dev/hero-consultant", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // FIX 2: Scope selectors to the component to avoid matching debug JSON dumps
    const hero = page.getByTestId("hero-consultant");
    await expect(hero).toBeVisible({ timeout: 10000 });

    await expect(
      hero.getByRole("heading", { name: /Unlock Elite Performance/i }),
    ).toBeVisible();

    // Scoped text check
    await expect(
      hero.getByText("I combine decades of C-level experience"),
    ).toBeVisible();

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    await expect(hero).toHaveScreenshot("hero-consultant-desktop.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });

  test("is responsive on mobile (image/text stacking)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/dev/hero-consultant", {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const hero = page.getByTestId("hero-consultant");
    await expect(hero).toBeVisible({ timeout: 10000 });

    await expect(hero.getByText("Headshot Placeholder")).toBeVisible();

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    await expect(hero).toHaveScreenshot("hero-consultant-mobile.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
