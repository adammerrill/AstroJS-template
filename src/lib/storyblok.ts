/**
 * @file storyblok.ts
 * @description Storyblok API Client Wrapper (ISO/ASCII Compliant)
 *              Provides a type-safe, error-resilient interface for fetching
 *              content from Storyblok. Implements the "Safe Fetch" pattern to
 *              prevent runtime crashes when the CMS API returns errors or
 *              malformed data.
 *
 * Key Features:
 * - Automatic version detection (draft vs published)
 * - Comprehensive error handling with status codes
 * - Type-safe response objects
 * - Global settings helper function
 *
 * @module lib/storyblok
 * @version 1.1.0
 * @date 2025-11-30
 *
 * @see {@link https://www.storyblok.com/docs/api/content-delivery}
 */

import {
  useStoryblokApi,
  type ISbStoriesParams,
  type ISbStoryData,
  type SbBlokData,
} from "@storyblok/astro";
import type { GlobalSettings } from "@/types/storyblok";

/**
 * Defines the standardized response shape for safe fetch operations.
 * This pattern ensures consuming code can always handle both success
 * and error cases without throwing exceptions.
 *
 * @template T The expected content type of the story
 *
 * @example
 * const { story, error, status } = await getSafeStory<MyContentType>("home");
 * if (error) {
 *   console.error("Failed to load:", error.message);
 *   return;
 * }
 * // story is guaranteed to be non-null here
 * const content = story.content;
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

/**
 * Safely fetches a single story by its slug with comprehensive error handling.
 *
 * @description
 * Wraps the Storyblok API call in a try/catch block to ensure the application
 * never crashes due to upstream API failures. Automatically determines the
 * correct API version ('draft' vs 'published') based on the environment:
 * - Development mode (import.meta.env.DEV = true): uses "draft" to see unpublished changes
 * - Production mode (import.meta.env.DEV = false): uses "published" for optimized content
 *
 * @template T The expected content type structure
 * @param {string} slug - The full path slug of the story (e.g., "home", "blog/my-post", "config/global-settings")
 * @param {ISbStoriesParams} [params] - Optional query parameters for the API (e.g., resolve_relations, cv)
 * @returns {Promise<SafeStoryResponse<T>>} A normalized response object containing data or error info
 *
 * @example
 * // Fetch a page story
 * const { story, error } = await getSafeStory("about");
 * if (error) {
 *   return Astro.redirect("/404");
 * }
 *
 * @example
 * // Fetch with type safety
 * const { story } = await getSafeStory<MyPageType>("products", {
 *   resolve_relations: "product.categories"
 * });
 *
 * @see {@link https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/stories/retrieve-one-story}
 */
export async function getSafeStory<T = SbBlokData>(
  slug: string,
  params?: ISbStoriesParams,
): Promise<SafeStoryResponse<T>> {
  const storyblokApi = useStoryblokApi();

  // Determine version based on environment
  // DEV mode = "draft" to see latest changes in Visual Editor
  // PROD mode = "published" for optimized, CDN-cached content
  const version = import.meta.env.DEV ? "draft" : "published";

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version,
      ...params,
    });

    return {
      story: data.story,
      error: null,
      status: 200,
    };
  } catch (error: unknown) {
    // Log error for debugging but don't expose sensitive details to client
    console.error(`[Storyblok] Failed to fetch story: ${slug}`, error);

    // Cast unknown error to a shape we can check for status codes
    const sbError = error as StoryblokError;
    const status = sbError?.status || sbError?.response?.status || 500;

    // Handle specific 404 case gracefully
    if (status === 404) {
      return {
        story: null,
        error: new Error(`Story not found: ${slug}`),
        status: 404,
      };
    }

    // Return generic error for other failures (500s, network issues, auth errors)
    return {
      story: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status,
    };
  }
}

/**
 * Fetches the Global Settings story from Storyblok.
 *
 * @description
 * This is a convenience wrapper around getSafeStory that fetches the
 * global configuration story containing navigation menus, footer links,
 * social media profiles, and other site-wide settings.
 *
 * The story is expected to be located at the slug "config/global-settings"
 * in your Storyblok space. If the story doesn't exist or fails to load,
 * this function returns null rather than throwing an error.
 *
 * @returns {Promise<GlobalSettings | null>} The global settings content, or null if not found/error
 *
 * @example
 * // In a layout component
 * const settings = await getGlobalSettings();
 * const navLinks = settings?.header_nav || defaultLinks;
 * const siteTitle = settings?.site_title || "My Site";
 *
 * @example
 * // With error handling
 * const settings = await getGlobalSettings();
 * if (!settings) {
 *   console.warn("Global settings not configured in Storyblok");
 * }
 *
 * @see {@link GlobalSettings} for the full type definition
 */
export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  // Use the same safe fetch pattern, targeting a specific known slug
  const { story, error } = await getSafeStory<GlobalSettings>(
    "config/global-settings",
  );

  if (error) {
    console.warn("[Storyblok] Global settings not available:", error.message);
    return null;
  }

  return story?.content || null;
}

/**
 * Fetches multiple stories with pagination support.
 *
 * @description
 * Use this function when you need to fetch a list of stories, such as
 * for a blog index, product listing, or navigation menu. Supports all
 * standard Storyblok query parameters including filtering, sorting,
 * and pagination.
 *
 * @template T The expected content type structure
 * @param {ISbStoriesParams} params - Query parameters for filtering and pagination
 * @returns {Promise<{ stories: ISbStoryData<T>[] | null; error: Error | null; total: number }>}
 *
 * @example
 * // Fetch all blog posts
 * const { stories } = await getSafeStories({
 *   starts_with: "blog/",
 *   per_page: 10,
 *   page: 1,
 *   sort_by: "published_at:desc"
 * });
 *
 * @see {@link https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/stories/retrieve-multiple-stories}
 */
export async function getSafeStories<T = SbBlokData>(
  params?: ISbStoriesParams,
): Promise<{
  stories: ISbStoryData<T>[] | null;
  error: Error | null;
  total: number;
}> {
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
    console.error("[Storyblok] Failed to fetch stories", error);

    return {
      stories: null,
      error: error instanceof Error ? error : new Error(String(error)),
      total: 0,
    };
  }
}
