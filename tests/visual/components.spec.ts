import { test, expect } from '@playwright/test';

/**
 * @file Visual Component Library Verification
 * @module tests/visual/components
 * @classification Internal
 * @compliance ISO 9241-11 (Usability) - Visual Consistency
 * * @description
 * Iterates through isolated component development routes to generate
 * "Golden Master" visual baselines.
 * * @traceability
 * - Epic 2: Visual Regression
 * - Req-UI-001: Component Visual Integrity
 */

// Define the critical components to snapshot
// These map to the routes created in src/pages/dev/*
const COMPONENTS = [
  { name: 'Hero SaaS', path: '/dev/hero-saas' },
  { name: 'Hero Local', path: '/dev/hero-local' },
  { name: 'Hero Consultant', path: '/dev/hero-consultant' },
  { name: 'Feature Grid', path: '/dev/feature-grid' },
  { name: 'Feature Alternating', path: '/dev/feature-alternating' },
  { name: 'Pricing Table', path: '/dev/pricing-table' },
  { name: 'Logo Cloud', path: '/dev/logo-cloud' },
  { name: 'Testimonial Slider', path: '/dev/testimonial-slider' },
  { name: 'Contact Form', path: '/dev/contact-form' },
  { name: 'Request Quote', path: '/dev/request-quote' },
];

test.describe('Visual Component Library', () => {
  
  for (const component of COMPONENTS) {
    test(`snapshot: ${component.name}`, async ({ page }) => {
      // 1. Navigate to the isolated dev route
      await page.goto(component.path);

      // 2. Wait for hydration/network settling
      // Using 'networkidle' ensures images/fonts are loaded
      await page.waitForLoadState('networkidle');

      // 3. Take Full Page Snapshot
      // This establishes the "Golden Master" for this component
      await expect(page).toHaveScreenshot(`${component.name.toLowerCase().replace(/\s+/g, '-')}.png`, {
        fullPage: true,
        mask: [page.locator('.img-loading')] // Mask elements that might have non-deterministic loading states
      });
    });
  }
});
