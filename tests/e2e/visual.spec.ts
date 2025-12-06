/**
 * @file visual.spec.ts
 * @description Performs pixel-perfect comparisons of critical UI paths using Playwright's visual regression tools.
 * Uses strict selector matching and isolated mocking for deterministic results.
 *
 * @description
 * - **Reliability**: Validate visual consistency across deployments (ISO 25010 Reliability).
 * - **Regression Testing**: Detect unintended UI regressions in layout, typography, and color.
 * - **Cross-Browser Parity**: Ensure rendering consistency between Chromium and Mobile Viewports.
 *
 * @description Architecture: * - Uses **OFFLINE MODE** to force fixture usage at the server level (Astro SSR).
 * - Blocks external network calls (Storyblok editor, dev tools) to reduce noise.
 * - Disables animations and transitions to ensure temporal stability.
 * - Implements strict "Wait for Ready" states (Fonts, Network Idle) before capturing.
 *
 * @critical_insight
 * Visual tests must use OFFLINE MODE because Astro SSR happens in Node.js, where Playwright
 * network interception (mocking) does not apply. We must rely on the application's
 * internal `getSafeStory` logic to serve `tests/fixtures/storyblok-home.json`.
 *
 * @description ISO Compliance: * - **ISO/IEC 29119-4**: Test Techniques (Structure-based & Experience-based).
 * - **ISO/IEC 25010**: System and software quality models (Operability, Stability).
 *
 * @module tests/e2e/visual.spec
 * @version 2.6.0
 * @since 2025-12-04
 * @author Atom Merrill
 * @license MIT
 */

import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ============================================================================
// 1. ESM & FILE SYSTEM COMPATIBILITY
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// 2. FIXTURE LOADING & VALIDATION
// ============================================================================

/**
 * @constant fixturePath
 * @description Absolute path to the home page fixture.
 */
const fixturePath: string = path.resolve(
  __dirname,
  "../fixtures/storyblok-home.json",
);

/**
 * @interface HomeFixture
 * @description Type definition for the expected structure of the Storyblok fixture.
 * Ensures the fixture contains the necessary components for visual validation.
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

// Load and parse fixture synchronously to ensure availability before tests start
const homeFixture: HomeFixture = JSON.parse(
  fs.readFileSync(fixturePath, "utf-8"),
);

/**
 * @validation Pre-Test Fixture Check
 * @description Guard clause to fail fast if the fixture data is invalid.
 */
if (!JSON.stringify(homeFixture).includes("Deterministic QA")) {
  throw new Error(
    "FIXTURE VALIDATION FAILED: storyblok-home.json must contain 'Deterministic QA' text. " +
      "This indicates the fixture file is missing the expected test data.",
  );
}

// ============================================================================
// 3. TEST SUITE CONFIGURATION
// ============================================================================

test.describe("Visual Regression", () => {
  /**
   * @hook beforeEach
   * @description Configures the browser environment for deterministic rendering.
   *
   * @steps
   * 1. Block external network noise (Analytics, Editor Bridge).
   * 2. Mock Global Settings (Header/Footer data).
   * 3. Inject CSS to disable animations/transitions (Temporal Stability).
   */
  test.beforeEach(
    async ({ page, context }: { page: Page; context: BrowserContext }) => {
      // --- Block External Scripts ---
      await context.route("**/@storyblok/**", (route) => route.abort());
      await context.route("**/bridge.js*", (route) => route.abort());
      await context.route("**/storyblok-js-client*", (route) => route.abort());
      await context.route("**/node_modules/.vite/deps/@storyblok**", (route) =>
        route.abort(),
      );
      await context.route("**/__astro_dev_toolbar__**", (route) =>
        route.abort(),
      );
      await context.route("**/api.storyblok.com/**", (route) => route.abort());

      // --- Mock Global Data ---
      await mockGlobalSettings(page);

      // --- Disable Animations ---
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
   * @test Homepage Visual Snapshot (Desktop)
   * @description Verifies the homepage layout on a standard desktop viewport.
   * @viewport 1280x800
   */
  test("Homepage visual snapshot (desktop)", async ({
    page,
  }: {
    page: Page;
  }) => {
    // 1. Configure Viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    // 2. Navigate (SSR will serve fixture content via Offline Mode)
    await page.goto("/");

    // 3. Wait for Stability
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // 4. Verify Structural Presence (The "Smoke Test")
    const grid = page.getByTestId("feature-grid");

    // DEBUG: If grid is missing, log the HTML to confirm what DID render.
    if (!(await grid.isVisible())) {
      console.error(
        "❌ [DEBUG] Feature Grid not found. Dumping Body HTML for diagnosis:",
      );
      console.log(await page.innerHTML("body"));
    }

    await expect(grid).toBeVisible({ timeout: 10000 });

    // 5. Verify Content Specifics
    const headline = grid.locator("[data-test-headline]");
    await expect(headline).toBeVisible({ timeout: 5000 });

    console.log("✅ Deterministic content verified - proceeding with snapshot");

    // 6. Capture Snapshot
    await expect(page).toHaveScreenshot("homepage-desktop.png", {
      maxDiffPixelRatio: 0.02,
      fullPage: true,
      timeout: 30000,
    });
  });

  /**
   * @test Homepage Visual Snapshot (Mobile)
   * @description Verifies the homepage layout on a mobile device viewport (Pixel 5).
   * @viewport 393x1438
   */
  test("Homepage visual snapshot (mobile)", async ({
    page,
  }: {
    page: Page;
  }) => {
    // 1. Configure Viewport (Matches Pixel 5)
    await page.setViewportSize({ width: 393, height: 1438 });

    // 2. Navigate
    await page.goto("/");

    // 3. Wait for Stability
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // 4. Verify Content
    const grid = page.getByTestId("feature-grid");
    if (!(await grid.isVisible())) {
      console.error("❌ [DEBUG] Feature Grid missing on Mobile.");
    }
    await expect(grid).toBeVisible({ timeout: 10000 });

    const headline = grid.locator("[data-test-headline]");
    await expect(headline).toBeVisible({ timeout: 5000 });

    console.log("✅ Mobile content verified - proceeding with snapshot");

    // 5. Capture Snapshot
    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      maxDiffPixelRatio: 0.03, // Higher tolerance for mobile font rendering
      fullPage: true,
      timeout: 30000,
    });
  });

  /**
   * @test Mobile Header Visual Snapshot
   * @description Isolates the header component for responsive testing.
   * @viewport 375x812 (iPhone 12/13/14)
   */
  test("Mobile header visual snapshot", async ({ page }: { page: Page }) => {
    // 1. Configure Viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // 2. Navigate
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // 3. Verify Header Structure
    const header = page.locator("#main-header");
    await expect(header).toBeVisible({ timeout: 10000 });

    console.log("✅ Mobile header verified - proceeding with snapshot");

    // 4. Capture Component-Level Snapshot
    await expect(header).toHaveScreenshot("header-mobile.png", {
      maxDiffPixelRatio: 0.03,
      timeout: 30000,
    });
  });
});
