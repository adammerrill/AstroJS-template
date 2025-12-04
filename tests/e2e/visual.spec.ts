/**
 * @file visual.spec.ts
 * @description Performs pixel-perfect comparisons of critical UI paths using Playwright's visual regression tools.
 * Uses strict selector matching and isolated mocking for deterministic results.
 *
 * @purpose
 * - Validate visual consistency across deployments
 * - Detect unintended UI regressions
 * - Ensure cross-browser rendering parity
 * - Provide deterministic snapshots via content mocking
 *
 * @architecture
 * - Uses OFFLINE MODE to force fixture usage at server level
 * - Blocks external network calls (Storyblok editor, dev tools)
 * - Disables animations and transitions for stability
 * - Waits for fonts and network idle before capturing
 *
 * @critical_insight
 * Visual tests must use OFFLINE MODE because:
 * 1. Astro SSR happens on the server (Node.js) - Playwright can't intercept
 * 2. Playwright route mocks only work for browser/client requests
 * 3. The page content is rendered during SSR, not in the browser
 *
 * Solution: Run tests without STORYBLOK_DELIVERY_API_TOKEN to force
 * getSafeStory() to use LOCAL_FIXTURES (storyblok-home.json)
 *
 * @iso_compliance
 * - ISO/IEC 25010:2011 - Software Quality (Visual Regression)
 * - ISO/IEC 29119-4:2015 - Test Techniques (Visual Testing)
 *
 * @module tests/e2e/visual.spec
 * @version 2.3.0
 * @since 2025-12-04
 * @author Atom Merrill
 * @license MIT
 *
 * @see {@link https://playwright.dev/docs/test-snapshots | Playwright Snapshots}
 * @see {@link https://docs.astro.build/en/guides/server-side-rendering/ | Astro SSR}
 *
 * @changelog
 * - v2.3.0 (2025-12-04): Fixed viewport issues, separated desktop/mobile tests
 * - v2.2.0 (2025-12-04): Fixed to use OFFLINE MODE for SSR fixture usage
 * - v2.1.0 (2025-12-04): Attempted client-side route interception (failed for SSR)
 * - v2.0.0 (2025-12-04): Initial stabilization with content mocking
 */

import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ============================================================================
// ESM COMPATIBILITY - Manual __dirname Construction
// ============================================================================

/**
 * @description Reconstructs __dirname for ESM modules
 * @rationale ESM modules don't have __dirname by default
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// FIXTURE LOADING - Deterministic Content Source
// ============================================================================

/**
 * @constant fixturePath
 * @description Absolute path to the home page fixture
 */
const fixturePath: string = path.resolve(
  __dirname,
  "../fixtures/storyblok-home.json",
);

/**
 * @constant homeFixture
 * @description Parsed JSON fixture for the home page
 *
 * @structure
 * {
 *   story: {
 *     name: "Home",
 *     content: {
 *       component: "page",
 *       body: [
 *         {
 *           component: "feature_grid",
 *           headline: "Deterministic QA",  // ← This is what we're validating
 *           description: "...",
 *           columns: [...]
 *         }
 *       ]
 *     }
 *   }
 * }
 *
 * @validation
 * Verified to contain "Deterministic QA" text in:
 * - story.content.body[0].headline (feature_grid)
 * - story.content.body[0].columns[0].headline (first feature)
 *
 * @rationale
 * Using fs.readFileSync instead of ESM import to avoid "type: json" assertion errors.
 * This ensures compatibility across different Node.js versions.
 */
interface HomeFixture {
  story: {
    name: string;
    content: {
      component: string;
      body: Array<{
        component: string;
        headline: string;
        description: string;
        columns: Array<{
          component: string;
          headline: string;
          description: string;
        }>;
      }>;
    };
  };
}

const homeFixture: HomeFixture = JSON.parse(
  fs.readFileSync(fixturePath, "utf-8"),
);

// ============================================================================
// VALIDATION - Ensure Fixture Contains Expected Content
// ============================================================================

/**
 * @validation Pre-Test_Fixture_Verification
 * @description Validates that the fixture contains the expected content
 *
 * @throws {Error} If fixture doesn't contain "Deterministic QA"
 */
