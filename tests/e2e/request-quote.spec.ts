// /tests/e2e/request-quote.spec.ts
/**
 * @file request-quote.spec.ts
 * @description E2E tests for RequestQuoteForm component.
 * Verifies multi-step navigation and final submission.
 * * ISO 8601:2004 - Type instrumentation for strict Playwright/TypeScript compliance.
 *
 * @module tests/e2e/request-quote.spec
 * @requires Playwright Page
 * * Architectural Note: Includes global settings mock to ensure tests are deterministic
 * and independent of the live Storyblok CMS environment.
 */
import { test, expect, type Page } from "@playwright/test";
import type { ConsoleMessage } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

// Define the required custom window interface for type safety
interface WindowWithQuoteTest extends Window {
  __quoteFormReady?: boolean;
}

test.describe("Request Quote Form", () => {
  const BASE_URL: string = "https://localhost:4321";

  /**
   * Sets up the test environment before each test.
   * Includes console message logging and global settings mocking.
   */
  test.beforeEach(async ({ page }: { page: Page }) => {
    /**
     * Helper to log all browser console messages to the test output.
     * @param msg - The console message object from Playwright.
     */
    page.on("console", (msg: ConsoleMessage): void =>
      console.log(`[BROWSER]: ${msg.text()}`),
    );

    // Apply the mock for global settings fetch calls
    await mockGlobalSettings(page);
  });

  /**
   * Helper to wait for the RequestQuoteForm Svelte component to complete client-side hydration.
   * Asserts the existence of the '__quoteFormReady' flag set by the component's $effect rune.
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

  /**
   * Test case to verify the complete, successful navigation and submission
   * of the multi-step quote request form.
   */
  test("completes full 3-step wizard flow", async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    await page.goto(`${BASE_URL}/dev/request-quote`, {
      waitUntil: "networkidle",
    });
    await waitForComponentReady(page);

    const form = page.getByTestId("request-quote-form");
    await expect(form).toBeVisible();

    // --- STEP 1: Service Selection ---
    await expect(page.getByText("Step 1 of 3")).toBeVisible();

    // 1. Validation check: Try empty next
    await page.getByRole("button", { name: "Next Step" }).click();
    await expect(page.getByText("Please select a service")).toBeVisible();

    // 2. Fill and proceed
    await page.getByLabel("Service Type").selectOption("plumbing");
    await page.getByLabel("Description").fill("Broken pipe in basement");
    await page.getByRole("button", { name: "Next Step" }).click();

    // --- STEP 2: Location Details ---
    await expect(page.getByText("Step 2 of 3")).toBeVisible();

    // 1. Fill and proceed
    await page.getByLabel("Address").fill("123 Main St");
    await page.getByLabel("Zip Code").fill("90210");
    await page.getByRole("button", { name: "Next Step" }).click();

    // --- STEP 3: Contact Information & Submission ---
    await expect(page.getByText("Step 3 of 3")).toBeVisible();

    // 1. Fill final details
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");

    // 2. Submit the form
    const submitBtn = page.getByRole("button", { name: "Submit Request" });
    await submitBtn.click();

    // 3. Verify Success state
    await expect(page.getByTestId("success-message")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Quote Requested!")).toBeVisible();

    // 4. Visual Snapshot for regression
    await expect(form).toHaveScreenshot("request-quote-success.png", {
      maxDiffPixelRatio: 0.02,
      timeout: 10000,
    });
  });
});
