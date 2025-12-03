import { StoryblokComponentSchema } from "@/types/generated/schemas";
import type { StoryblokComponent } from "@/types/generated/storyblok";

const logger = {
  warn: (...args: unknown[]) => {
    console.warn("[Runtime Validation]", ...args);
  },
  error: (...args: unknown[]) => {
    console.error("[Runtime Validation]", ...args);
  }
};

/**
 * Validates a single Storyblok component data object against the generated Zod schema.
 * @param data The raw component data from the API
 * @returns The parsed, typesafe data, or the original data if validation fails
 */
export function validateBlok<T = StoryblokComponent>(data: unknown): T {
  // Check basic shape
  if (!data || typeof data !== 'object' || !('component' in data)) {
    return data as T;
  }

  const result = StoryblokComponentSchema.safeParse(data);

  if (!result.success) {
    if (import.meta.env.DEV) {
      logger.error(`Validation Failed for component: ${(data as any).component}`);
      // Use console.error instead of format() to avoid deprecation warnings and get cleaner output
      console.error(result.error);
    } else {
      logger.warn(`Invalid component schema: ${(data as any).component}`);
    }
    return data as T;
  }

  return result.data as T;
}
