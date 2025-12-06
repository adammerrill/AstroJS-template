/**
 * @file Script to fetch the Storyblok component schema and cache it.
 * This script is a critical part of the CI/CD pipeline, ensuring types and
 * validation schemas are up-to-date before building the Astro/Svelte application.
 *
 * @module fetch-schema
 * @version 1.2.0
 * @author Atom Merrill
 * @license MIT
 *
 * @see {@link https://www.storyblok.com/docs/api/management} Storyblok Management API
 * @see {@link https://docs.astro.build/en/guides/typescript/} Astro TypeScript Guide
 * @see {@link https://svelte.dev/docs/svelte/typescript} Svelte 5 TypeScript Guide
 *
 * @description
 * Fetches component schemas from Storyblok Management API with the following features:
 * - Exponential backoff retry logic for network resilience
 * - SHA256-based caching to detect schema changes
 * - Comprehensive error handling with typed error responses
 * - Full TypeScript strict mode compliance
 *
 * @version * - v1.2.0: Migrated to shared types module, fixed unused variable lint error
 * - v1.1.0: Added ComponentSchema interface, fixed TypeScript strict errors
 * - v1.0.0: Initial implementation with caching support
 */

import StoryblokClient from "storyblok-js-client";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

// Import shared type definitions used across the type generation pipeline
import type { ComponentSchema } from "./types";

// Export the type for use in other modules
export type { ComponentSchema } from "./types";

// Load environment variables from .env file
dotenv.config();

// --- Configuration Constants ---
/**
 * Storyblok Space ID from environment variables
 * @type {string | undefined}
 */
const SPACE_ID: string | undefined = process.env.STORYBLOK_SPACE_ID;

/**
 * Storyblok Personal Access Token from environment variables
 * @type {string | undefined}
 */
const PERSONAL_TOKEN: string | undefined = process.env.STORYBLOK_PERSONAL_TOKEN;

/**
 * File path for storing the schema hash cache
 * @type {string}
 */
const CACHE_FILE_PATH: string = path.resolve(process.cwd(), ".schema-hash");

/**
 * Temporary file path for storing the raw schema JSON
 * @type {string}
 */
const TEMP_SCHEMA_PATH: string = path.resolve(
  process.cwd(),
  "scripts/type-gen/temp-schema.json",
);

// --- Type Definitions ---

/**
 * Defines the expected structure of an error from the Storyblok API client.
 * The Storyblok client wraps HTTP response errors in this structure.
 *
 * @interface StoryblokApiError
 * @augments {Error}
 * @property {Object} [response] - HTTP response object (may be undefined)
 * @property {number} [response.status] - HTTP status code (may be undefined)
 * @property {unknown} [response.data] - Response body data
 *
 * @description
 * This interface is used for type-safe error handling in the catch blocks.
 * Both `response` and `response.status` are optional to handle cases where
 * the error occurs before a response is received (e.g., network failures).
 */
interface StoryblokApiError extends Error {
  response?: {
    status?: number;
    data?: unknown;
  };
}

// --- Storyblok Client Initialization ---

/**
 * Initializes the Storyblok Management API client using the personal token.
 *
 * @constant {StoryblokClient}
 * @description
 * The client is configured with the OAuth token for accessing the Management API.
 * This client is used throughout the module for all API requests.
 */
const Storyblok = new StoryblokClient({
  oauthToken: PERSONAL_TOKEN,
});

// --- Utility Functions ---

/**
 * Calculates a SHA256 hash for any data object.
 *
 * @function calculateHash
 * @param {unknown} data - The data object to hash (typically the component schema array)
 * @returns {string} The SHA256 hash as a hexadecimal string
 *
 * @description
 * Used for change detection by comparing hashes of the current and cached schemas.
 * If the hashes match, the schema hasn't changed and regeneration can be skipped.
 *
 * @example
 * const components = await fetchComponents();
 * const hash = calculateHash(components);
 * // hash: "a3b5c7d9..."
 */
