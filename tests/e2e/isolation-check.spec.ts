import { test, expect } from './lib/base';

test.describe('System Under Test Isolation', () => {
  
  test('should receive mocked content instead of live content', async ({ page }) => {
    // 1. Trigger the network call
    await page.goto('/mock-viewer');

    // 2. Wait for the component to reach 'success' state
    const container = page.getByTestId('mock-container');
    await expect(container).toHaveAttribute('data-fetch-status', 'success', { timeout: 5000 });

    // 3. Assert Content matches the JSON fixture
    const headline = page.getByTestId('mock-headline');
    
    // FIX: Updated assertion to match the actual text in storyblok-home.json
    await expect(headline).toHaveText('Deterministic QA');
  });

});
