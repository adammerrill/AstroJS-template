/**
 * @fileoverview Storyblok API Client Wrapper (ISO/ASCII Compliant)
 * @description
 * Provides a type-safe, error-resilient interface for fetching content from Storyblok.
 * Implements the "Safe Fetch" pattern with "Offline Mode" to support development
 * without API credentials, and "Stale-While-Revalidate" caching for optimal performance.
 *
 * Architectural Philosophy:
 * - Graceful Degradation: Never throw exceptions; always return a safe response shape
 * - Offline-First: Serve local fixtures when API token is unavailable
 * - Performance-Optimized: In-memory caching with background revalidation (SWR)
 * - Type-Safe: Full TypeScript generics support for content types
 *
 * Key Features:
 * - Offline Mode: Serves local fixtures if no API token is present
 * - Safe Fetch Pattern: Returns { story, error, status } instead of throwing
 * - Stale-While-Revalidate: Serves cached data immediately while updating in background
 * - Automatic version detection: draft (dev) vs published (production)
 * - Comprehensive error handling with status codes
 * - Fallback cascade: API → Local Fixtures → Default Values
 *
 * Caching Strategy (Global Settings):
 * 1. Fresh Cache (< TTL): Return immediately
 * 2. Stale Cache (>= TTL): Return stale + trigger background revalidation
 * 3. No Cache: Block and fetch synchronously
 * 4. Fetch Failed: Return stale cache if available (Stale-If-Error)
 * 5. Total Failure: Return hardcoded defaults
 *
 * @module lib/storyblok
 * @author Atom Merrill
 * @version 2.0.1
 * @updated 2025-12-01
 * @license MIT
 *
 * @see {@link https://www.storyblok.com/docs/api/content-delivery|Storyblok Content Delivery API}
 * @see {@link https://web.dev/stale-while-revalidate/|Stale-While-Revalidate Pattern}
 */

import {
  useStoryblokApi,
  type ISbStoriesParams,
  type ISbStoryData,
  type SbBlokData,
} from "@storyblok/astro";
import type { GlobalSettings } from "@/types/storyblok";
import { defaultGlobalSettings } from "@/config/default-settings";
import homeFixture from "../../tests/fixtures/storyblok-home.json";

/* -------------------------------------------------------------------------- */
/* Logger Helper                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Conditional logger that only outputs in development mode.
 * Resolves 'no-console' warnings in production.
 */
const logger = {
  log: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    // Warnings are useful in production for debugging fallbacks
    // eslint-disable-next-line no-console
    console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Errors should always be logged
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};

/* -------------------------------------------------------------------------- */
/* Fixtures / Local Fallbacks                        */
/* -------------------------------------------------------------------------- */

/**
 * Registry of local fixtures to serve when Storyblok is unreachable or unconfigured.
 * * Usage:
 * - Offline Mode: Served when STORYBLOK_DELIVERY_API_TOKEN is empty/missing
 * - Fallback Recovery: Served when API request fails but data is still needed
 * * Structure:
 * - Key: Story slug (e.g., "home", "about", "config/global-settings")
 * - Value: Complete ISbStoryData object with content, id, and metadata
 * * @example
 * LOCAL_FIXTURES["home"] = { story: { id: 1, content: {...}, ... } }
 */
const LOCAL_FIXTURES: Record<string, ISbStoryData<SbBlokData>> = {
  // Cast to specific type to avoid 'any'
  home: homeFixture.story as unknown as ISbStoryData<SbBlokData>,
};

/* -------------------------------------------------------------------------- */
/* Types & Safe Response Shape                       */
/* -------------------------------------------------------------------------- */

/**
 * Standardized response shape for safe fetch operations.
 * Ensures consumers handle both success and error cases without exceptions.
 * * Design Pattern: Result Type (Rust-inspired)
 * - Success: { story: ISbStoryData, error: null, status: 200 }
 * - Failure: { story: null, error: Error, status: 404/500 }
 * * @template T - The expected content type of the story (e.g., GlobalSettings, Page)
 */
export interface SafeStoryResponse<T = SbBlokData> {
  /** The requested story object, or null if not found/error occurred */
  story: ISbStoryData<T> | null;
  /** Null if successful, otherwise contains error details */
  error: Error | null;
  /** HTTP status code context (200 = success, 404 = not found, 500 = server error) */
  status: number;
}

