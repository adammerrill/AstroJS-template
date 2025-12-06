import { test as base } from '@playwright/test';
import { mockStoryblokAPI } from '../fixtures/network-mocks';

/**
 * @file Enterprise Test Base (System Under Test Isolation)
 * @description Extends Playwright to enforce network isolation via auto-fixture
 * @usage import { test, expect } from './lib/base';
 */

// 1. Define your custom fixture type
interface SutFixtures {
  isoNetwork: void; // Auto-fixture that runs for side effects only
}

// 2. Apply the type parameter to extend()
export const test = base.extend<SutFixtures>({
  isoNetwork: [async ({ page }, use) => {
    // 3. Intercept Storyblok traffic before each test
    await mockStoryblokAPI(page);
    
    // 4. Continue to test (no value to provide, just side effects)
    await use();
  }, { 
    auto: true,      // Runs automatically for every test
    scope: 'test'    // Explicit scope (optional but recommended)
  }]
});

export { expect } from '@playwright/test';