function calculateHash(data: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

/**
 * Promise-based delay utility for implementing retry backoff.
 *
 * @function wait
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>} A promise that resolves after the specified duration
 *
 * @description
 * Used in the exponential backoff retry logic to introduce delays between
 * failed API request attempts. This helps prevent overwhelming the API during
 * temporary outages or rate limiting scenarios.
 *
 * @example
 * await wait(1000); // Wait 1 second
 * console.log('Resumed after 1 second');
 */
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches component schemas from Storyblok Management API with retry logic.
 *
 * @async
 * @function fetchComponents
 * @param retries - Maximum number of retry attempts
 * @param delay - Initial delay in milliseconds before first retry
 * @returns Array of component schemas
 * @throws An error if required environment variables are missing
 *
 * @description
 * Implements exponential backoff with jitter for resilient API fetching:
 * 1. Validates environment variables
 * 2. Attempts API request with Storyblok client
 * 3. On 429 (rate limit) or 5xx errors, retries with exponential backoff
 * 4. Adds random jitter to prevent thundering herd problem
 * 5. Immediately throws on 4xx errors (except 429)
 *
 * @example
 * try {
 *   const components = await fetchComponents(5, 2000);
 *   console.log(`Fetched ${components.length} components`);
 * } catch (error) {
 *   console.error('Failed to fetch components:', error);
 * }
 *
 * @see {@link https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/}
 */
async function fetchComponents(
  retries = 3,
  delay = 1000,
): Promise<ComponentSchema[]> {
  // Validate required environment variables
  if (!SPACE_ID || !PERSONAL_TOKEN) {
    throw new Error(
      "❌ Missing Environment Variables: Ensure STORYBLOK_SPACE_ID and STORYBLOK_PERSONAL_TOKEN are set.",
    );
  }

  // Retry loop with exponential backoff
  for (let i = 0; i < retries; i++) {
    try {
      console.log(
        `🔄 Connecting to Storyblok Management API (Attempt ${i + 1}/${retries})...`,
      );

      // Fetch components from Storyblok Management API
      const response = await Storyblok.get(`spaces/${SPACE_ID}/components`, {});

      // Type assertion: We know the API returns ComponentSchema objects
      // This is safe because we control the API endpoint and have defined ComponentSchema
      // to match the Storyblok API structure
      return response.data.components as ComponentSchema[];
    } catch (error: unknown) {
      // Type guard: Assert error to our defined API error type for safe property access
      const apiError = error as StoryblokApiError;
      const isLastAttempt = i === retries - 1;

      // LINT FIX: Check if response exists before accessing status
      // This prevents "possibly undefined" errors in strict mode
      if (apiError.response?.status !== undefined) {
        const status = apiError.response.status;

        // Handle retryable errors: 429 (Too Many Requests) or 5xx (Server Errors)
        if (status === 429 || status >= 500) {
          if (isLastAttempt) {
            // Last attempt failed, throw the error
            throw error;
          }

          // Calculate backoff with jitter
          const jitter = Math.random() * 200; // Random 0-200ms jitter
          const backoffDelay = delay + jitter;

          console.warn(
            `⚠️  API Error ${status}. Retrying in ${Math.round(backoffDelay)}ms...`,
          );

          await wait(backoffDelay);
          delay *= 2; // Exponential backoff: double the delay each time
          continue; // Try again
        }
      }

      // For non-retryable errors (401, 404, network errors, etc.), throw immediately
      throw error;
    }
  }

  // Unreachable code: loop will either return or throw
  // This explicit throw satisfies TypeScript's control flow analysis
  throw new Error("Failed to fetch components after all retries.");
}

/**
 * Loads the component schema from Storyblok API and manages local caching.
 *
 * @async
 * @function loadSchema
 * @returns {Promise<{components: ComponentSchema[]; hasChanged: boolean}>}
 *          Object containing the fetched components and a change detection flag
 *
 * @description
 * Main entry point for schema management with the following workflow:
 * 1. Fetches current schema from Storyblok Management API
 * 2. Calculates SHA256 hash of the schema
 * 3. Compares with cached hash to detect changes
 * 4. If changed: updates cache and temp schema file
 * 5. If unchanged: skips regeneration for performance
 *
 * This caching mechanism prevents unnecessary type/schema regeneration,
 * significantly speeding up CI/CD pipelines when components haven't changed.
 *
 * @example
 * const { components, hasChanged } = await loadSchema();
 * if (hasChanged) {
 *   console.log('Schema changed, regenerating types...');
 *   // Run type generation
 * } else {
 *   console.log('Schema unchanged, skipping generation');
 * }
 *
 * @throws {Error} Exits process with code 1 on fatal errors (logged to console)
 */
export async function loadSchema(): Promise<{
  components: ComponentSchema[];
  hasChanged: boolean;
}> {
  try {
    // Step 1: Fetch components from API
    const components = await fetchComponents();
    console.log(`✅ Fetched ${components.length} components.`);

    // Step 2: Calculate hash for change detection
    const newHash = calculateHash(components);
    let oldHash = "";

    // Step 3: Attempt to read previous hash from cache
    try {
      oldHash = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    } catch {
      // Expected error if cache file doesn't exist yet (first run)
      // No action needed - oldHash remains empty string
    }

    // Step 4: Compare hashes to detect changes
    if (newHash === oldHash) {
      console.log("⏸️  Schema unchanged. Skipping generation.");
      return { components, hasChanged: false };
    }

    // Step 5: Schema changed - update cache files
    console.log("⚡ Schema changed! Updating hash...");

    // Update hash cache
    await fs.writeFile(CACHE_FILE_PATH, newHash);

    // Store raw schema for other scripts to use
    await fs.writeFile(TEMP_SCHEMA_PATH, JSON.stringify(components, null, 2));

    return { components, hasChanged: true };
  } catch (error: unknown) {
    // Fatal error handling: log and exit
    // Using console.error is appropriate for build scripts to communicate failures
    console.error("❌ Schema ingestion failed:", error);
    process.exit(1);
  }
}

// --- Direct Execution Logic ---

/**
 * Module execution check: runs loadSchema if executed directly via Node.js
 *
 * @description
 * This pattern allows the module to be both imported by other scripts
 * and executed directly from the command line. When run directly,
 * it initiates the schema loading process.
 *
 * @example
 * // Run directly:
 * $ node scripts/type-gen/fetch-schema.ts
 *
 * // Or import in another script:
 * import { loadSchema } from './type-gen/fetch-schema';
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  loadSchema();
}