if (!JSON.stringify(homeFixture).includes("Deterministic QA")) {
  throw new Error(
    "FIXTURE VALIDATION FAILED: storyblok-home.json must contain 'Deterministic QA' text. " +
      "This is required for visual regression test assertions.",
  );
}

// ============================================================================
// TEST SUITE - Visual Regression Testing
// ============================================================================

/**
 * @test_suite Visual_Regression
 * @description Captures deterministic visual snapshots of key pages and components
 *
 * @offline_mode_requirement
 * CRITICAL: These tests MUST run with STORYBLOK_DELIVERY_API_TOKEN unset.
 *
 * @why_offline_mode
 * 1. Astro performs Server-Side Rendering (SSR) in Node.js
 * 2. getSafeStory() is called during SSR to fetch page content
 * 3. Playwright route.intercept() only works for BROWSER requests
 * 4. Node.js/server requests cannot be intercepted by Playwright
 * 5. Therefore, we must force getSafeStory() to use LOCAL_FIXTURES
 *
 * @configuration
 * Ensure playwright.config.ts webServer command does NOT set the token:
 * ```typescript
 * webServer: {
 *   command: "npm run dev",
 *   env: {
 *     STORYBLOK_DELIVERY_API_TOKEN: ""  // ✅ Empty string or unset
 *   }
 * }
 * ```
 *
 * @verification
 * Check server logs during test run:
 * - ✅ Expected: "[getSafeStory] OFFLINE MODE - serving fixture"
 * - ❌ Wrong: "[getSafeStory] Fetching slug: 'home'" (means API token is set)
 *
 * @test_strategy
 * 1. Server runs in OFFLINE MODE (no API token)
 * 2. getSafeStory() automatically uses LOCAL_FIXTURES
 * 3. Block external network noise (editor tools, analytics)
 * 4. Mock global settings for header/footer
 * 5. Disable temporal variance (animations, transitions)
 * 6. Wait for rendering stability (fonts, network idle)
 * 7. Assert deterministic content before snapshot
 * 8. Capture pixel-perfect screenshots
 *
 * @determinism_requirements
 * - Same viewport dimensions per test
 * - Same content from fixtures (via OFFLINE MODE)
 * - Same font rendering (await document.fonts.ready)
 * - No animations or transitions
 * - No external network calls
 */
