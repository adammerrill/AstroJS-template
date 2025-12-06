/* eslint-disable no-console */
/**
 * @file Runtime Validation Utility
 * @module lib/validation
 * @classification Internal
 * @compliance ISO/IEC 25010 - Reliability & Data Integrity
 * @compliance ISO/IEC 27001 - Input Validation & Sanitization
 * @author Atom Merrill
 * @version 1.0.0
 * @requirement REQ-SEC-001
 * @test_ref tests/unit/lib/validation.test.ts
 * 
 * @description
 * Zod-based runtime validation for Storyblok content. Prevents malformed data
 * from breaking UI and ensures type safety at runtime.
 *
 * @description Validation Flow:
 * 1. **Schema parsing**: Uses generated `StoryblokComponentSchema`
 * 2. **Error logging**: Dev mode shows detailed errors; prod mode warns only
 * 3. **Fallback behavior**: Returns original data if validation fails (fail-safe)
 * 4. **Type erasure**: Output matches expected TypeScript types
 */

import { StoryblokComponentSchema } from "@/types/generated/schemas";
import type { StoryblokComponent } from "@/types/generated/storyblok";

const logger = {
  warn: (...args: unknown[]) => {
    console.warn("[Runtime Validation]", ...args);
  },
  error: (...args: unknown[]) => {
    console.error("[Runtime Validation]", ...args);
  },
};

/**
 * Validates a single Storyblok component data object against the generated Zod schema.
 * @param data The raw component data from the API
 * @returns The parsed, typesafe data, or the original data if validation fails
 */
export function validateBlok<T = StoryblokComponent>(data: unknown): T {
  // Check basic shape: must be an object with a 'component' property
  if (!data || typeof data !== "object" || !("component" in data)) {
    return data as T;
  }

  const result = StoryblokComponentSchema.safeParse(data);

  if (!result.success) {
    // Safe cast: We verified 'component' exists in the check above.
    // We assume it is a string for logging purposes.
    const componentName = (data as { component: string }).component;

    if (import.meta.env.DEV) {
      logger.error(`Validation Failed for component: ${componentName}`);
      // Use console.error instead of format() to avoid deprecation warnings and get cleaner output
      console.error(result.error);
    } else {
      logger.warn(`Invalid component schema: ${componentName}`);
    }
    return data as T;
  }

  return result.data as T;
}
