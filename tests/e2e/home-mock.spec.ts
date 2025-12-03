/**
 * @file home-mock.spec.ts
 * @description Deterministic Mock Testing Strategy using the Automated Mock Factory (Epic 3.2).
 * Validates that the client-side code correctly handles strictly typed, dynamic content.
 *
 * @module tests/e2e/home-mock.spec
 * @requires Playwright Page, MockFactory
 */

import { test, expect, type Page } from "@playwright/test";
import { MockFactory } from "@/lib/mocks.generated";
import { mockGlobalSettings } from "./global-mock-setup";
import type { FeatureGridBlok, FeatureBlok } from "@/types/generated/storyblok";

// ============================================================================
// DYNAMIC FIXTURE GENERATION (No more static JSON imports!)
// ============================================================================

const DYNAMIC_HEADLINE = "Dynamic QA Success!";

// 1. Generate nested blocks
const mockFeature1 = MockFactory.feature({ headline: "Feature 1 (Mock)", component: "feature" });
const mockFeature2 = MockFactory.feature({ headline: "Feature 2 (Mock)", component: "feature" });

// 2. Build the main Page content using the generated FeatureGrid
const mockGrid: FeatureGridBlok = MockFactory.feature_grid({
  headline: DYNAMIC_HEADLINE,
  description: "Content generated from MockFactory for reliable testing.",
  columns: [mockFeature1, mockFeature2],
  component: 'feature_grid'
});

// 3. Assemble the Storyblok Story structure
const homeFixture = {
  story: {
    name: "Home",
    content: {
      _uid: "test-uid-456",
      component: "page",
      body: [mockGrid],
      seo_title: DYNAMIC_HEADLINE,
      seo_description: "Dynamic test data.",
    },
    slug: "home",
    full_slug: "home",
  },
};

// ============================================================================
// TEST SUITE: QA Pipeline Resilience
// ============================================================================

test.describe("QA Pipeline Resilience (Dynamic Mocks)", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Intercept the Layout's global settings fetch
    await mockGlobalSettings(page);

    // CRITICAL: Intercept the client-side API call made by MockTester.svelte
    await page.route("https://api.mock-test.com/story", async (route) => {
      console.log("✅ Playwright: Intercepted dynamic component API request!");
      await route.fulfill({ 
        status: 200,
        contentType: 'application/json',
        json: homeFixture // Serve the dynamically generated data
      });
    });
  });

  test("Client-side hydration renders using dynamically mocked data", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/mock-viewer/");

    // Wait and assert that the content from the dynamic fixture rendered.
    const headline = page.getByTestId("mock-headline");
    await expect(headline).toBeVisible({ timeout: 10000 });
    await expect(headline).toHaveText(DYNAMIC_HEADLINE);

    // Verify a nested feature item exists
    await expect(page.getByText('Feature 1 (Mock)')).toBeVisible();

    console.log("TEST PASSED: Dynamic mocked content rendered successfully.");
  });
});