/**
 * Interface for the error shape returned by Storyblok's API client.
 * Used internally to extract status codes from caught exceptions.
 * * @internal
 */
interface StoryblokError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: unknown;
  };
}

/* -------------------------------------------------------------------------- */
/* Safe Fetch Implementation                            */
/* -------------------------------------------------------------------------- */

/**
 * getSafeStory - Safe Storyblok Fetch with Fallback Cascade
 * * This function implements a four-tier fetch strategy:
 * 1. Offline Mode Check: If no API token, serve from LOCAL_FIXTURES immediately
 * 2. Online Mode: Attempt API fetch from Storyblok CDN
 * 3. Fallback Recovery: If API fails, attempt to serve from LOCAL_FIXTURES
 * 4. Error State: If no fallback available, return error with appropriate status code
 * * Error Handling Philosophy:
 * - Never throw exceptions (always returns SafeStoryResponse)
 * - Always attempt fixture fallback before returning error
 * - Preserve original error object for debugging (error.message, error.stack)
 * - Return appropriate HTTP status codes (200, 404, 500)
 * * @template T - The expected content type (defaults to SbBlokData)
 * @param {string} slug - The content path/slug (e.g., "home", "about", "config/global-settings")
 * @param {ISbStoriesParams} [params] - Optional Storyblok query parameters (version, cv, etc.)
 * @returns {Promise<SafeStoryResponse<T>>} A safe response object containing data or error info
 * * @example
 * // Basic usage
 * const { story, error, status } = await getSafeStory("home");
 * if (error) {
 * logger.error("Failed to load home:", error);
 * return <ErrorPage status={status} />;
 * }
 * * @example
 * // With type safety
 * const { story } = await getSafeStory<GlobalSettings>("config/global-settings");
 * const siteName = story?.content.site_name ?? "Default Site";
 */
