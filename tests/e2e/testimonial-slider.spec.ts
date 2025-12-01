import { test, expect, type Page } from "@playwright/test";

// Interface to satisfy TypeScript for custom window properties
interface WindowWithTest extends Window {
  __testimonialReady?: boolean;
  __testimonialActiveIndex?: number;
}

test.describe("Testimonial Slider Component", () => {
  // CRITICAL: Define baseURL to use localhost instead of 127.0.0.1
  const BASE_URL = "https://localhost:4321";

  test.beforeEach(async ({ page }) => {
    // Log ALL console messages for debugging
    page.on("console", (msg) => {
      console.log(`[BROWSER ${msg.type()}]:`, msg.text());
    });
  });

  // Helper to wait for component hydration
  async function waitForComponentReady(page: Page) {
    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // CRITICAL: Wait for Vite to finish processing modules
    // Give extra time for Vite HMR to connect and load Svelte component
    await page.waitForTimeout(3000);

    // Wait for our custom hydration marker
    try {
      await page.waitForFunction(
        () => (window as unknown as WindowWithTest).__testimonialReady === true,
        { timeout: 10000 },
      );
      console.log("[TEST] Component is ready");
    } catch (err) {
      console.error("[TEST] Component never hydrated!");
      const isReady = await page.evaluate(
        () => (window as unknown as WindowWithTest).__testimonialReady,
      );
      console.error("[TEST] __testimonialReady value:", isReady);
      throw err;
    }

    // Additional wait for safety
    await page.waitForTimeout(500);
  }

  // Helper to get current activeIndex from component
  async function getActiveIndex(page: Page): Promise<number> {
    return await page.evaluate(
      () => (window as unknown as WindowWithTest).__testimonialActiveIndex || 0,
    );
  }

  test("renders first slide and cycles on click", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toBeVisible();

    // Verify initial state
    const slide0 = page.getByTestId("testimonial-slide-0");
    await expect(slide0).toBeVisible();
    await expect(slide0).toContainText("Jane Doe");

    let activeIndex = await getActiveIndex(page);
    expect(activeIndex).toBe(0);

    // Click next
    const nextButton = page.getByTestId("next-button");
    await nextButton.click();

    // Wait for transition
    await page.waitForTimeout(700);

    // Verify state changed
    activeIndex = await getActiveIndex(page);
    expect(activeIndex).toBe(1);

    // Verify UI updated
    const slide1 = page.getByTestId("testimonial-slide-1");
    await expect(slide1).toBeVisible({ timeout: 3000 });
    await expect(slide1).toContainText("Sam Smith");

    // Verify old slide is gone
    await expect(slide0).not.toBeVisible();
  });

  test("cycles through all testimonials", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    const nextButton = page.getByTestId("next-button");

    // Start at 0
    expect(await getActiveIndex(page)).toBe(0);

    // Go to 1
    await nextButton.click();
    await page.waitForTimeout(700);
    expect(await getActiveIndex(page)).toBe(1);
    const slide1 = page.getByTestId("testimonial-slide-1");
    await expect(slide1).toBeVisible();
    await expect(slide1).toContainText("Sam Smith");

    // Go to 2
    await nextButton.click();
    await page.waitForTimeout(700);
    expect(await getActiveIndex(page)).toBe(2);
    const slide2 = page.getByTestId("testimonial-slide-2");
    await expect(slide2).toBeVisible();
    await expect(slide2).toContainText("Michael Lee");

    // Cycle back to 0
    await nextButton.click();
    await page.waitForTimeout(700);
    expect(await getActiveIndex(page)).toBe(0);
    const slide0 = page.getByTestId("testimonial-slide-0");
    await expect(slide0).toBeVisible();
    await expect(slide0).toContainText("Jane Doe");
  });

  test("previous button works", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    const prevButton = page.getByTestId("prev-button");

    // Start at 0, go backwards to 2
    expect(await getActiveIndex(page)).toBe(0);

    await prevButton.click();
    await page.waitForTimeout(700);

    expect(await getActiveIndex(page)).toBe(2);
    const slide2 = page.getByTestId("testimonial-slide-2");
    await expect(slide2).toBeVisible();
    await expect(slide2).toContainText("Michael Lee");
  });

  test("dot navigation works", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    // Click dot 2 (third testimonial)
    const dot2 = page.getByTestId("dot-2");
    await dot2.click();
    await page.waitForTimeout(700);

    expect(await getActiveIndex(page)).toBe(2);
    const slide2 = page.getByTestId("testimonial-slide-2");
    await expect(slide2).toBeVisible();
    await expect(slide2).toContainText("Michael Lee");

    // Click dot 0 (first testimonial)
    const dot0 = page.getByTestId("dot-0");
    await dot0.click();
    await page.waitForTimeout(700);

    expect(await getActiveIndex(page)).toBe(0);
    const slide0 = page.getByTestId("testimonial-slide-0");
    await expect(slide0).toBeVisible();
    await expect(slide0).toContainText("Jane Doe");
  });

  test("is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    const slide0 = page.getByTestId("testimonial-slide-0");
    await expect(slide0).toBeVisible();
    await expect(slide0).toContainText("VP Marketing");
  });
});
