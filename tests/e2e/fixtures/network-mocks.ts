import { type Page } from '@playwright/test';
import homeFixture from '../../fixtures/storyblok-home.json' with { type: 'json' };

/**
 * @file Network Mocking Utilities
 * @description Provides strictly typed interceptors for Storyblok API calls.
 */

const MOCK_DATA = {
  'home': homeFixture,
};

export async function mockStoryblokAPI(page: Page, slug: string = 'home') {
  // 1. Intercept Storyblok CDN requests
  await page.route(`**/cdn/stories/${slug}*`, async (route) => {
    console.log(`🔒 [Mock] Intercepting Storyblok request for: ${slug}`);
    
    const mockResponse = MOCK_DATA[slug as keyof typeof MOCK_DATA];

    if (!mockResponse) {
      console.warn(`⚠️ [Mock] No fixture found for ${slug}, returning 404`);
      await route.fulfill({ status: 404, body: JSON.stringify({ message: "Mock not found" }) });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse),
    });
  });

  // 2. Intercept Storyblok Links API (Router Hydration)
  await page.route('**/cdn/links*', async (route) => {
     await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        links: {
          [homeFixture.story.uuid]: {
            id: homeFixture.story.id,
            slug: 'home',
            name: 'Home',
            is_folder: false,
            published: true,
            path: '/',
            uuid: homeFixture.story.uuid
          }
        }
      })
     });
  });

  // 3. CRITICAL FIX: Intercept the internal testing endpoint used by MockTester
  // This prevents the request from hitting the Astro server and returning HTML
  await page.route('**/_testing/api/story', async (route) => {
    console.log('🔒 [Mock] Intercepting internal test endpoint');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(homeFixture),
    });
  });
}
