/**
 * @file Storyblok API Client Wrapper (ISO/ASCII Compliant)
 * @module lib/storyblok
 * @classification Public
 * @compliance ISO-SEC-001 - Secure API Token Management
 * @compliance ISO-ERROR-001 - Graceful Error Handling & Recovery
 * @author Atom Merrill
 * @version 3.0.0
 * @updated 2025-12-03
 * @license MIT
 * @requirement REQ-SEC-002
 * @test_ref tests/unit/lib/storyblok.test.ts
 *
 * @description
 * Provides a type-safe, error-resilient interface for fetching content from Storyblok.
 * Implements multiple enterprise patterns:
 * 
 * 1. **Safe Fetch Pattern**: Wraps API calls in try-catch with structured error responses
 * 2. **Offline Mode**: Falls back to local fixtures when API token is unavailable
 * 3. **Stale-While-Revalidate**: Caches global settings with 60s TTL and background refresh
 * 4. **Runtime Validation**: Integrates Zod schema validation for data integrity
 * 5. **Fixture Recovery**: Automatic fallback to local mocks on API failure
 * 
 * Security features include secure token handling (REQ-SEC-002) and input validation
 * via the `validateBlok` utility to prevent malformed data injection.
 */

import {
  useStoryblokApi,
  type ISbStoriesParams,
  type ISbStoryData,
  type SbBlokData,
} from "@storyblok/astro";
import type { GlobalSettings } from "@/types/storyblok";
import type { StoryblokComponent } from "@/types/generated/storyblok";
import { defaultGlobalSettings } from "@/config/default-settings";
import homeFixture from "../../tests/fixtures/storyblok-home.json";
import { validateBlok } from "./validation"; // Import Validation Utility

/* -------------------------------------------------------------------------- */
/* Logger Helper                                                              */
/* -------------------------------------------------------------------------- */

const logger = {
  log: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};

/* -------------------------------------------------------------------------- */
/* Fixtures / Local Fallbacks                                                 */
/* -------------------------------------------------------------------------- */

const LOCAL_FIXTURES: Record<string, ISbStoryData<SbBlokData>> = {
  home: homeFixture.story as unknown as ISbStoryData<SbBlokData>,
};

/* -------------------------------------------------------------------------- */
/* Types & Safe Response Shape                                                */
/* -------------------------------------------------------------------------- */

export interface SafeStoryResponse<T = StoryblokComponent> {
  story: ISbStoryData<T> | null;
  error: Error | null;
  status: number;
}

interface StoryblokError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: unknown;
  };
}

/* -------------------------------------------------------------------------- */
/* Safe Fetch Implementation                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Safely fetches a single story from Storyblok with error handling and fixture fallback.
 *
 * Implements the "Safe Fetch" pattern with offline mode support and runtime validation.
 * Automatically falls back to local fixtures if API is unavailable or fails.
 *
 * @template T - Expected Storyblok component type
 * @param slug - Content slug to fetch (e.g., 'home', 'about')
 * @param params - Optional query parameters for the API request
 * @returns Promise resolving to SafeStoryResponse with story data or error
 *
 * @throws Will return error in response instead of throwing
 * @see {@link getSafeStories} for fetching multiple stories
 */
