/**
 * @fileoverview Deterministic Mock Testing Strategy
 * @description Validates that the CI pipeline can run independently of the live CMS.
 * Uses fs.readFileSync to bypass ESM JSON import issues.
 */

import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

// Load fixture synchronously
const fixturePath = path.join(
  process.cwd(),
  "tests/fixtures/storyblok-home.json",
);
const rawData = fs.readFileSync(fixturePath, "utf-8");
const homeFixture = JSON.parse(rawData);

test.describe("QA Pipeline Resilience", () => {
  test("Client-side hydration renders using mocked data", async ({ page }) => {
    // Log ALL network requests to debug
    page.on("request", (request) =>
      console.log(">>", request.method(), request.url()),
    );
    page.on("response", (response) =>
      console.log("<<", response.status(), response.url()),
    );

    // Intercept with CORRECT URL (no trailing space)
    await page.route("https://api.mock-test.com/story", async (route) => {
      console.log("✅ Playwright: Intercepted the request!");
      await route.fulfill({ json: homeFixture });
    });

    // NOW navigate
    await page.goto("/mock-viewer/");

    // Wait and assert
    const headline = page.getByTestId("mock-headline");
    await expect(headline).toBeVisible({ timeout: 10000 });
    await expect(headline).toHaveText("Deterministic QA");
  });
});
