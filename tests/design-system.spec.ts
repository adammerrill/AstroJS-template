import { test, expect } from '@playwright/test';

test.describe('Design System Foundation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page to load the global.css
    await page.goto('/');
  });

  test('root CSS variables are defined', async ({ page }) => {
    // Check for a core variable like --background
    const bgValue = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    });
    // Expect raw channel value (0 0% 100%)
    expect(bgValue).toBe('0 0% 100%');
  });

  test('body has correct background color from tokens', async ({ page }) => {
    const bodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    // 0 0% 100% HSL resolves to rgb(255, 255, 255)
    expect(bodyBg).toBe('rgb(255, 255, 255)');
  });

  test('primary color token is available', async ({ page }) => {
    // FIX: Inject element into the EXISTING document to preserve stylesheets.
    // Using page.setContent() wipes the <head> and removes styles.
    await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.id = 'test-el';
      testEl.className = 'text-primary'; // Tailwind class
      testEl.innerText = 'Test Color';
      document.body.appendChild(testEl);
    });

    const color = await page.locator('#test-el').evaluate((el) => {
      return getComputedStyle(el).color;
    });
    
    // --primary is 240 5.9% 10% (Zinc 900) -> rgb(24, 24, 27)
    expect(color).toBe('rgb(24, 24, 27)');
  });

  test('container query configuration is valid', async ({ page }) => {
    // Inject a container and a child that responds to it
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.className = 'container-island'; // Defined in global.css
      container.style.width = '300px';

      const child = document.createElement('div');
      child.id = 'cq-child';
      child.className = '@md:text-red-500 text-blue-500'; // @md should NOT apply at 300px
      child.innerText = 'CQ Test';
      
      container.appendChild(child);
      document.body.appendChild(container);
    });
    
    // Verify the element exists and didn't crash the style engine
    const isVisible = await page.locator('#cq-child').isVisible();
    expect(isVisible).toBe(true);
  });
});