export async function getSafeStory<T = SbBlokData>(
  slug: string,
  params?: ISbStoriesParams,
): Promise<SafeStoryResponse<T>> {
  logger.log(`[getSafeStory] Fetching slug: "${slug}"`);

  /* ------------------------ 1. Offline Mode Check ------------------------- */

  const isOffline = !import.meta.env.STORYBLOK_DELIVERY_API_TOKEN;
  logger.log(`[getSafeStory] Mode: ${isOffline ? "OFFLINE" : "ONLINE"}`);

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

    return {
      story: mockStory,
      error: null,
      status: 200,
    };
  }

  /* ----------------------- 2. Online Mode - API Call ---------------------- */

  logger.log(`[getSafeStory] ONLINE MODE - attempting API call for "${slug}"`);
  const storyblokApi = useStoryblokApi();
  const version = import.meta.env.DEV ? "draft" : "published";

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version,
      ...params,
    });

    // FIX: Add check for malformed successful response (e.g., 200 OK but missing 'story')
    // If 'data.story' is missing, we treat it as a failure to fetch content
    // and explicitly throw an error to trigger the fallback logic in the catch block.
    if (!data.story) {
      throw new Error(
        `API returned success but 'data.story' is missing for slug: ${slug}`,
      );
    }

    logger.log(`[getSafeStory] ✓ API SUCCESS for "${slug}"`);
    return {
      story: data.story,
      error: null,
      status: 200,
    };
  } catch (rawError: unknown) {
    logger.error(`[getSafeStory] ✗ API FAILED for "${slug}":`, rawError);

    /* ---------------------- 3. Fallback Recovery ----------------------- */

    const fallbackStory = (LOCAL_FIXTURES[slug] || LOCAL_FIXTURES["home"]) as
      | ISbStoryData<T>
      | undefined;

    if (fallbackStory) {
      logger.warn(
        `[getSafeStory] FIXTURE RECOVERY: Serving local fixture for "${slug}" ` +
          `(${LOCAL_FIXTURES[slug] ? "specific" : "home fallback"})`,
      );
      return {
        story: fallbackStory,
        error: null,
        status: 200,
      };
    }

    /* -------------------- 4. No Fallback - Error State ------------------ */

    const err =
      rawError instanceof Error ? rawError : new Error(String(rawError));
    const status =
      (rawError as StoryblokError)?.response?.status ??
      (rawError as StoryblokError)?.status ??
      500;

    logger.error(`[getSafeStory] NO FALLBACK AVAILABLE for "${slug}"`);
    return {
      story: null,
      error: err,
      status,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Global Settings Caching (Stale-While-Revalidate)               */
/* -------------------------------------------------------------------------- */

/**
 * In-memory cache for Global Settings with Stale-While-Revalidate semantics.
 * * Why Caching Matters:
 * - Global Settings are rendered on every page (header, footer, meta tags)
 * - Without caching, every page request = 1 API call (rate limits, latency)
 * - With SWR: Instant responses + background updates = best UX
 * * Cache Storage:
 * - settingsCache: The actual GlobalSettings object (null if not yet fetched)
 * - cacheTime: Timestamp of last successful fetch (milliseconds since epoch)
 * - revalidationInProgress: Concurrency lock to prevent duplicate fetches
 * * Notes:
 * - This cache is process-local (in-memory). Suitable for:
 * • Development: Single process, instant feedback
 * • Edge deployments: Short-lived instances, frequent deploys
 * - For multi-instance production, consider:
 * • Distributed cache (Redis, Memcached)
 * • Build-time static generation (Astro SSG)
 * • CDN caching headers (Cache-Control: s-maxage=60)
 */
let settingsCache: GlobalSettings | null = null;
let cacheTime = 0;
let revalidationInProgress = false;

/**
 * Time-To-Live (TTL) for the Global Settings cache in milliseconds.
 * * Trade-offs:
 * - Shorter TTL (e.g., 30s): More API calls, fresher data
 * - Longer TTL (e.g., 5m): Fewer API calls, potentially stale data
 * * Current: 60 seconds (1 minute)
 * - Balances freshness with API rate limits
 * - Typical use case: Settings change infrequently (hours/days, not seconds)
 */
const CACHE_TTL = 60_000; // 1 minute

/**
 * Background revalidation routine for Global Settings.
 * * Flow:
 * 1. Check if revalidation already in progress (avoid duplicate requests)
 * 2. Fetch fresh settings from Storyblok API
 * 3. On success: Update cache and cacheTime
 * 4. On failure: Log warning, keep existing cache (Stale-If-Error)
 * 5. Always: Clear revalidation lock
 * * Concurrency Protection:
 * - Uses revalidationInProgress flag to prevent duplicate API calls
 * - If already revalidating, subsequent calls return immediately
 * * Error Handling:
 * - Network errors: Keep stale cache, log warning
 * - API errors: Keep stale cache, log warning
 * - Unexpected errors: Keep stale cache, log error
 * * @internal
 * @returns {Promise<void>} Resolves when revalidation completes (or skips)
 */
async function revalidateGlobalSettings(): Promise<void> {
  // Concurrency guard: Skip if already revalidating
  if (revalidationInProgress) {
    logger.log(
      "[getGlobalSettings] Revalidation already in progress; skipping duplicate.",
    );
    return;
  }

  revalidationInProgress = true;

  try {
    logger.log(
      "[getGlobalSettings] Background revalidation: fetching fresh settings...",
    );

    const { story, error } = await getSafeStory<GlobalSettings>(
      "config/global-settings",
    );

    if (error) {
      logger.warn(
        "[getGlobalSettings] Revalidation failed; keeping existing cache:",
        error.message,
      );
      return;
    }

    if (!story?.content) {
      logger.warn(
        "[getGlobalSettings] Revalidation: no content returned; cache not updated.",
      );
      return;
    }

    // Update cache with fresh data
    settingsCache = story.content;
    cacheTime = Date.now();
    logger.log("[getGlobalSettings] ✓ Revalidation complete; cache updated.");
  } catch (err) {
    logger.error(
      "[getGlobalSettings] Unexpected error during revalidation:",
      err,
    );
  } finally {
    // Always clear the lock
    revalidationInProgress = false;
  }
}

/**
 * Retrieves Global Settings with a Stale-While-Revalidate caching strategy.
 * * Algorithm:
 * * Case A: Cache is fresh (now - cacheTime < TTL)
 * ├─ Return: settingsCache immediately
 * └─ No API call
 * * Case B: Cache exists but is stale (now - cacheTime >= TTL)
 * ├─ Return: settingsCache immediately (stale data)
 * ├─ Trigger: Background revalidation (fire-and-forget)
 * └─ Next request will get fresh data
 * * Case C: No cache exists (first request)
 * ├─ Block: Wait for API fetch (synchronous)
 * ├─ Success: Populate cache and return
 * └─ Failure: Fall back to defaultGlobalSettings
 * * Case D: API failed + stale cache exists
 * ├─ Return: settingsCache (Stale-If-Error pattern)
 * └─ Log: Warning about API failure
 * * Case E: API failed + no cache
 * ├─ Return: defaultGlobalSettings (hardcoded fallback)
 * └─ Log: Warning about total failure
 * * Performance Characteristics:
 * - Cache Hit (Fresh): ~0ms (instant)
 * - Cache Hit (Stale): ~0ms (instant) + background fetch
 * - Cache Miss: ~100-500ms (API latency)
 * * @returns {Promise<GlobalSettings>} The global settings object (never null)
 * * @example
 * // Basic usage in Astro component
 * const settings = await getGlobalSettings();
 * const siteName = settings.site_name;
 * * @example
 * // Using destructuring
 * const { site_name, logo, footer_text } = await getGlobalSettings();
 */
export async function getGlobalSettings(): Promise<GlobalSettings> {
  const now = Date.now();

  /* ----------------------- Case A: Fresh Cache --------------------------- */

  if (settingsCache && now - cacheTime < CACHE_TTL) {
    logger.log("[getGlobalSettings] ✓ Returning fresh cache");
    return settingsCache;
  }

  /* ---------------------- Case B: Stale Cache + SWR ---------------------- */

  if (settingsCache) {
    logger.log(
      "[getGlobalSettings] ⟳ Returning stale cache + triggering background revalidation",
    );
    // Fire-and-forget: Do NOT await (non-blocking)
    void revalidateGlobalSettings();
    return settingsCache;
  }

  /* -------------------- Case C: No Cache (First Request) ----------------- */

  logger.log(
    "[getGlobalSettings] ⌛ No cache found - blocking fetch from Storyblok...",
  );
  const { story, error } = await getSafeStory<GlobalSettings>(
    "config/global-settings",
  );

  // Success: Populate cache and return
  if (story?.content) {
    settingsCache = story.content;
    cacheTime = now;
    logger.log("[getGlobalSettings] ✓ Fetched and cached global settings");
    return settingsCache;
  }

  /* ------------------- Case D: Stale Cache (If Available) ---------------- */

  if (error && settingsCache) {
    logger.warn(
      "[getGlobalSettings] ⚠️  API failed but stale cache available:",
      error.message,
    );
    return settingsCache;
  }

  /* ------------------ Case E: Total Failure (Fallback) ------------------- */

  logger.warn(
    "[getGlobalSettings] ✗ Global settings unavailable - using defaults",
  );
  return defaultGlobalSettings;
}

/* -------------------------------------------------------------------------- */
/* Bulk Fetch Helper                                     */
/* -------------------------------------------------------------------------- */

/**
 * Fetches multiple stories with pagination support.
 * * Use Cases:
 * - Blog post listings
 * - Product catalogs
 * - Navigation menus
 * - Search results
 * * Error Handling:
 * - Offline Mode: Returns empty array (prevents iteration crashes)
 * - API Errors: Returns empty array + error object
 * * @template T - The expected content type structure
 * @param {ISbStoriesParams} [params] - Query parameters for filtering and pagination
 * @returns {Promise<{ stories: ISbStoryData<T>[], error: Error | null, total: number }>}
 * * @example
 * // Fetch all blog posts
 * const { stories, error, total } = await getSafeStories({ starts_with: "blog/" });
 * if (error) logger.error("Failed to load posts:", error);
 * * @example
 * // Pagination
 * const { stories } = await getSafeStories({ per_page: 10, page: 2 });
 */
export async function getSafeStories<T = SbBlokData>(
  params?: ISbStoriesParams,
): Promise<{
  stories: ISbStoryData<T>[];
  error: Error | null;
  total: number;
}> {
  // Offline Mode check for lists
  if (!import.meta.env.STORYBLOK_DELIVERY_API_TOKEN) {
    logger.warn("[getSafeStories] Offline Mode: Returning empty list");
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
      stories: data.stories,
      error: null,
      total: data.total || 0,
    };
  } catch (error: unknown) {
    logger.error("[getSafeStories] Failed to fetch stories:", error);

    return {
      stories: [], // Return empty array instead of null (safer for iteration)
      error: error instanceof Error ? error : new Error(String(error)),
      total: 0,
    };
  }
}
