/**
 * @file web-vitals.spec.ts
 * @description Performance Audit for Core Web Vitals (LCP, CLS).
 * @version 1.0.0
 *
 * @objective
 * Verify that the application meets Google's "Good" thresholds:
 * - Largest Contentful Paint (LCP): < 2.5s
 * - Cumulative Layout Shift (CLS): < 0.1
 *
 * @methodology
 * Uses the native PerformanceObserver API injected via Playwright to capture
 * real-time metrics during page load.
 */

import { test, expect } from "@playwright/test";
import { mockGlobalSettings } from "../e2e/global-mock-setup";

/**
 * @interface LayoutShiftEntry
 * @augments {PerformanceEntry}
 * @description Type definition for a specific Performance Entry (`layout-shift`)
 * that includes metrics required for CLS calculation, ensuring strict compliance.
 *
 * @property {boolean} [hadRecentInput] - Indicates if the shift followed a user input (omitted from CLS).
 * @property {number} value - The layout shift score value.
 */
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput?: boolean;
  value: number;
}

test.describe("Performance Audit", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure 404s don't skew performance (favicon/manifest/settings)
    await mockGlobalSettings(page);
  });

  test("Home Page meets Core Web Vitals thresholds", async ({ page }) => {
    // 1. Navigate to Home
    await page.goto("/", { waitUntil: "commit" });

    // 2. Inject Performance Observer to capture LCP and CLS
    const metrics = await page.evaluate(async () => {
      return new Promise<{ lcp: number; cls: number }>((resolve) => {
        let lcp = 0;
        let cls = 0;

        // Observer for LCP
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcp = lastEntry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        // Observer for CLS
        new PerformanceObserver((entryList) => {
          // FIX: Use explicit LayoutShiftEntry type assertion to resolve 'any' warnings.
          for (const entry of entryList.getEntries()) {
            const shiftEntry = entry as LayoutShiftEntry;
            if (!shiftEntry.hadRecentInput) {
              cls += shiftEntry.value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });

        // Wait for page to settle (network idle) to ensure LCP is final
        // In a real scenario, we might wait for a specific time or event
        setTimeout(() => {
          resolve({ lcp, cls });
        }, 2000); // 2s observation window
      });
    });

    console.log(`[Performance] LCP: ${metrics.lcp.toFixed(2)}ms`);
    console.log(`[Performance] CLS: ${metrics.cls.toFixed(4)}`);

    // 3. Assert Thresholds
    // LCP should be under 2500ms (Good)
    // Note: In a local mock env, this is extremely fast (<100ms), checking < 2500 ensures no regression.
    expect(metrics.lcp).toBeLessThan(2500);

    // CLS should be under 0.1 (Good)
    // Strict image dimensions in StoryblokImage should keep this near 0.
    expect(metrics.cls).toBeLessThan(0.1);
  });
});
