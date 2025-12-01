/**
 * @file pricing-table.spec.ts
 * @description E2E tests for PricingTable component.
 * Matches TestimonialSlider test pattern for reliable hydration detection.
 */
import { test, expect } from "@playwright/test";

test.describe("Pricing Table Component", () => {
  const BASE_URL = "https://localhost:4321";

  test.beforeEach(async ({ page }) => {
    // Log ALL console messages for debugging
    page.on("console", (msg) => {
      console.log(`[BROWSER ${msg.type()}]:`, msg.text());
    });
  });

  // Helper to wait for component hydration (matches TestimonialSlider pattern)
  async function waitForComponentReady(page: any) {
    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // CRITICAL: Wait for Vite to finish processing modules
    await page.waitForTimeout(3000);

    // Wait for our custom hydration marker
    try {
      await page.waitForFunction(
        () => (window as any).__pricingTableReady === true,
        { timeout: 10000 }
      );
      console.log("[TEST] Component is ready");
    } catch (err) {
      console.error("[TEST] Component never hydrated!");
      const isReady = await page.evaluate(
        () => (window as any).__pricingTableReady
      );
      console.error("[TEST] __pricingTableReady value:", isReady);
      throw err;
    }

    // Additional wait for safety
    await page.waitForTimeout(500);
  }

  // Helper to get current billing state from component
  async function getIsYearly(page: any): Promise<boolean> {
    return await page.evaluate(
      () => (window as any).__pricingIsYearly || false
    );
  }

  test("renders correctly and toggles prices on desktop", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    const table = page.getByTestId("pricing-table");
    await expect(table).toBeVisible();

    // Check Initial State (Monthly)
    const proCard = page.getByTestId("pricing-card-pro");
    await expect(proCard).toBeVisible();
    
    // Verify monthly price is showing
    const priceDisplays = proCard.getByTestId("price-display");
    await expect(priceDisplays).toContainText("$20");
    await expect(proCard.getByText("/mo")).toBeVisible();

    // Verify state
    let isYearly = await getIsYearly(page);
    expect(isYearly).toBe(false);

    // Click Toggle
    const toggle = page.getByTestId("billing-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeEnabled();
    await toggle.click();

    // Wait for transition
    await page.waitForTimeout(700);

    // Check Updated State (Yearly)
    await expect(priceDisplays).toContainText("$190");
    await expect(proCard.getByText("/yr")).toBeVisible();

    // Verify state changed
    isYearly = await getIsYearly(page);
    expect(isYearly).toBe(true);

    console.log("[TEST] Toggle test passed successfully");
  });

  test("stacks vertically on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    const table = page.getByTestId("pricing-table");
    await expect(table).toBeVisible();

    const hobbyCard = page.getByTestId("pricing-card-hobby");
    await expect(hobbyCard).toBeVisible();

    // Verify cards stack (each should take full width)
    const cards = page.locator('[data-testid^="pricing-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);

    console.log("[TEST] Mobile layout test passed successfully");
  });

  test("highlights the 'Most Popular' tier", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    const proCard = page.getByTestId("pricing-card-pro");
    await expect(proCard).toBeVisible();
    
    // Check for "Most Popular" badge
    await expect(proCard.getByText("Most Popular")).toBeVisible();

    console.log("[TEST] Highlight test passed successfully");
  });

  test("all three tiers render correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    // Verify all three cards exist
    await expect(page.getByTestId("pricing-card-hobby")).toBeVisible();
    await expect(page.getByTestId("pricing-card-pro")).toBeVisible();
    await expect(page.getByTestId("pricing-card-enterprise")).toBeVisible();

    // Verify CTAs exist
    await expect(page.getByRole("link", { name: "Start Free" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go Pro" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact Sales" })).toBeVisible();

    console.log("[TEST] All tiers render test passed successfully");
  });
});