test.describe("Visual Regression", () => {
  /**
   * @hook beforeEach
   * @description Setup harness for visual stability and deterministic rendering
   *
   * @param {Page} page - Playwright page object
   * @param {BrowserContext} context - Browser context for route interception
   *
   * @setup_sequence
   * 1. Verify server is running in OFFLINE MODE
   * 2. Block external noise sources
   * 3. Mock global settings (nav/footer)
   * 4. Disable CSS animations and transitions
   *
   * @note
   * We do NOT mock the home page content here because:
   * - Content is already rendered during SSR via OFFLINE MODE
   * - Playwright cannot intercept server-side Node.js requests
   * - The HTML arrives at the browser already containing fixture content
   */
  test.beforeEach(
    async ({ page, context }: { page: Page; context: BrowserContext }) => {
      /**
       * @section External_Noise_Blocking
       * @description Prevent network flakiness and UI clutter
       *
       * @rationale
       * These requests can cause visual variance:
       * - Storyblok visual editor injects UI overlays
       * - Dev toolbar adds debugging elements
       * - External scripts can modify layout
       */

      // Block Storyblok editor tools and visual editor bridge
      await context.route("**/@storyblok/**", (route) => route.abort());
      await context.route("**/bridge.js*", (route) => route.abort());
      await context.route("**/storyblok-js-client*", (route) => route.abort());
      await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
        route.abort(),
      );

      // Block Astro dev toolbar
      await context.route("**/__astro_dev_toolbar__**", (route) =>
        route.abort(),
      );

      // Block any remaining Storyblok API calls (belt-and-suspenders)
      await context.route("**/api.storyblok.com/**", (route) => route.abort());
      await context.route("**/api-us.storyblok.com/**", (route) =>
        route.abort(),
      );

      /**
       * @section Global_Settings_Mock
       * @description Ensures header/footer content is static
       *
       * @prevents 404 errors from missing config/global-settings
       * @provides Minimal valid structure for layout components
       *
       * @note
       * This mock IS necessary because global settings are fetched
       * on every page load and we want to ensure deterministic nav/footer.
       */
      await mockGlobalSettings(page);

      /**
       * @section Animation_Suppression
       * @description Removes temporal variance from snapshots
       *
       * @suppresses
       * - CSS animations (duration, delay)
       * - CSS transitions (duration, delay)
       * - Blinking cursors (caret-color)
       *
       * @rationale
       * Visual regression tests must be deterministic.
       * Any temporal variance (animations, fades, blinks) causes false positives.
       *
       * @technique
       * Injects global CSS that overrides all animation/transition properties.
       * Uses !important to ensure it takes precedence over component styles.
       */
      await page.addStyleTag({
        content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          caret-color: transparent !important;
        }
      `,
      });
    },
  );

  /**
   * @test Homepage_Visual_Snapshot_Desktop
   * @description Captures a full-page desktop snapshot of the homepage
   *
   * @viewport 1280x800 (Standard desktop)
   * @tolerance 2% (maxDiffPixelRatio: 0.02)
   * @project chromium (desktop only)
   *
   * @validation_steps
   * 1. Set standard viewport dimensions
   * 2. Navigate to home page (SSR content already contains fixture data)
   * 3. Wait for network idle (all resources loaded)
   * 4. Wait for fonts to load (no FOUT)
   * 5. Assert deterministic content is visible
   * 6. Capture full-page screenshot
   *
   * @critical_assertion
   * The "Deterministic QA" text MUST be visible before snapshot.
   * This validates that:
   * - Server is running in OFFLINE MODE
   * - getSafeStory() used LOCAL_FIXTURES
   * - SSR rendered the fixture content correctly
   *
   * @failure_diagnosis
   * If "Deterministic QA" is not found:
   * 1. Check server logs for "[getSafeStory] OFFLINE MODE"
   * 2. If you see "[getSafeStory] Fetching slug" instead, the API token is set
   * 3. Verify STORYBLOK_DELIVERY_API_TOKEN is NOT in your environment
   * 4. Check playwright.config.ts webServer.env doesn't set the token
   */
  test("Homepage visual snapshot (desktop)", async ({
    page,
  }: {
    page: Page;
  }) => {
    /**
     * @step Set_Desktop_Viewport
     * @description Force standard desktop dimensions for consistency
     *
     * @dimensions 1280x800
     * @rationale Common desktop resolution, balances detail vs file size
     */
    await page.setViewportSize({ width: 1280, height: 800 });

    /**
     * @step Navigate
     * @description Navigate to home page
     *
     * @note
     * At this point, the HTML has already been rendered by Astro SSR
     * using the LOCAL_FIXTURES (because OFFLINE MODE is active).
     * The browser receives pre-rendered HTML with "Deterministic QA" text.
     */
    await page.goto("/");

    /**
     * @step Wait_Network_Idle
     * @description Ensures all hydration scripts and resources are loaded
     *
     * @timeout Default (30000ms)
     * @state 'networkidle' - No more than 0 network connections for 500ms
     *
     * @rationale
     * Even though content is pre-rendered, we need to wait for:
     * - JavaScript hydration
     * - CSS loading
     * - Font loading (separate step below)
     * - Image loading
     */
    await page.waitForLoadState("networkidle");

    /**
     * @step Wait_Fonts_Load
     * @description Ensures no FOUT (Flash of Unstyled Text)
     *
     * @critical
     * Font loading affects:
     * - Text dimensions and line breaks
     * - Layout shifts
     * - Text rendering quality
     *
     * Must wait for document.fonts.ready before snapshot to ensure
     * identical rendering across test runs.
     */
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    /**
     * @step Guard_Clause_Assertion
     * @description Verify deterministic content is present
     *
     * @assertion
     * The text "Deterministic QA" MUST be visible.
     * This comes from storyblok-home.json fixture.
     *
     * @expected_location
     * - story.content.body[0].headline (feature_grid component)
     * - story.content.body[0].columns[0].headline (first feature)
     *
     * @failure_modes
     *
     * 1. "Element not found: Deterministic QA"
     *    → Server is NOT in OFFLINE MODE
     *    → Check: STORYBLOK_DELIVERY_API_TOKEN is unset
     *    → Check: Server logs show "OFFLINE MODE"
     *
     * 2. "Element found but not visible"
     *    → CSS issue (display:none, visibility:hidden)
     *    → Check component rendering logic
     *
     * 3. "Timeout waiting for element"
     *    → SSR failed or page didn't load
     *    → Check server is running
     *    → Check navigation didn't error
     *
     * @debugging
     * Add this before the assertion to see what content exists:
     * ```typescript
     * const bodyText = await page.textContent('body');
     * console.log('Page body text:', bodyText);
     * ```
     */
    const deterministicContent = page.getByText("Deterministic QA").first();

    await expect(deterministicContent).toBeVisible({
      timeout: 10000, // Extended timeout for CI environments
    });

    console.log("✅ Deterministic content verified - proceeding with snapshot");

    /**
     * @step Capture_Snapshot
     * @description Take pixel-perfect screenshot
     *
     * @options
     * - maxDiffPixelRatio: 0.02 (2% tolerance for anti-aliasing)
     * - fullPage: true (capture entire scrollable page)
     * - timeout: 30000 (extended for large screenshots)
     *
     * @baseline_location
     * tests/e2e/visual.spec.ts-snapshots/homepage-desktop-chromium-darwin.png
     *
     *
     * @update_baseline
     * ```bash
     * pnpm playwright test visual.spec.ts --update-snapshots
     * ```
     *
     * @tolerance_rationale
     * 2% tolerance accounts for:
     * - Font anti-aliasing differences across platforms
     * - Sub-pixel rendering variations
     * - Minor browser rendering differences
     *
     * Higher tolerance would risk missing real regressions.
     */
    await expect(page).toHaveScreenshot("homepage-desktop.png", {
      maxDiffPixelRatio: 0.02,
      fullPage: true,
      timeout: 30000,
    });

    console.log("✅ Homepage desktop snapshot captured successfully");
  });

  /**
   * @test Homepage_Visual_Snapshot_Mobile
   * @description Captures a full-page mobile snapshot of the homepage
   *
   * @viewport 393x1438 (Mobile Chrome - Pixel 5)
   * @tolerance 3% (maxDiffPixelRatio: 0.03)
   * @project mobile-chrome only
   *
   * @rationale
   * Mobile rendering can differ from desktop:
   * - Different layouts (responsive design)
   * - Different font sizes
   * - Touch-optimized UI elements
   * - Mobile-specific components (hamburger menu, etc.)
   *
   * This test validates the mobile experience separately.
   */
  test("Homepage visual snapshot (mobile)", async ({
    page,
  }: {
    page: Page;
  }) => {
    /**
     * @step Set_Mobile_Viewport
     * @description Set mobile dimensions matching Pixel 5
     *
     * @dimensions 393x1438
     * @device Pixel 5 (configured in playwright.config.ts)
     */
    await page.setViewportSize({ width: 393, height: 1438 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // Verify deterministic content
    const deterministicContent = page.getByText("Deterministic QA").first();
    await expect(deterministicContent).toBeVisible({
      timeout: 10000,
    });

    console.log(
      "✅ Deterministic content verified (mobile) - proceeding with snapshot",
    );

    /**
     * @step Capture_Mobile_Snapshot
     * @description Capture full-page mobile screenshot
     *
     * @tolerance 3% (slightly higher for mobile rendering variations)
     */
    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      maxDiffPixelRatio: 0.03,
      fullPage: true,
      timeout: 30000,
    });

    console.log("✅ Homepage mobile snapshot captured successfully");
  });

  /**
   * @test Mobile_Header_Visual_Snapshot
   * @description Captures a snapshot of the fixed header on a mobile viewport
   *
   * @viewport 375x812 (iPhone 12/13/14)
   * @tolerance 3% (maxDiffPixelRatio: 0.03)
   *
   * @scope Component-level (header only, not full page)
   *
   * @rationale
   * Mobile rendering can have subtle differences:
   * - Font smoothing algorithms
   * - Pixel density (retina displays)
   * - Touch target sizing
   *
   * Slightly higher tolerance (3%) accounts for these platform variations
   * while still catching real regressions.
   *
   * @component_isolation
   * Testing header in isolation provides:
   * - Faster test execution (smaller screenshot)
   * - More focused regression detection
   * - Easier to identify which component regressed
   */
  test("Mobile header visual snapshot", async ({ page }: { page: Page }) => {
    /**
     * @step Set_Mobile_Viewport
     * @description Common mobile viewport size (iPhone 12/13/14 equivalent)
     *
     * @dimensions 375x812
     * @rationale Represents ~40% of mobile web traffic
     */
    await page.setViewportSize({ width: 375, height: 812 });

    /**
     * @step Navigate_And_Wait
     * @description Standard navigation and stability wait sequence
     */
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    /**
     * @step Verify_Header_Exists
     * @description Ensure header component is in DOM before snapshot
     *
     * @selector #main-header
     * @rationale
     * - Direct ID selector is most performant
     * - Specific enough to avoid false positives
     * - Matches the actual header component ID
     *
     * @failure_modes
     * 1. "Element not found: #main-header"
     *    → Header component didn't render
     *    → Check Layout.astro includes Header
     *    → Check Header.svelte/astro exists
     *
     * 2. "Element found but not visible"
     *    → CSS issue or mobile-specific hiding
     *    → Check responsive CSS rules
     */
    const header = page.locator("#main-header");
    await expect(header).toBeVisible({
      timeout: 10000,
    });

    console.log("✅ Mobile header verified - proceeding with snapshot");

    /**
     * @step Capture_Component_Snapshot
     * @description Capture only the header element
     *
     * @advantages
     * - Faster execution (smaller screenshot)
     * - More focused regression detection
     * - Isolates header changes from page content changes
     *
     * @tolerance
     * 3% (slightly higher for mobile rendering variations)
     */
    await expect(header).toHaveScreenshot("header-mobile.png", {
      maxDiffPixelRatio: 0.03,
      timeout: 30000,
    });

    console.log("✅ Mobile header snapshot captured successfully");
  });
});

/**
 * ============================================================================
 * TEST EXECUTION GUIDE
 * ============================================================================
 *
 * @prerequisite OFFLINE MODE Configuration
 *
 * CRITICAL: Ensure your playwright.config.ts webServer does NOT set
 * STORYBLOK_DELIVERY_API_TOKEN. The server must run in OFFLINE MODE.
 *
 * ✅ Correct Configuration:
 * ```typescript
 * webServer: {
 *   command: "npm run dev",
 *   env: {
 *     STORYBLOK_DELIVERY_API_TOKEN: ""  // ✅ Empty string
 *   }
 * }
 * ```
 *
 * @first_time_setup
 *
 * When running these tests for the FIRST TIME, you need to generate baselines:
 *
 * ```bash
 * # Generate initial baseline snapshots
 * pnpm playwright test visual.spec.ts --update-snapshots
 *
 * # This creates:
 * # - tests/e2e/visual.spec.ts-snapshots/homepage-desktop-chromium-darwin.png
 * # - tests/e2e/visual.spec.ts-snapshots/homepage-mobile-mobile-chrome-darwin.png
 * # - tests/e2e/visual.spec.ts-snapshots/header-mobile-chromium-darwin.png
 * # - tests/e2e/visual.spec.ts-snapshots/header-mobile-mobile-chrome-darwin.png
 * ```
 *
 * After generating baselines, commit them to version control:
 * ```bash
 * git add tests/e2e/visual.spec.ts-snapshots/
 * git commit -m "Add visual regression test baselines"
 * ```
 *
 * @verification_checklist
 *
 * Before running tests, verify:
 *
 * 1. ✅ Fixture contains expected content:
 *    ```bash
 *    cat tests/fixtures/storyblok-home.json | grep "Deterministic QA"
 *    ```
 *
 * 2. ✅ Server runs in OFFLINE MODE:
 *    ```bash
 *    unset STORYBLOK_DELIVERY_API_TOKEN
 *    npm run dev
 *    # Check logs for: "[getSafeStory] OFFLINE MODE"
 *    ```
 *
 * 3. ✅ Playwright config doesn't set token:
 *    ```bash
 *    grep -A5 "webServer:" playwright.config.ts | grep STORYBLOK
 *    # Should show: STORYBLOK_DELIVERY_API_TOKEN: ""
 *    ```
 *
 * @test_commands
 *
 * ```bash
 * # FIRST TIME: Generate baselines
 * pnpm playwright test visual.spec.ts --update-snapshots
 *
 * # Run visual regression tests (compare against baselines)
 * pnpm test:e2e visual.spec.ts
 *
 * # Update baselines after intentional UI changes
 * pnpm playwright test visual.spec.ts --update-snapshots
 *
 * # Run with UI mode for debugging
 * pnpm playwright test visual.spec.ts --ui
 *
 * # Run headed to see browser
 * pnpm playwright test visual.spec.ts --headed
 *
 * # Run with debug logging
 * DEBUG=pw:api pnpm playwright test visual.spec.ts
 * ```
 *
 * @debugging_guide
 *
 * Problem: "Deterministic QA not found"
 *
 * Step 1: Check server logs
 * ```bash
 * # In test output, look for:
 * [WebServer] [getSafeStory] OFFLINE MODE - serving fixture for "home"
 * # If you see this instead, API token is set:
 * [WebServer] [getSafeStory] Fetching slug: "home"
 * ```
 *
 * Step 2: Verify environment
 * ```bash
 * echo $STORYBLOK_DELIVERY_API_TOKEN  # Should be empty
 * ```
 *
 * Step 3: Check fixture content
 * ```bash
 * cat tests/fixtures/storyblok-home.json | jq '.story.content.body[0].headline'
 * # Should output: "Deterministic QA"
 * ```
 *
 * Step 4: Inspect rendered page
 * ```typescript
 * // Add this in the test before assertion:
 * const bodyText = await page.textContent('body');
 * console.log('Page content:', bodyText);
 * ```
 *
 * @common_failures
 *
 * 1. "Expected image XxY, received AxB"
 *    - Root Cause: Baseline doesn't exist or was created with different content
 *    - Fix: Run with --update-snapshots to regenerate baselines
 *    - Verify: Check that new content is visually correct before committing
 *
 * 2. "Screenshot comparison failed"
 *    - Root Cause: Intentional or unintentional visual change
 *    - Fix: Review diff image in test-results/
 *    - Decision: Update baseline if change is intentional, fix code if not
 *
 * 3. "Deterministic QA not found" (solved!)
 *    - Root Cause: Server had API token set, fetching from live API
 *    - Fix: Unset STORYBLOK_DELIVERY_API_TOKEN in environment
 *    - Verify: Check server logs for "OFFLINE MODE"
 *
 * @baseline_management
 *
 * Baselines stored in: tests/e2e/visual.spec.ts-snapshots/
 * - homepage-desktop-chromium-darwin.png
 * - homepage-mobile-mobile-chrome-darwin.png
 * - header-mobile-chromium-darwin.png
 * - header-mobile-mobile-chrome-darwin.png
 *
 * Update workflow:
 * 1. Make intentional UI change
 * 2. Review change in browser manually
 * 3. Run: pnpm playwright test visual.spec.ts --update-snapshots
 * 4. Review generated diff images to ensure changes are correct
 * 5. Commit new baseline images to version control
 *
 * @ci_cd_integration
 *
 * CI environment requirements:
 * - Must NOT set STORYBLOK_DELIVERY_API_TOKEN (or set to "")
 * - Must have deterministic font rendering
 * - Must have stable viewport dimensions
 * - Must have fixture files in tests/fixtures/
 * - Must have baseline snapshots committed to repo
 *
 * GitHub Actions example:
 * ```yaml
 * - name: Run Visual Tests
 *   run: pnpm test:e2e visual.spec.ts
 *   env:
 *     # Explicitly ensure token is NOT set
 *     STORYBLOK_DELIVERY_API_TOKEN: ""
 * ```
 *
 * @related_files
 * - tests/e2e/global-mock-setup.ts - Global settings mock
 * - tests/fixtures/storyblok-home.json - Home page fixture
 * - src/lib/storyblok.ts - API client with OFFLINE MODE
 * - playwright.config.ts - Test configuration
 * - src/layouts/Layout.astro - Page layout using getSafeStory
 *
 * @version_history
 * - v2.3.0 (2025-12-04): Fixed viewport issues, separated desktop/mobile tests
 * - v2.2.0 (2025-12-04): Fixed to use OFFLINE MODE for SSR content
 * - v2.1.0 (2025-12-04): Attempted client-side interception (didn't work for SSR)
 * - v2.0.0 (2025-12-04): Initial implementation
 */
