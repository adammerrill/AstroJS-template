import { test, expect } from './lib/base';

test.describe('Global Navigation (Isolated)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to root (intercepted by isoNetwork fixture)
    await page.goto('/');
  });

  test('desktop navigation should be visible on large screens', async ({ page }) => {
    // 1. Set viewport to Desktop
    await page.setViewportSize({ width: 1280, height: 720 });

    // 2. Assert Desktop Nav exists using stable selector
    const desktopNav = page.getByTestId('desktop-nav');
    await expect(desktopNav).toBeVisible();

    // 3. Verify specific link presence (resilient to ordering changes)
    await expect(desktopNav.getByRole('link', { name: 'Home' })).toBeVisible();
    
    // 4. Ensure Mobile components are hidden
    await expect(page.getByTestId('mobile-drawer')).toBeHidden();
  });

  test('mobile drawer should operate correctly on small screens', async ({ page }) => {
    // 1. Set viewport to Mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. Ensure Desktop Nav is hidden (Tailwind bp1020 class check)
    await expect(page.getByTestId('desktop-nav')).toBeHidden();

    // 3. Open Mobile Drawer
    // Note: We target by ARIA role/label for accessibility compliance (ISO 9241-11)
    const menuButton = page.getByLabel('Open navigation menu');
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // 4. Assert Drawer State
    const drawer = page.getByTestId('mobile-drawer');
    await expect(drawer).toHaveAttribute('data-state', 'open');
    await expect(drawer).toBeVisible();

    // 5. Test Focus Trap / Keyboard Navigation (Accessibility Requirement)
    await page.keyboard.press('Escape');
    await expect(drawer).toHaveAttribute('data-state', 'closed');
  });

});
