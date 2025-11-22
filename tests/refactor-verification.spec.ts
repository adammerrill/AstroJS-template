import { test, expect } from '@playwright/test';

test.describe('Stage 2 Refactor Verification', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Header should apply .header-glass class on scroll', async ({ page }) => {
    const header = page.locator('#main-header');
    
    // 1. Initial state: Transparent, no glass effect
    await expect(header).not.toHaveClass(/header-glass/);
    await expect(header).toHaveClass(/bg-transparent/);

    // 2. Action: Scroll down 50px to trigger the JS listener
    await page.mouse.wheel(0, 50);
    // Wait for the throttle/debounce or CSS transition if any
    await page.waitForTimeout(300); 

    // 3. Assert: Glass class applied (Refactor Success)
    await expect(header).toHaveClass(/header-glass/);
    
    // 4. Action: Scroll back to top
    await page.mouse.wheel(0, -50);
    await page.waitForTimeout(300);

    // 5. Assert: Glass class removed
    await expect(header).not.toHaveClass(/header-glass/);
  });

  test('Hero section should use new tokenized utilities', async ({ page }) => {
    // Verify the background image uses the new blur utility
    // Previous arbitrary value: blur-[100px] -> New: hero-background-blur
    const heroBg = page.locator('img.hero-background-blur');
    await expect(heroBg).toBeVisible();
    
    // Check computed style to confirm the token applied the correct CSS
    await expect(heroBg).toHaveCSS('filter', 'blur(100px)');

    // Verify the Hero Text uses the new sizing utility
    // Previous arbitrary value: text-[22px] -> New: text-hero-lead
    const heroText = page.locator('.text-hero-lead');
    await expect(heroText).toBeVisible();
    
    // Tailwind v4 variable resolution check
    // We expect the computed font-size to be ~22px (1.375rem)
    const fontSize = await heroText.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('font-size');
    });
    // Allow for small pixel differences depending on browser rendering
    expect(parseFloat(fontSize)).toBeCloseTo(22, 0); 
  });
});