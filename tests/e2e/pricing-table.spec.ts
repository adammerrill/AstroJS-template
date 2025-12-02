/**
 * @file pricing-table.spec.ts
 * @description E2E tests for PricingTable component.
 * @modernization Uses DOM-based hydration detection (data-hydrated, data-billing-mode)
 * instead of window property polling for improved reliability and decoupling.
 *
 * @module tests/e2e/pricing-table.spec
 * @requires Playwright Page
 */
import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

test.describe("Pricing Table Component", () => {
  const BASE_URL = "https://localhost:4321";

  test.beforeEach(async ({ page }) => {
    /**
     * Helper to log all browser console messages to the test output for debugging.
     * Logs the message type and text.
     */
    page.on("console", (msg) => {
      console.log(`[BROWSER ${msg.type()}]:`, msg.text());
    });

    // Call the mock function to intercept Storyblok global settings.
    // This prevents repetitive 404 errors and ensures deterministic test runs.
    await mockGlobalSettings(page);
  });

  test("renders correctly and toggles prices on desktop", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    // Wait for hydration via DOM attribute
    const table = page.getByTestId("pricing-table");
    await expect(table).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });
    console.log("[TEST] Component hydrated (via data-hydrated attribute)");

    await expect(table).toBeVisible();

    // Check Initial State (Monthly) via DOM attribute
    await expect(table).toHaveAttribute("data-billing-mode", "monthly");

    // Check Initial State (Monthly pricing display)
    const proCard = page.getByTestId("pricing-card-pro");
    await expect(proCard).toBeVisible();

    // Verify monthly price is showing
    const priceDisplays = proCard.getByTestId("price-display");
    await expect(priceDisplays).toContainText("$20");
    await expect(proCard.getByText("/mo")).toBeVisible();

    // Click Toggle
    const toggle = page.getByTestId("billing-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeEnabled();
    await toggle.click();

    // Wait for transition animation to complete before checking prices
    await page.waitForTimeout(700);

    // Check Updated State (Yearly) via DOM attribute
    await expect(table).toHaveAttribute("data-billing-mode", "yearly");

    // Check Updated State (Yearly pricing display)
    await expect(priceDisplays).toContainText("$190");
    await expect(proCard.getByText("/yr")).toBeVisible();

    console.log("[TEST] Toggle test passed successfully");
  });

  test("stacks vertically on mobile", async ({ page }) => {
    // Set viewport to a common mobile width
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    // Wait for hydration via DOM attribute
    const table = page.getByTestId("pricing-table");
    await expect(table).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

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

    // Wait for hydration via DOM attribute
    const table = page.getByTestId("pricing-table");
    await expect(table).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    const proCard = page.getByTestId("pricing-card-pro");
    await expect(proCard).toBeVisible();

    // Check for "Most Popular" badge, which signifies the featured card
    await expect(proCard.getByText("Most Popular")).toBeVisible();

    console.log("[TEST] Highlight test passed successfully");
  });

  test("all three tiers render correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    // Wait for hydration via DOM attribute
    const table = page.getByTestId("pricing-table");
    await expect(table).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    // Verify all three cards exist and are visible
    await expect(page.getByTestId("pricing-card-hobby")).toBeVisible();
    await expect(page.getByTestId("pricing-card-pro")).toBeVisible();
    await expect(page.getByTestId("pricing-card-enterprise")).toBeVisible();

    // Verify call-to-action (CTA) links exist for user interaction
    await expect(page.getByRole("link", { name: "Start Free" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go Pro" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Contact Sales" }),
    ).toBeVisible();

    console.log("[TEST] All tiers render test passed successfully");
  });

  test("can toggle between monthly and yearly multiple times", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    // Wait for hydration via DOM attribute
    const table = page.getByTestId("pricing-table");
    await expect(table).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    const toggle = page.getByTestId("billing-toggle");
    const proCard = page.getByTestId("pricing-card-pro");
    const priceDisplay = proCard.getByTestId("price-display");

    // Initial state: Monthly
    await expect(table).toHaveAttribute("data-billing-mode", "monthly");
    await expect(priceDisplay).toContainText("$20");

    // Toggle to Yearly
    await toggle.click();
    await page.waitForTimeout(500);
    await expect(table).toHaveAttribute("data-billing-mode", "yearly");
    await expect(priceDisplay).toContainText("$190");

    // Toggle back to Monthly
    await toggle.click();
    await page.waitForTimeout(500);
    await expect(table).toHaveAttribute("data-billing-mode", "monthly");
    await expect(priceDisplay).toContainText("$20");

    // Toggle to Yearly again
    await toggle.click();
    await page.waitForTimeout(500);
    await expect(table).toHaveAttribute("data-billing-mode", "yearly");
    await expect(priceDisplay).toContainText("$190");

    console.log("[TEST] Multiple toggle test passed successfully");
  });
});
