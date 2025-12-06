/**
 * @file svelte-runes.spec.ts
 * @description E2E tests for Svelte 5 Runes hydration and state management.
 * @description Modernization: Uses DOM-based hydration detection instead of window properties.
 * @version 2.0.0
 * @since 2025-12-02
 *
 * @module tests/e2e/svelte-runes.spec
 * @requires Playwright Page
 */
import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

test.describe("Svelte 5 Runes & Hydration", () => {
  const BASE_URL = "https://localhost:4321";

  test.beforeEach(async ({ page }) => {
    // Filter console noise
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("ERR_FAILED")) {
        console.log(`[BROWSER ${msg.type()}]:`, msg.text());
      }
    });

    await mockGlobalSettings(page);
  });

  test("TestimonialSlider hydrates and manages state correctly", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      waitUntil: "domcontentloaded",
    });

    // MODERNIZED: Wait for hydration via DOM attribute (ISO 29119 Strategy)
    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    console.log("[TEST] TestimonialSlider hydrated successfully");

    // Verify initial state via DOM attribute
    await expect(slider).toHaveAttribute("data-active-index", "0");

    // Test state changes through interaction
    const nextButton = page.getByTestId("next-button");
    await nextButton.click();

    // Wait for Svelte reactivity to reflect in DOM
    await expect(slider).toHaveAttribute("data-active-index", "1");

    console.log("[TEST] State management via Svelte 5 Runes works correctly");
  });

  test("ContactForm hydrates and manages form state correctly", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dev/contact-form`, {
      waitUntil: "domcontentloaded",
    });

    // MODERNIZED: Wait for hydration via DOM attribute
    const form = page.getByTestId("contact-form");
    await expect(form).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    console.log("[TEST] ContactForm hydrated successfully");

    // Verify initial state
    await expect(form).toHaveAttribute("data-status", "idle");

    // Fill form and submit
    await page.getByLabel("Name").fill("Runes Test User");
    await page.getByLabel("Email").fill("runes@example.com");
    await page.getByLabel("Message").fill("Testing Svelte 5 Runes state.");

    const submitButton = page.getByRole("button", { name: "Send Inquiry" });
    await submitButton.click();

    // Verify state changes to submitting (transient state)
    // Note: This happens fast, so we might miss it if we await strict visibility
    // Instead, we verify we eventually reach a terminal state (success/error)

    // In dev mode without api_endpoint, it defaults to success
    await expect(form).toHaveAttribute("data-status", "success", {
      timeout: 5000,
    });

    console.log(`[TEST] Form state transitioned to success`);
  });

  test("PricingTable hydrates and manages billing state correctly", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dev/pricing-table`, {
      waitUntil: "domcontentloaded",
    });

    // MODERNIZED: Wait for hydration via DOM attribute
    const table = page.getByTestId("pricing-table");
    await expect(table).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    console.log("[TEST] PricingTable hydrated successfully");

    // Verify initial state
    await expect(table).toHaveAttribute("data-billing-mode", "monthly");

    // Toggle billing mode
    const toggle = page.getByTestId("billing-toggle");
    await toggle.click();

    // Verify state updated
    await expect(table).toHaveAttribute("data-billing-mode", "yearly");

    // Toggle back
    await toggle.click();

    // Verify state updated again
    await expect(table).toHaveAttribute("data-billing-mode", "monthly");

    console.log(
      "[TEST] Billing state management via Svelte 5 Runes works correctly",
    );
  });
});
