// tests/layout.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Layout - Structure & Dimensions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Main content area fills available height", async ({ page }) => {
    const viewport = { width: 1024, height: 768 };
    await page.setViewportSize(viewport);
    await page.goto("/");

    const mainElement = page.locator('[data-testid="layout-main"]');

    // In BaseLayout, we use flex-1 to push the footer down,
    // but we do NOT enforce vertical centering of children.
    const computedStyle = await mainElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        minHeight: styles.minHeight, // should be 100vh or handled by flex-grow
        flexGrow: styles.flexGrow, // should be 1
      };
    });

    // Ensure the main area grows to fill space (flex-1 class)
    expect(computedStyle.flexGrow).toBe("1");
  });

  test("content uses max-width token of 4xl (896px)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    const section = page.locator('[data-testid="welcome-content"]');
    const classList = await section.evaluate((el) => Array.from(el.classList));

    // Check for the actual class used in Welcome.astro
    expect(classList).toContain("max-w-4xl");

    const width = await section.evaluate(
      (el) => el.getBoundingClientRect().width,
    );
    // max-w-4xl = 56rem = 896px
    expect(width).toBeLessThanOrEqual(896);
    expect(width).toBeGreaterThan(800);
  });
});
