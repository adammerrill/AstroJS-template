/**
 * @file home-mock.spec.ts
 * @description Deterministic Mock Testing Strategy using the Automated Mock Factory.
 * Validates that the client-side code correctly handles strictly typed, dynamic content.
 *
 * @purpose
 * - Verify Playwright route interception works correctly
 * - Validate Svelte 5 client-side hydration with reactive state
 * - Ensure type-safe mock data flows through the component tree
 * - Test E2E pipeline resilience without external dependencies
 *
 * @iso_compliance
 * - ISO/IEC 29119-1:2013 - Software Testing Standards (Test Process)
 * - ISO/IEC 25010:2011 - Software Quality Requirements (Functional Suitability)
 *
 * @module tests/e2e/home-mock.spec
 * @requires @playwright/test
 * @requires @/lib/mocks.generated
 * @version 1.0.1
 * @since 2025-12-04
 */

import { test, expect, type Page } from "@playwright/test";
import { MockFactory } from "@/lib/mocks.generated";
import { mockGlobalSettings } from "./global-mock-setup";
import type { FeatureGridBlok, FeatureBlok } from "@/types/generated/storyblok";

// ============================================================================
// DYNAMIC FIXTURE GENERATION
// ============================================================================

/**
 * @constant DYNAMIC_HEADLINE
 * @description Expected headline value for test assertion validation
 *
 * @usage
 * This constant serves as the single source of truth for the expected
 * headline value. It's used both in fixture generation and test assertions.
 *
 * @critical
 * This value MUST match the headline property of the mockGrid object.
 */
const DYNAMIC_HEADLINE = "Dynamic QA Success!";

/**
 * @section Nested_Block_Generation
 * @description Generate child components (FeatureBlok) for the grid's columns
 *
 * @pattern
 * Use MockFactory to generate type-safe, valid Storyblok components.
 * Override only the fields necessary for test clarity.
 *
 * @note
 * DO NOT override the 'component' field - it's already set correctly
 * by the factory and is typed as a literal constant.
 */

/**
 * @fixture mockFeature1
 * @description First column in the feature grid
 * @type {FeatureBlok}
 */
const mockFeature1: FeatureBlok = MockFactory.feature({
  headline: "Feature 1 (Mock)",
  description: "First feature description for testing",
  // component is already set to "feature" by factory - don't override
});

/**
 * @fixture mockFeature2
 * @description Second column in the feature grid
 * @type {FeatureBlok}
 */
const mockFeature2: FeatureBlok = MockFactory.feature({
  headline: "Feature 2 (Mock)",
  description: "Second feature description for testing",
  // component is already set to "feature" by factory - don't override
});

/**
 * @section Main_Grid_Generation
 * @description Build the parent FeatureGridBlok with nested columns
 *
 * @data_structure
 * FeatureGridBlok {
 *   headline: string,       // ← This is what MockTester extracts
 *   description: string,    // ← This is what MockTester extracts
 *   columns: FeatureBlok[]  // ← Nested features (NOT extracted by MockTester)
 * }
 *
 * @critical
 * The test validates grid.headline, NOT columns[0].headline.
 * MockTester.svelte navigates to story.content.body[0] (the grid),
 * not to story.content.body[0].columns[0] (nested features).
 */

/**
 * @fixture mockGrid
 * @description Main FeatureGridBlok for the page body
 * @type {FeatureGridBlok}
 *
 * @properties
 * - headline: DYNAMIC_HEADLINE - Expected by test assertion
 * - description: Descriptive text for validation
 * - columns: Array of nested FeatureBlok components
 */
const mockGrid: FeatureGridBlok = MockFactory.feature_grid({
  headline: DYNAMIC_HEADLINE,
  description: "Content generated from MockFactory for reliable testing.",
  columns: [mockFeature1, mockFeature2],
  // component is already set to "feature_grid" by factory - don't override
});

/**
 * @section Story_Assembly
 * @description Assemble the complete Storyblok Story structure
 *
 * @structure
 * Story {
 *   name: string,
 *   content: PageBlok {
 *     component: "page",
 *     body: StoryblokComponent[],  // Contains mockGrid
 *     seo_title: string,
 *     seo_description: string
 *   },
 *   slug: string,
 *   full_slug: string
 * }
 *
 * @api_contract
 * This structure matches the Storyblok Content Delivery API v2 response format.
 *
 * @see {@link https://www.storyblok.com/docs/api/content-delivery/v2 | Storyblok API}
 */

