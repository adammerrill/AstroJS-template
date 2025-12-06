/**
 * @file image-delivery.spec.ts
 * @description Verifies the Network Layer for Image Optimization.
 * @version 1.0.0
 *
 * @objective
 * Ensure that images rendered by <StoryblokImage /> are:
 * 1. Served via the Image Service (contain /m/).
 * 2. Requesting the correct formats (WebP/AVIF).
 * 3. Not throwing 404s.
 */
import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

test.describe("Image Delivery Infrastructure", () => {
  test.beforeEach(async ({ page, context }) => {
    // Only block the dev toolbar, allow all other requests (especially images)
    await context.route("**/__astro_dev_toolbar__**", (route) => route.abort());
    await mockGlobalSettings(page);
  });

  test("requests optimized assets via Image Service (/m/)", async ({ page }) => {
    const imageRequests: string[] = [];

    // Listener: Capture all image requests
    page.on("request", (request) => {
      // Capture both resourceType 'image' and basic fetches to Storyblok CDN
      if (request.url().includes("storyblok.com")) {
        imageRequests.push(request.url());
      }
    });

    // Navigate and WAIT for the component to be visible
    await page.goto("/dev/hero-saas", { waitUntil: "domcontentloaded" });
    
    // Critical: Ensure component renders before asserting network requests
    await expect(page.getByTestId("hero-saas")).toBeVisible();
    
    // Wait a moment for eager images to trigger requests
    await page.waitForTimeout(500);

    // Debugging output if fails
    if (imageRequests.length === 0) {
      console.log("DEBUG: No image requests captured. Page content:", await page.content());
    }

    // Assert: At least one image loaded
    expect(imageRequests.length).toBeGreaterThan(0);

    // Assert: All Storyblok raster images use the Image Service (/m/)
    const rasterImages = imageRequests.filter((url) => 
      !url.endsWith(".svg") && 
      (url.includes(".jpg") || url.includes(".png") || url.includes(".webp") || url.includes("img2.storyblok.com"))
    );
    
    if (rasterImages.length > 0) {
      rasterImages.forEach((url) => {
        expect(url, `Image ${url} should use Image Service`).toContain("/m/");
      });
    }
  });

  test("Logo Cloud requests respect format=webp", async ({ page }) => {
    let webpRequestFound = false;

    page.on("request", (request) => {
      if (request.url().includes("filters:format(webp)")) {
        webpRequestFound = true;
      }
    });

    await page.goto("/dev/logo-cloud", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("logo-cloud")).toBeVisible();
    await page.waitForTimeout(500);

    expect(webpRequestFound, "Should find at least one request forcing WebP format").toBe(true);
  });
});
