/**
 * @file contact-form.spec.ts
 * @description E2E tests for ContactForm component.
 * Verifies validation and successful submission flow.
 */
import { test, expect } from "@playwright/test";

test.describe("Contact Form Component", () => {
  const BASE_URL = "https://localhost:4321";

  test.beforeEach(async ({ page }) => {
    // Log console messages for debugging
    page.on("console", (msg) => {
      console.log(`[BROWSER ${msg.type()}]:`, msg.text());
    });
  });

  // Helper to wait for component hydration
  async function waitForComponentReady(page: any) {
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    try {
      await page.waitForFunction(
        () => (window as any).__contactFormReady === true,
        { timeout: 10000 }
      );
      console.log("[TEST] Component is ready");
    } catch (err) {
      console.error("[TEST] Component never hydrated!");
      throw err;
    }

    await page.waitForTimeout(500);
  }

  test("validates input and submits successfully", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/contact-form`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    const form = page.getByTestId("contact-form");
    await expect(form).toBeVisible();

    // 1. Try submitting empty form (Trigger Validation)
    const submitButton = page.getByRole("button", { name: "Send Inquiry" });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Wait for validation to appear
    await page.waitForTimeout(500);

    // Check for error messages (without periods)
    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Message is required")).toBeVisible();

    console.log("[TEST] Validation errors displayed correctly");

    // 2. Fill out form
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Message").fill("This is an E2E test message.");

    // 3. Submit
    await submitButton.click();

    // Wait for submission
    await page.waitForTimeout(1500);

    // 4. Verify Success State
    const successMessage = page.getByTestId("success-message");
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Check for success text (partial match)
    await expect(
      successMessage.getByText(/Thanks.*received your inquiry/i)
    ).toBeVisible();

    console.log("[TEST] Form submitted successfully");
  });

  test("validates email format", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/contact-form`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    // Fill with invalid email
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByLabel("Message").fill("Test message");

    // Submit
    await page.getByRole("button", { name: "Send Inquiry" }).click();
    await page.waitForTimeout(500);

    // Check for email validation error
    await expect(page.getByText("Please enter a valid email address")).toBeVisible();

    console.log("[TEST] Email validation works correctly");
  });

  test("clears form after successful submission", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/contact-form`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    await waitForComponentReady(page);

    // Fill and submit form
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Message").fill("Test message");
    await page.getByRole("button", { name: "Send Inquiry" }).click();

    // Wait for success
    await expect(page.getByTestId("success-message")).toBeVisible({ timeout: 5000 });

    // Click "Send another message"
    await page.getByText("Send another message").click();
    await page.waitForTimeout(500);

    // Verify form is cleared
    const nameInput = page.getByLabel("Name");
    await expect(nameInput).toHaveValue("");

    console.log("[TEST] Form clears after submission");
  });
});