/**
 * @fixture homeFixture
 * @description Complete Storyblok story response for mock interception
 * @type {Object}
 *
 * @fulfilled_by Playwright route interception in beforeEach hook
 * @consumed_by MockTester.svelte component via fetch("/_testing/api/story")
 */
interface HomeFixture {
  story: {
    name: string;
    content: {
      _uid: string;
      component: "page";
      body: FeatureGridBlok[];
      seo_title: string;
      seo_description: string;
    };
    slug: string;
    full_slug: string;
  };
}

const homeFixture: HomeFixture = {
  story: {
    name: "Home",
    content: {
      _uid: "test-page-uid-456",
      component: "page",
      body: [mockGrid],
      seo_title: DYNAMIC_HEADLINE,
      seo_description: "Dynamic test data for E2E validation.",
    },
    slug: "home",
    full_slug: "home",
  },
};

// ============================================================================
// TEST SUITE: QA Pipeline Resilience
// ============================================================================

/**
 * @test_suite QA_Pipeline_Resilience
 * @description Validates end-to-end mock interception and rendering pipeline
 *
 * @test_strategy
 * - Use beforeEach to set up route interceptions
 * - Mock both global settings and page-specific API calls
 * - Wait for deterministic status indicators before assertions
 * - Validate content matches expected fixture data
 *
 * @isolation
 * Each test runs in isolation with fresh page context and route mocks.
 * No external API dependencies - fully deterministic execution.
 */
test.describe("QA Pipeline Resilience (Dynamic Mocks)", () => {
  /**
   * @hook beforeEach
   * @description Set up route interceptions for each test
   *
   * @param {Page} page - Playwright page object
   *
   * @setup_steps
   * 1. Mock global settings (prevents 404 from layout)
   * 2. Mock test API endpoint (provides fixture data)
   *
   * @critical
   * Both mocks MUST be in place before navigation.
   * Order matters: global settings first, then page-specific mocks.
   */
  test.beforeEach(async ({ page }: { page: Page }) => {
    /**
     * @mock Global_Settings
     * @description Intercept Layout's config/global-settings fetch
     *
     * @prevents 404 error in header/footer navigation
     * @provides Minimal valid structure for layout components
     *
     * @see tests/e2e/global-mock-setup.ts
     */
    await mockGlobalSettings(page);

    /**
     * @mock Test_API_Endpoint
     * @description Intercept MockTester's client-side fetch
     *
     * @intercepts /_testing/api/story
     * @returns homeFixture with FeatureGridBlok structure
     *
     * @critical
     * This is the PRIMARY mock that validates the test's assertion.
     * The route pattern must match exactly what MockTester fetches.
     *
     * @route_pattern
     * /_testing/api/story - Matches any domain/path ending with this
     */
    await page.route("**/_testing/api/story", async (route) => {
      console.log("✅ Playwright: Intercepted test API request!");

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        json: homeFixture,
      });
    });
  });

  /**
   * @test Client_Side_Hydration
   * @description Verifies that Svelte component correctly processes mocked data
   *
   * @validation_points
   * 1. Component container appears in DOM
   * 2. Fetch completes successfully (status = "success")
   * 3. Headline element is visible
   * 4. Headline text matches DYNAMIC_HEADLINE
   *
   * @synchronization
   * Uses data-fetch-status attribute to wait for async operation.
   * This prevents race conditions and flaky tests.
   *
   * @assertion_target
   * Tests that MockTester extracts grid.headline, NOT columns[0].headline
   *
   * @expected_behavior
   * - Headline should be: "Dynamic QA Success!"
   * - Should NOT be: "Feature 1 (Mock)"
   */
  test("Client-side hydration renders using dynamically mocked data", async ({
    page,
  }: {
    page: Page;
  }) => {
    /**
     * @step Navigation
     * @description Navigate to the mock viewer page
     *
     * @url /mock-viewer/
     * @renders MockTester component with client:load directive
     */
    await page.goto("/mock-viewer/");

    /**
     * @step Wait_For_Container
     * @description Ensure component mounted and rendered to DOM
     *
     * @locator data-testid="mock-container"
     * @timeout Default (30000ms)
     */
    const container = page.getByTestId("mock-container");
    await expect(container).toBeVisible();

    /**
     * @step Wait_For_Fetch_Completion
     * @description Wait for async fetch to complete successfully
     *
     * @critical
     * This is the key synchronization point. The test MUST wait for
     * data-fetch-status="success" before asserting content.
     *
     * @states
     * - "idle": Component just mounted
     * - "loading": Fetch in progress
     * - "success": Data fetched and parsed ← WAIT FOR THIS
     * - "error": Fetch failed
     *
     * @timeout 15000ms - Generous timeout for CI/CD environments
     *
     * @rationale
     * Client-side fetch is asynchronous. Without this wait, the test
     * could attempt to read content before it's populated, causing
     * intermittent failures.
     */
    await expect(container).toHaveAttribute("data-fetch-status", "success", {
      timeout: 15000,
    });

    /**
     * @step Validate_Headline_Visibility
     * @description Ensure headline element rendered to DOM
     *
     * @locator data-testid="mock-headline"
     */
    const headline = page.getByTestId("mock-headline");
    await expect(headline).toBeVisible();

    /**
     * @step Assert_Headline_Content
     * @description Validate headline text matches expected value
     *
     * @expected DYNAMIC_HEADLINE ("Dynamic QA Success!")
     * @not_expected "Feature 1 (Mock)" (would indicate wrong data extraction)
     *
     * @critical_fix
     * This assertion validates that MockTester extracts data from:
     * story.content.body[0].headline (grid's headline) ✅
     *
     * NOT from:
     * story.content.body[0].columns[0].headline (feature's headline) ❌
     */
    await expect(headline).toHaveText(DYNAMIC_HEADLINE);

    /**
     * @log Success_Confirmation
     * @description Output confirmation for test reports
     */
    console.log("TEST PASSED: Dynamic mocked content rendered successfully.");
  });
});

