/**
 * @file testimonial-slider.spec.ts
 * @description End-to-End (E2E) validation for the Testimonial Slider Component.
 * Covers core functionality including:
 * - Client-side hydration verification
 * - Circular navigation logic (Next/Prev loops)
 * - Direct navigation via pagination dots
 * - Responsive layout adaptation
 * - Accessibility attribute verification
 * - Dynamic state reflection (button states based on content count)
 *
 * @module tests/e2e/testimonial-slider.spec
 * @requires Playwright Page
 * @version 2.1.0
 * @since 2025-12-02
 * @description Modernization: Uses DOM-based attribute detection (`data-hydrated`) for deterministic testing.
 */

import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

test.describe("Testimonial Slider Component", () => {
  // CRITICAL: Define baseURL to use localhost instead of 127.0.0.1 for consistent environment access.
  const BASE_URL = "https://localhost:4321";

  /**
   * Global Setup for Testimonial Suite.
   * - Filters console noise.
   * - Mocks global settings to prevent 404s.
   */
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      if (msg.type() === "error")
        console.log(`[BROWSER ${msg.type()}]:`, msg.text());
    });
    await mockGlobalSettings(page);
  });

  /**
   * @test Renders Initial State
   * @description Verifies the component hydrates, shows the first slide, and handles
   * the circular "Next" navigation logic correctly.
   */
  test("renders first slide and cycles on click", async ({ page }) => {
    // 1. Navigate to the component isolation page
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    // 2. Hydration Check: Wait for Svelte 5 hydration signal
    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });
    console.log("[TEST] Component hydrated (via data-hydrated attribute)");

    await expect(slider).toBeVisible();

    // 3. Verify Initial State (Index 0)
    await expect(slider).toHaveAttribute("data-active-index", "0");

    const slide0 = page.getByTestId("testimonial-slide-0");
    await expect(slide0).toBeVisible();
    await expect(slide0).toContainText("Jane Doe");

    // 4. Interaction: Click 'Next'
    const nextButton = page.getByTestId("next-button");
    await nextButton.click();

    // 5. Wait for Animation/Transition
    await page.waitForTimeout(700);

    // 6. Verify State Update (Index 1)
    await expect(slider).toHaveAttribute("data-active-index", "1");

    // 7. Verify UI Update
    const slide1 = page.getByTestId("testimonial-slide-1");
    await expect(slide1).toBeVisible({ timeout: 3000 });
    await expect(slide1).toContainText("Sam Smith");

    // 8. Verify Old Slide is Hidden
    await expect(slide0).not.toBeVisible();
  });

  /**
   * @test Full Cycle Navigation
   * @description Validates the circular logic by traversing the entire list
   * and wrapping around from the last slide to the first.
   */
  test("cycles through all testimonials", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    const nextButton = page.getByTestId("next-button");

    // Start at Index 0
    await expect(slider).toHaveAttribute("data-active-index", "0");

    // Index 0 -> 1
    await nextButton.click();
    await page.waitForTimeout(700);
    await expect(slider).toHaveAttribute("data-active-index", "1");
    await expect(page.getByTestId("testimonial-slide-1")).toBeVisible();

    // Index 1 -> 2
    await nextButton.click();
    await page.waitForTimeout(700);
    await expect(slider).toHaveAttribute("data-active-index", "2");
    await expect(page.getByTestId("testimonial-slide-2")).toBeVisible();

    // Index 2 -> 0 (Wrap Around)
    await nextButton.click();
    await page.waitForTimeout(700);
    await expect(slider).toHaveAttribute("data-active-index", "0");
    await expect(page.getByTestId("testimonial-slide-0")).toBeVisible();
  });

  /**
   * @test Reverse Navigation
   * @description Validates that the 'Previous' button correctly wraps
   * from the first slide to the last slide (negative index handling).
   */
  test("previous button works with wrap-around", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    const prevButton = page.getByTestId("prev-button");

    // Start at Index 0
    await expect(slider).toHaveAttribute("data-active-index", "0");

    // Click Prev: Should wrap to last index (2)
    await prevButton.click();
    await page.waitForTimeout(700);

    await expect(slider).toHaveAttribute("data-active-index", "2");
    const slide2 = page.getByTestId("testimonial-slide-2");
    await expect(slide2).toBeVisible();
    await expect(slide2).toContainText("Michael Lee");
  });

  /**
   * @test Pagination Dots
   * @description Verifies that clicking specific pagination dots directly
   * navigates to the corresponding slide.
   */
  test("dot navigation works", async ({ page }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    // Jump to Index 2
    await page.getByTestId("dot-2").click();
    await page.waitForTimeout(700);
    await expect(slider).toHaveAttribute("data-active-index", "2");

    // Jump back to Index 0
    await page.getByTestId("dot-0").click();
    await page.waitForTimeout(700);
    await expect(slider).toHaveAttribute("data-active-index", "0");
  });

  /**
   * @test Responsive Layout
   * @description Ensures the component renders critical content correctly
   * on constrained mobile viewports.
   */
  test("is responsive on mobile", async ({ page }) => {
    // iPhone SE Dimensions
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "networkidle",
    });

    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    const slide0 = page.getByTestId("testimonial-slide-0");
    await expect(slide0).toBeVisible();
    await expect(slide0).toContainText("VP Marketing");
  });

  /**
   * @test Dynamic Controls State
   * @description Verifies that navigation controls are enabled/disabled based on
   * the actual number of slides rendered.
   * @logic Counts pagination dots to determine slide count dynamically.
   */
  test("navigation buttons state reflects testimonial count", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      timeout: 30000,
      waitUntil: "domcontentloaded", // Faster navigation for state checks
    });

    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    // Count dots to determine total items (Robust selector)
    const dotCount = await page.locator('[data-testid^="dot-"]').count();
    console.log(`[TEST] Found ${dotCount} testimonial dots`);

    const nextButton = page.getByTestId("next-button");
    const prevButton = page.getByTestId("prev-button");

    if (dotCount <= 1) {
      await expect(nextButton).toBeDisabled();
      await expect(prevButton).toBeDisabled();
      console.log(
        "[TEST] Verified buttons disabled for single/no testimonials",
      );
    } else {
      await expect(nextButton).toBeEnabled();
      await expect(prevButton).toBeEnabled();
      console.log("[TEST] Verified buttons enabled for multiple testimonials");
    }
  });

  /**
   * @test Content Integrity
   * @description Verifies that the displayed slide contains all expected data fields
   * (Quote, Name, Title) correctly mapped from the prop data.
   */
  test("displays correct content structure for active slide", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      waitUntil: "networkidle",
    });

    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    // Target the first slide
    const slide0 = page.getByTestId("testimonial-slide-0");

    // Check Quote
    await expect(slide0.locator("blockquote p").first()).toContainText(
      "Working with this team was a game-changer.",
    );

    // Check Name
    await expect(slide0.locator("footer p.font-semibold")).toContainText(
      "Jane Doe",
    );

    // Check Title
    await expect(
      slide0.locator("footer p.text-muted-foreground"),
    ).toContainText("VP Marketing");

    console.log("[TEST] Content integrity verified for Slide 0");
  });

  /**
   * @test Accessibility Attributes
   * @description Verifies that interactive elements have appropriate ARIA labels
   * for screen readers.
   */
  test("navigation buttons have correct accessibility labels", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dev/testimonial-slider`, {
      waitUntil: "networkidle",
    });

    const slider = page.getByTestId("testimonial-slider");
    await expect(slider).toHaveAttribute("data-hydrated", "true", {
      timeout: 15000,
    });

    // Verify Next/Prev labels
    const prevButton = page.getByTestId("prev-button");
    const nextButton = page.getByTestId("next-button");

    await expect(prevButton).toHaveAttribute(
      "aria-label",
      "Previous testimonial",
    );
    await expect(nextButton).toHaveAttribute("aria-label", "Next testimonial");

    // Verify Dot labels (dynamic index check)
    const dot0 = page.getByTestId("dot-0");
    await expect(dot0).toHaveAttribute("aria-label", "Go to testimonial 1"); // 1-based index for humans

    console.log("[TEST] Accessibility attributes verified");
  });
});
