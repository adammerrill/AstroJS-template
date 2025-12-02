/**
 * @file offline-resilience.spec.ts
 * @description Verifies the application's ability to gracefully degrade to "Offline Mode"
 * when the CMS API is unreachable or unconfigured.
 *
 * IMPORTANT: This test suite is designed to run against a server started WITHOUT
 * the STORYBLOK_DELIVERY_API_TOKEN environment variable.
 *
 * Running this test:
 *
 * Option 1 - Automatic (uses playwright.offline.config.ts):
 *   npm run test:e2e:offline
 *
 * Option 2 - Manual:
 *   Terminal 1: npm run dev:offline
 *   Terminal 2: npx playwright test tests/e2e/offline-resilience.spec.ts --config=playwright.offline.config.ts
 *
 * @see playwright.offline.config.ts for configuration details
 */

import { test, expect } from "@playwright/test";

test.describe("Offline Resilience & Fallback System", () => {
  test.beforeEach(async ({ context }) => {
    // Block client-side Storyblok scripts (these would fail anyway in offline mode)
    await context.route("**/storyblok-v2-latest.js", (route) => route.abort());
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());
  });

  test("Home page loads fixture data when API token is missing (offline mode)", async ({
    page,
  }) => {
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      consoleLogs.push(text);
      // Log getSafeStory messages to test output for debugging
      if (text.includes("[getSafeStory]")) {
        console.log(text);
      }
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Wait for client-side hydration to complete
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // 1. Verify fixture headline in the FeatureGrid
    const featureGrid = page.locator('[data-testid="feature-grid"]');
    await expect(featureGrid).toBeVisible({ timeout: 10000 });

    // Check for the main headline in the grid (use .first() to avoid strict mode)
    const mainHeadline = featureGrid
      .getByRole("heading", { name: "Deterministic QA" })
      .first();
    await expect(mainHeadline).toBeVisible();

    // 2. Check for the description text from the fixture (use .first() for strict mode)
    const description = page
      .getByText("This content comes from a JSON fixture")
      .first();
    await expect(description).toBeVisible();

    // 3. Verify we have exactly 3 feature cards (from the fixture columns array)
    const featureCards = page.locator(
      '[data-testid="feature-grid"] .card-hover',
    );
    await expect(featureCards).toHaveCount(3);

    // 4. Verify specific feature content from fixture (use .first() for strict mode)
    await expect(page.getByText("Offline Resilience").first()).toBeVisible();
    await expect(page.getByText("Test Reliability").first()).toBeVisible();

    console.log("✅ All fixture content verified successfully");
  });

  test("Unknown routes fallback to Home fixture in offline mode", async ({
    page,
  }) => {
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      consoleLogs.push(text);
      if (text.includes("[getSafeStory]")) {
        console.log(text);
      }
    });

    await page.goto("/random-missing-page", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Should show the home fixture content (fallback behavior)
    const featureGrid = page.locator('[data-testid="feature-grid"]');
    await expect(featureGrid).toBeVisible({ timeout: 10000 });

    // Verify it's showing the home fixture, not a 404
    const mainHeadline = featureGrid
      .getByRole("heading", { name: "Deterministic QA" })
      .first();
    await expect(mainHeadline).toBeVisible();

    // Verify we're getting the full fixture content (use .first() for strict mode)
    await expect(
      page.getByText("This content comes from a JSON fixture").first(),
    ).toBeVisible();

    console.log("✅ Fallback to home fixture working correctly");
  });

  test("Multiple page navigations maintain fixture consistency", async ({
    page,
  }) => {
    // Navigate to home
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const featureGrid = page.locator('[data-testid="feature-grid"]');
    await expect(featureGrid).toBeVisible();
    await expect(page.getByText("Deterministic QA").first()).toBeVisible();

    // Navigate to a missing page (should fallback to home)
    await page.goto("/missing-page-1", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await expect(featureGrid).toBeVisible();
    await expect(page.getByText("Deterministic QA").first()).toBeVisible();

    // Navigate back to home
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await expect(featureGrid).toBeVisible();
    await expect(page.getByText("Deterministic QA").first()).toBeVisible();

    console.log("✅ Fixture consistency maintained across navigations");
  });
});
