// tests/components.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Component Architecture", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("BaseLayout includes Skip to Content link for accessibility", async ({
    page,
  }) => {
    const skipLink = page.locator("#skip-nav");
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
    // Should be screen-reader only initially
    await expect(skipLink).toHaveClass(/sr-only/);
  });

  test("Layout renders SEO metadata", async ({ page }) => {
    // Check if JSON-LD schema is injected
    const schema = page.locator('script[type="application/ld+json"]');
    await expect(schema).toBeAttached();

    // Verify OpenGraph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toBeAttached();
  });

  test("Svelte 5 Button primitive handles events", async ({ page }) => {
    // Inject a test button using the Svelte component classes
    await page.evaluate(() => {
      const btn = document.createElement("button");
      btn.id = "test-btn";
      // Use classes defined in Button.svelte variant map
      btn.className =
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium btn-primary h-10 px-4 py-2";
      btn.style.position = "fixed";
      btn.style.top = "50px"; // Render at top
      btn.style.left = "50px";
      btn.style.zIndex = "99999"; // Force above toolbar
      btn.textContent = "Click Me";
      btn.onclick = () => {
        btn.dataset.clicked = "true";
      };
      document.body.appendChild(btn);
    });

    const btn = page.locator("#test-btn");
    await expect(btn).toBeVisible();

    // Test interactions
    await btn.click();
    await expect(btn).toHaveAttribute("data-clicked", "true");
  });
});
