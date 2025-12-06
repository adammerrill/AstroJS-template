/**
 * @file Utility functions for the application
 * @module lib/utils
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple CSS class values into a single optimized string.
 *
 * Merges Tailwind classes intelligently using tailwind-merge, resolving conflicts
 * (e.g., multiple padding classes) by keeping the most specific one.
 * Accepts strings, arrays, objects, and conditional class definitions.
 *
 * @param inputs - Variable number of class values (strings, arrays, objects)
 * @returns Optimized class string ready for class attribute
 *
 * @example
 * ```typescript
 * cn('px-4', 'py-2', { 'bg-blue-500': isActive, 'bg-gray-500': !isActive })
 * // Returns: 'px-4 py-2 bg-blue-500' (when isActive is true)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithElementRef<T = HTMLElement> = T & {
  ref?: T | null;
};
