/* eslint-disable no-console */
/**
 * @file validation.ts
 * @description Runtime validation utility for Storyblok content.
 * Disables no-console rule as this module's purpose is to log validation errors.
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
