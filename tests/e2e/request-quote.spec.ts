// /tests/e2e/request-quote.spec.ts
/**
 * @file request-quote.spec.ts
 * @description E2E tests for RequestQuoteForm component.
 * Verifies multi-step navigation and final submission.
 * * * ISO 8601:2004 - Type instrumentation for strict Playwright/TypeScript compliance.
 *
 * @module tests/e2e/request-quote.spec
 * @requires Playwright Page
 */
import { test, expect, type Page } from "@playwright/test";

// Define the required custom window interface for type safety
interface WindowWithQuoteTest extends Window {
  __quoteFormReady?: boolean;
}

test.describe("Request Quote Form", () => {
  const BASE_URL = "https://localhost:4321";

  test.beforeEach(async ({ page }) => {
    /**
     * Helper to log all browser console messages to the test output.
     * @param msg - The console message object from Playwright.
     */
    page.on("console", (msg) => console.log(`[BROWSER]: ${msg.text()}`));
  });

  /**
   * Helper to wait for the RequestQuoteForm Svelte component to complete hydration.
   * Uses the '__quoteFormReady' flag set by the component's $effect rune.
   */
  async function waitForComponentReady(page: Page): Promise<void> {
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    try {
      await page.waitForFunction(
        () =>
          (window as unknown as WindowWithQuoteTest).__quoteFormReady === true,
        { timeout: 10000 },
      );
    } catch (err) {
      console.error("[TEST] Hydration Timeout");
      throw err;
    }
  }

  test("completes full 3-step wizard flow", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/request-quote`, {
      waitUntil: "networkidle",
    });
    await waitForComponentReady(page);

    const form = page.getByTestId("request-quote-form");
    await expect(form).toBeVisible();

    // --- STEP 1 ---
    await expect(page.getByText("Step 1 of 3")).toBeVisible();

    // Try empty next
    await page.getByRole("button", { name: "Next Step" }).click();
    await expect(page.getByText("Please select a service")).toBeVisible();

    // Fill Step 1
    await page.getByLabel("Service Type").selectOption("plumbing");
    await page.getByLabel("Description").fill("Broken pipe in basement");
    await page.getByRole("button", { name: "Next Step" }).click();

    // --- STEP 2 ---
    await expect(page.getByText("Step 2 of 3")).toBeVisible();

    // Fill Step 2
    await page.getByLabel("Address").fill("123 Main St");
    await page.getByLabel("Zip Code").fill("90210");
    await page.getByRole("button", { name: "Next Step" }).click();

    // --- STEP 3 ---
    await expect(page.getByText("Step 3 of 3")).toBeVisible();

    // Fill Step 3
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");

    // Submit
    const submitBtn = page.getByRole("button", { name: "Submit Request" });
    await submitBtn.click();

    // Verify Success
    await expect(page.getByTestId("success-message")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Quote Requested!")).toBeVisible();

    // Visual Snapshot
    await expect(form).toHaveScreenshot("request-quote-success.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
