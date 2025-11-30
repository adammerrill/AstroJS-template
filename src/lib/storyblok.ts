/**
 * @fileoverview Storyblok API Client Wrapper (ISO/ASCII Compliant)
 * @description Provides a type-safe, error-resilient interface for fetching
 * content from Storyblok. Implements the "Safe Fetch" pattern to prevent
 * runtime crashes when the CMS API returns errors or malformed data.
 * * @module lib/storyblok
 * @version 1.0.1
 * @date 2025-11-24
 */

import {
  useStoryblokApi,
  type ISbStoriesParams,
  type ISbStoryData,
  type SbBlokData,
} from "@storyblok/astro";

/**
 * Defines the standardized response shape for safe fetch operations.
 * @template T The expected content type of the story.
 */
export interface SafeStoryResponse<T = SbBlokData> {
  /** The requested story object, or null if not found/error. */
  story: ISbStoryData<T> | null;
  /** Null if successful, otherwise contains error details. */
  error: Error | null;
  /** HTTP status code context (e.g., 404, 500). */
  status: number;
}

/**
 * Interface for the error shape returned by Storyblok's client.
 */
interface StoryblokError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
  };
}

/**
 * Safely fetches a single story by its slug.
 * * @description
 * Wraps the Storyblok API call in a try/catch block to ensure the application
 * never crashes due to upstream API failures. Automatically determines the
 * correct API version ('draft' vs 'published') based on the environment.
 * * @param {string} slug - The full path slug of the story (e.g., "home", "blog/my-post").
 * @param {ISbStoriesParams} [params] - Optional query parameters for the API.
 * @returns {Promise<SafeStoryResponse>} A normalized response object containing data or error info.
 */
export async function getSafeStory<T = SbBlokData>(
  slug: string,
  params?: ISbStoriesParams,
): Promise<SafeStoryResponse<T>> {
  const storyblokApi = useStoryblokApi();

  // Determine version based on environment
  // DEV mode = "draft" to see latest changes
  // PROD mode = "published" for optimized, public content
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
    console.error(`[Storyblok] Failed to fetch story: ${slug}`, error);

    // Cast unknown error to a shape we can check for status codes
    const sbError = error as StoryblokError;
    const status = sbError?.status || sbError?.response?.status || 500;

    // Handle specific 404 case gracefully
    if (status === 404) {
      return { story: null, error: new Error("Story not found"), status: 404 };
    }

    // Return generic error for other failures (500s, network issues)
    return {
      story: null,
      error: error instanceof Error ? error : new Error(String(error)),
      status,
    };
  }
}