/**
 * ============================================================================
 * TEST DOCUMENTATION
 * ============================================================================
 *
 * @test_execution
 * ```bash
 * # Run all E2E tests
 * pnpm test:e2e
 *
 * # Run only this test file
 * pnpm playwright test home-mock.spec.ts
 *
 * # Run with UI mode for debugging
 * pnpm playwright test --ui
 *
 * # Run with headed browser
 * pnpm playwright test --headed
 * ```
 *
 * @debugging
 * 1. Check console logs for "🧪 MockTester:" messages
 * 2. Verify "✅ Playwright:" interception messages
 * 3. Inspect data-fetch-status attribute in browser DevTools
 * 4. Use Playwright trace viewer for detailed timeline:
 *    ```bash
 *    pnpm playwright show-trace trace.zip
 *    ```
 *
 * @common_failures
 *
 * 1. "Expected 'Dynamic QA Success!' but got 'Feature 1 (Mock)'"
 *    - Root Cause: MockTester navigating to wrong data level
 *    - Fix: Ensure extraction uses body[0], not body[0].columns[0]
 *
 * 2. "Timeout waiting for data-fetch-status='success'"
 *    - Root Cause: Route interception not working
 *    - Fix: Verify route pattern matches fetch URL exactly
 *
 * 3. "Element not found: mock-headline"
 *    - Root Cause: Component not hydrating
 *    - Fix: Check client:load directive in mock-viewer.astro
 *
 * @related_files
 * - src/components/dev/MockTester.svelte - Component under test
 * - tests/e2e/global-mock-setup.ts - Global settings mock
 * - lib/mocks.generated.ts - MockFactory implementation
 * - types/generated/storyblok.d.ts - Type definitions
 * - src/pages/mock-viewer.astro - Test page
 *
 * @ci_cd_integration
 * This test runs in CI/CD pipelines to validate:
 * - Build-time type safety
 * - Runtime mock interception
 * - Component hydration correctness
 * - E2E pipeline resilience
 *
 * @version_history
 * - v1.0.0 (2025-12-04): Initial implementation
 * - v1.0.1 (2025-12-04): Fixed data structure navigation bug
 */
