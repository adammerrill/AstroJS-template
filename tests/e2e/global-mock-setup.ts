// tests/e2e/global-mock-setup.ts
/**
 * @fileoverview Global mock configuration for Playwright E2E tests.
 * @description Centralizes the routing logic for mocking Storyblok's global settings API
 * to ensure tests are deterministic and do not rely on external connectivity.
 *
 * @param {import("@playwright/test").Page} page - The current Playwright page object.
 */
import type { Page } from "@playwright/test";

// Mock response for config/global-settings (minimal valid structure)
const mockGlobalSettingsResponse = {
  story: {
    content: {
      _uid: "mock-settings-uid",
      component: "global-settings",
      // Defaulting these to empty arrays ensures Header/Footer use fallbacks/defaults safely
      header_nav: [],
      footer_columns: [],
      site_title: "MOCK SITE", // Add an obvious mock title for assertion visibility
      site_description: "Mocked description for E2E tests.",
    },
  },
};

/**
 * Applies a route mock to intercept the Storyblok global settings API call.
 * This prevents live 404 errors during test runs and ensures isolation.
 *
 */
export async function mockGlobalSettings(page: Page): Promise<void> {
  // Intercept the request to the global settings slug
  await page.route("**/config/global-settings*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockGlobalSettingsResponse),
    });
  });

  console.log("MOCK: Storyblok global settings mock successfully applied.");
}
