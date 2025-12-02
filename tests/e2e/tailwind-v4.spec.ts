/**
 * @file tests/e2e/tailwind-v4.spec.ts
 * @description E2E Validation for Tailwind CSS v4 Engine.
 * Verifies that CSS variables are emitted correctly and custom breakpoints trigger layout shifts.
 * @version 1.0.0
 */

import { test, expect } from "@playwright/test";

test.describe("Tailwind v4 Engine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("compiles @theme variables to CSS custom properties", async ({
    page,
  }) => {
    // Check for a specific v4 variable we defined in global.css
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim();
    });

    // We expect "hsl(var(--primary))" or resolved value, depending on browser computation
    // Ideally, we check that it is NOT empty
    expect(primaryColor).toBeTruthy();
    console.log(` Resolved --color-primary: ${primaryColor}`);
  });

  test("custom breakpoint bp1020 triggers correct layout shift", async ({
    page,
  }) => {
    const mobileMenuBtn = page.locator("#mobile-menu-button");
    const desktopNav = page.locator('[data-testid="desktop-nav"]');

    // 1. Test Below Breakpoint (1019px)
    await page.setViewportSize({ width: 1019, height: 800 });
    await expect(mobileMenuBtn).toBeVisible();
    await expect(desktopNav).toBeHidden();

    // 2. Test At Breakpoint (1020px) - The exact pixel defined in --breakpoint-bp1020
    await page.setViewportSize({ width: 1020, height: 800 });
    await expect(mobileMenuBtn).toBeHidden();
    await expect(desktopNav).toBeVisible();
  });
});
