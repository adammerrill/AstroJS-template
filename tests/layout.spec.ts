import { test, expect } from "@playwright/test";

test.describe("Layout - Vertical Centering & Max Width", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("content is vertically centered on desktop (≥768px)", async ({
    page,
  }) => {
    const viewport = { width: 1024, height: 768 };
    await page.setViewportSize(viewport);
    await page.goto("/");

    // Target the Layout.astro main element
    const mainElement = page.locator("body > main");
    const computedStyle = await mainElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        alignItems: styles.alignItems,
        justifyContent: styles.justifyContent,
        // Parse pixel value for comparison
        minHeight: parseInt(styles.minHeight, 10),
      };
    });

    expect(computedStyle.display).toBe("flex");
    expect(computedStyle.alignItems).toBe("center");
    expect(computedStyle.justifyContent).toBe("center");
    // Should equal viewport height (100vh computes to 768px)
    expect(computedStyle.minHeight).toBe(viewport.height);
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
    expect(width).toBeGreaterThan(800); // Ensure it's actually using the width
  });

  test("content remains centered on mobile (<768px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const mainElement = page.locator("body > main");
    const computedStyle = await mainElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        alignItems: styles.alignItems,
        justifyContent: styles.justifyContent,
      };
    });

    expect(computedStyle.display).toBe("flex");
    expect(computedStyle.alignItems).toBe("center");
    expect(computedStyle.justifyContent).toBe("center");
  });
});
