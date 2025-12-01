/**
 * @file footer.spec.ts
 * @description E2E tests for the Global Footer component.
 * Verifies dynamic rendering and fallback behavior.
 */
import { test, expect } from "@playwright/test";

test.describe("Global Footer Component", () => {
  const BASE_URL = "https://localhost:4321";

  test.beforeEach(async ({ page, context }) => {
    // Block third-party scripts
    await context.route("**/@storyblok/**", (route) => route.abort());
    await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
      route.abort(),
    );

    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  });

  test("renders branding and copyright", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Check Site Title (Fallback)
    await expect(footer.getByText("Astro Template").first()).toBeVisible();

    // Check Copyright
    const year = new Date().getFullYear();
    await expect(footer.getByText(`© ${year} Astro Template`)).toBeVisible();
  });

  test("renders navigation columns", async ({ page }) => {
    const footer = page.locator("footer");

    // Check Column 1 (Quick Links)
    await expect(
      footer.getByRole("heading", { name: "Quick Links" }),
    ).toBeVisible();
    await expect(footer.getByRole("link", { name: "Services" })).toBeVisible();

    // Check Column 2 (Resources)
    await expect(
      footer.getByRole("heading", { name: "Resources" }),
    ).toBeVisible();
    await expect(
      footer.getByRole("link", { name: "Documentation" }),
    ).toBeVisible();
  });

  test("is responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Ensure content stacks (columns should be visible)
    await expect(
      footer.getByRole("heading", { name: "Quick Links" }),
    ).toBeVisible();
  });
});