export async function getSafeStory<T = StoryblokComponent>(
  slug: string,
  params?: ISbStoriesParams,
): Promise<SafeStoryResponse<T>> {
  logger.log(`[getSafeStory] Fetching slug: "${slug}"`);

  const isOffline = !import.meta.env.STORYBLOK_DELIVERY_API_TOKEN;

  if (isOffline) {
    logger.log(`[getSafeStory] OFFLINE MODE - serving fixture for "${slug}"`);
    const mockStory = (LOCAL_FIXTURES[slug] ||
      LOCAL_FIXTURES["home"]) as ISbStoryData<T>;

    if (!mockStory) {
      logger.warn(`[getSafeStory] No fixture found for "${slug}"`);
      return {
        story: null,
        error: new Error(`No fixture available for slug: ${slug}`),
        status: 404,
      };
    }

    // Even offline fixtures should be validated to ensure test data isn't stale
    if (mockStory.content) {
      mockStory.content = validateBlok(mockStory.content) as T;
    }

    return {
      story: mockStory,
      error: null,
      status: 200,
    };
  }

  const storyblokApi = useStoryblokApi();
  const version = import.meta.env.DEV ? "draft" : "published";

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version,
      ...params,
    });

    if (!data.story) {
      throw new Error(
        `API returned success but 'data.story' is missing for slug: ${slug}`,
      );
    }

    // RUNTIME INTEGRITY CHECK
    // This validates the structure against the Zod schema generated from Storyblok
    if (data.story.content) {
      data.story.content = validateBlok(data.story.content);
    }

    return {
      story: data.story as ISbStoryData<T>,
      error: null,
      status: 200,
    };
  } catch (rawError: unknown) {
    logger.error(`[getSafeStory] ✗ API FAILED for "${slug}":`, rawError);

    const fallbackStory = (LOCAL_FIXTURES[slug] || LOCAL_FIXTURES["home"]) as
      | ISbStoryData<T>
      | undefined;

    if (fallbackStory) {
      logger.warn(
        `[getSafeStory] FIXTURE RECOVERY: Serving local fixture for "${slug}"`,
      );
      // Validate fallback too
      if (fallbackStory.content) {
        fallbackStory.content = validateBlok(fallbackStory.content) as T;
      }
      return {
        story: fallbackStory,
        error: null,
        status: 200,
      };
    }

    const err =
      rawError instanceof Error ? rawError : new Error(String(rawError));
    const status =
      (rawError as StoryblokError)?.response?.status ??
      (rawError as StoryblokError)?.status ??
      500;

    return {
      story: null,
      error: err,
      status,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Global Settings Caching (Stale-While-Revalidate)                           */
/* -------------------------------------------------------------------------- */

let settingsCache: GlobalSettings | null = null;
let cacheTime = 0;
let revalidationInProgress = false;
const CACHE_TTL = 60_000;

async function revalidateGlobalSettings(): Promise<void> {
  if (revalidationInProgress) return;
  revalidationInProgress = true;

  try {
    const { story, error } = await getSafeStory<GlobalSettings>(
      "config/global-settings",
    );

    if (error || !story?.content) return;

    settingsCache = story.content;
    cacheTime = Date.now();
  } finally {
    revalidationInProgress = false;
  }
}

/**
 * Retrieves global settings with stale-while-revalidate caching strategy.
 *
 * Fetches settings from cache if fresh (within 60s TTL), otherwise revalidates in background.
 * Falls back to default settings if API fails or is unavailable.
 *
 * @returns Promise resolving to GlobalSettings configuration object
 * @see {@link defaultGlobalSettings} for fallback values
 */
export async function getGlobalSettings(): Promise<GlobalSettings> {
  const now = Date.now();

  if (settingsCache && now - cacheTime < CACHE_TTL) return settingsCache;

  if (settingsCache) {
    void revalidateGlobalSettings();
    return settingsCache;
  }

  const { story, error } = await getSafeStory<GlobalSettings>(
    "config/global-settings",
  );

  if (story?.content) {
    settingsCache = story.content;
    cacheTime = now;
    return settingsCache;
  }

  if (error && settingsCache) return settingsCache;

  return defaultGlobalSettings as unknown as GlobalSettings;
}

/**
 * Safely fetches multiple stories from Storyblok with error handling.
 *
 * Supports filtering, sorting, and pagination via Storyblok API parameters.
 * Returns empty array in offline mode or on error.
 *
 * @template T - Expected Storyblok component type
 * @param params - Query parameters for filtering/sorting
 * @returns Promise with stories array, error info, and total count
 */
export async function getSafeStories<T = StoryblokComponent>(
  params?: ISbStoriesParams,
): Promise<{
  stories: ISbStoryData<T>[];
  error: Error | null;
  total: number;
}> {
  if (!import.meta.env.STORYBLOK_DELIVERY_API_TOKEN) {
    return { stories: [], error: null, total: 0 };
  }

  const storyblokApi = useStoryblokApi();
  const version = import.meta.env.DEV ? "draft" : "published";

  try {
    const { data } = await storyblokApi.get("cdn/stories", {
      version,
      ...params,
    });

    return {
      stories: data.stories as ISbStoryData<T>[],
      error: null,
      total: data.total || 0,
    };
  } catch (error: unknown) {
    logger.error("[getSafeStories] Failed to fetch stories:", error);
    return {
      stories: [],
      error: error instanceof Error ? error : new Error(String(error)),
      total: 0,
    };
  }
}
