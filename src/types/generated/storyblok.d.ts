/**
 * @file storyblok.ts
 * @description Core base types for Storyblok integration.
 * Component-specific types are now AUTO-GENERATED in src/types/generated/storyblok.d.ts
 *
 * @module types/storyblok
 */

import type { SbBlokData } from "@storyblok/astro";

/**
 * Represents a Storyblok link object.
 */
export interface StoryblokLink {
  cached_url?: string;
  url?: string;
  linktype?: "story" | "url" | "email" | "asset";
  target?: "_self" | "_blank";
  id?: string;
}

/**
 * Represents a rich text field from Storyblok.
 */
export interface StoryblokRichText {
  type: string;
  content?: Array<{
    type: string;
    content?: SbBlokData[];
    attrs?: Record<string, unknown>;
    marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
    text?: string;
  }>;
}

/**
 * Represents an asset (image, video, file) from Storyblok.
 */
export interface StoryblokAsset {
  filename: string;
  alt?: string;
  title?: string;
  copyright?: string;
  fieldtype?: string;
}

// --- Helpers ---

/**
 * Type guard to check if a value is a valid StoryblokLink.
 */
export function isStoryblokLink(link: unknown): link is StoryblokLink {
  return (
    !!link && 
    typeof link === "object" && 
    (typeof (link as StoryblokLink).cached_url === "string" ||
      typeof (link as StoryblokLink).url === "string")
  );
}

/**
 * Helper function to safely resolve a Storyblok link to a URL string.
 */
export function resolveLink(
  link: StoryblokLink | undefined,
  fallback: string = "#",
): string {
  if (!link) return fallback;
  if (link.cached_url) {
    return link.cached_url.startsWith("/")
      ? link.cached_url
      : `/${link.cached_url}`;
  }
  if (link.url) {
    return link.url;
  }
  return fallback;
}

export function isExternalLink(link: StoryblokLink | undefined): boolean {
  if (!link) return false;
  return link.target === "_blank" || (!!link.url && !link.cached_url);
}
