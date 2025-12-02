/**
 * @file home-mock.spec.ts
 * @description Deterministic Mock Testing Strategy.
 * Validates that the CI pipeline can run independently of the live CMS
 * by intercepting all necessary API calls, including the Layout's Global Settings fetch.
 *
 * @module tests/e2e/home-mock.spec
 * @requires Playwright Page, Global Mock Setup
 * * ISO 8601:2004 - Mocking is confined to test execution context for deterministic QA.
 */

import { test, expect, type Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import { mockGlobalSettings } from "./global-mock-setup";

// ============================================================================
// FIXTURE LOAD
// ============================================================================

/**
 * Loads the Storyblok content fixture synchronously from the file system.
 * The parsed JSON data for the mock home page content.
 */
const fixturePath = path.join(
  process.cwd(),
  "tests/fixtures/storyblok-home.json",
);
const rawData: string = fs.readFileSync(fixturePath, "utf-8");
// Explicitly typing `homeFixture` is optional, but adds clarity.
const homeFixture: object = JSON.parse(rawData);

// ============================================================================
// TEST SUITE: QA Pipeline Resilience
// ============================================================================

test.describe("QA Pipeline Resilience", () => {
  /**
   * Sets up a mock for the Global Settings API call before each test.
   * This is necessary to ensure deterministic header/footer content.
   *
   */
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Intercept the Layout's global settings fetch to prevent live 404 errors.
    // This ensures deterministic header/footer content during the E2E test.
    await mockGlobalSettings(page);

    // Log ALL network requests to debug
    page.on("request", (request) =>
      console.log(">>", request.method(), request.url()),
    );
    page.on("response", (response) =>
      console.log("<<", response.status(), response.url()),
    );
  });

  /**
   * Tests that the component successfully fetches and renders content
   * using data provided by the Playwright network mock, validating
   * the client-side hydration process.
   *
   */
  test("Client-side hydration renders using mocked data", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Intercept the specific API call made by MockTester.svelte
    // This mock validates the component's data fetching logic.
    await page.route("https://api.mock-test.com/story", async (route) => {
      console.log("✅ Playwright: Intercepted the component API request!");
      await route.fulfill({ json: homeFixture });
    });

    // NOW navigate to the page containing the MockTester Svelte component
    await page.goto("/mock-viewer/");

    // Wait and assert that the content from the fixture (Deterministic QA) rendered.
    const headline = page.getByTestId("mock-headline");
    await expect(headline).toBeVisible({ timeout: 10000 });
    await expect(headline).toHaveText("Deterministic QA");

    console.log("TEST PASSED: Mocked content rendered successfully.");
  });
});
