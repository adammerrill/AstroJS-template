/**
 * @file storyblok.ts
 * @description TypeScript type definitions for Storyblok content models.
 *              Provides type safety for CMS content structures used throughout
 *              the application, including global settings, navigation, and
 *              component-specific content types.
 *
 * @module types/storyblok
 * @version 1.0.0
 * @date 2025-11-30
 *
 * @see {@link https://www.storyblok.com/docs/guide/essentials/content-structures}
 */

import type { SbBlokData } from "@storyblok/astro";

/**
 * Represents a Storyblok link object.
 * Can be either an internal link (with cached_url) or external link (with url).
 *
 * @interface StoryblokLink
 * @property {string} [cached_url] - Internal link path (e.g., "about", "blog/post-1")
 * @property {string} [url] - External URL (e.g., "https://example.com")
 * @property {string} [linktype] - Type of link: "story" | "url" | "email" | "asset"
 * @property {string} [target] - Link target: "_self" | "_blank"
 * @property {string} [id] - Story UUID if linking to internal content
 */
export interface StoryblokLink {
  id?: string;
  cached_url?: string;
  url?: string;
  linktype?: "url" | "story" | "email" | "asset";
  fieldtype?: string;
  anchor?: string;
  target?: "_self" | "_blank";
  story?: {
    id: number;
    name: string;
    slug: string;
    full_slug: string;
    url: string;
  };
}

/**
 * Represents a single navigation item in the header or footer.
 *
 * @interface NavigationItem
 * @property {string} _uid - Unique identifier for this item
 * @property {string} name - Display text for the navigation link
 * @property {StoryblokLink} link - Link configuration object
 * @property {string} [component] - Component type identifier (usually "nav_item")
 */
export interface NavigationItem {
  _uid: string;
  name: string;
  link: StoryblokLink;
  component?: string;
}

/**
 * Represents a footer column with multiple links.
 *
 * @interface FooterColumn
 * @property {string} _uid - Unique identifier for this column
 * @property {string} title - Column heading text
 * @property {NavigationItem[]} links - Array of navigation items in this column
 * @property {string} [component] - Component type identifier (usually "footer_column")
 */
export interface FooterColumn {
  _uid: string;
  title: string;
  links: NavigationItem[];
  component?: string;
}

/**
 * Represents a social media link with icon.
 *
 * @interface SocialLink
 * @property {string} _uid - Unique identifier for this social link
 * @property {string} platform - Social platform name (e.g., "twitter", "linkedin", "github")
 * @property {string} url - Full URL to the social profile
 * @property {string} [icon] - Optional icon identifier or SVG path
 * @property {string} [component] - Component type identifier (usually "social_link")
 */
export interface SocialLink {
  _uid: string;
  platform: string;
  url: string;
  icon?: string;
  component?: string;
}

/**
 * Global Settings content type from Storyblok.
 * Contains site-wide configuration including navigation, footer, and metadata.
 *
 * @interface GlobalSettings
 * @extends {SbBlokData}
 *
 * @property {string} [site_title] - Site name displayed in header (e.g., "Astro Template")
 * @property {string} [site_description] - Default meta description for SEO
 * @property {string} [site_url] - Canonical site URL (e.g., "https://example.com")
 * @property {NavigationItem[]} [header_nav] - Main navigation menu items
 * @property {FooterColumn[]} [footer_columns] - Footer link columns
 * @property {SocialLink[]} [social_links] - Social media profile links
 * @property {string} [copyright_text] - Copyright notice text
 * @property {string} [logo_url] - URL to site logo image
 * @property {string} [favicon_url] - URL to favicon image
 * @property {string} [og_image] - Default Open Graph image URL
 * @property {string} [twitter_handle] - Twitter username for cards (without @)
 * @property {string} [google_analytics_id] - GA4 measurement ID
 * @property {string} [contact_email] - Primary contact email address
 * @property {string} [contact_phone] - Primary contact phone number
 * @property {boolean} [enable_newsletter] - Toggle newsletter signup section
 * @property {string} [newsletter_api_endpoint] - API endpoint for newsletter subscriptions
 */
export interface GlobalSettings extends SbBlokData {
  site_title?: string;
  site_description?: string;
  site_url?: string;
  header_nav?: NavigationItem[];
  footer_columns?: FooterColumn[];
  social_links?: SocialLink[];
  copyright_text?: string;
  logo_url?: string;
  favicon_url?: string;
  og_image?: string;
  twitter_handle?: string;
  google_analytics_id?: string;
  contact_email?: string;
  contact_phone?: string;
  enable_newsletter?: boolean;
  newsletter_api_endpoint?: string;
}

/**
 * Represents a rich text field from Storyblok.
 * Contains structured content in Storyblok's document format.
 * * @interface StoryblokRichText
 * @property {string} type - Document type (usually "doc")
 * @property {Array} content - Array of content nodes (paragraphs, headings, etc.)
 */
export interface StoryblokRichText {
  type: string;
  content?: StoryblokRichText[];
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  attrs?: Record<string, unknown>;
  text?: string;
}

/**
 * Represents an asset (image, video, file) from Storyblok.
 *
 * @interface StoryblokAsset
 * @property {string} filename - Full URL to the asset
 * @property {string} [alt] - Alt text for images
 * @property {string} [title] - Asset title
 * @property {string} [copyright] - Copyright information
 * @property {number} [fieldtype] - Storyblok internal field type
 */
export interface StoryblokAsset {
  filename: string;
  alt?: string;
  id?: number;
  title?: string;
  focus?: string;
  name?: string;
  source?: string;
  copyright?: string;
  fieldtype?: string;
}

/**
 * Type guard to check if a value is a valid NavigationItem.
 * * @param {unknown} item - Value to check
 * @returns {boolean} True if item is a valid NavigationItem
 */
export function isNavigationItem(item: unknown): item is NavigationItem {
  // We use type narrowing inside the return block.
  return (
    !!item && // Ensure item is not null/undefined
    typeof item === "object" && // Ensure it's an object
    // Perform safer type check on properties
    typeof (item as NavigationItem).name === "string" &&
    typeof (item as NavigationItem).link === "object"
  );
}

/**
 * Type guard to check if a value is a valid StoryblokLink.
 * * @param {unknown} link - Value to check
 * @returns {boolean} True if link is a valid StoryblokLink
 */
export function isStoryblokLink(link: unknown): link is StoryblokLink {
  return (
    !!link && // Ensure link is not null/undefined
    typeof link === "object" && // Ensure it's an object
    // Check if EITHER cached_url OR url is present and a string
    (typeof (link as StoryblokLink).cached_url === "string" ||
      typeof (link as StoryblokLink).url === "string")
  );
}

/**
 * Helper function to safely resolve a Storyblok link to a URL string.
 * Prioritizes internal links (cached_url) over external links (url).
 *
 * @param {StoryblokLink | undefined} link - Link object to resolve
 * @param {string} [fallback="#"] - Fallback URL if link is invalid
 * @returns {string} Resolved URL string
 *
 * @example
 * const url = resolveLink({ cached_url: "about" }); // Returns "/about"
 * const url = resolveLink({ url: "https://example.com" }); // Returns "https://example.com"
 * const url = resolveLink(undefined, "/"); // Returns "/"
 */
export function resolveLink(
  link: StoryblokLink | undefined,
  fallback: string = "#",
): string {
  if (!link) return fallback;

  if (link.cached_url) {
    // Internal link - prepend slash if not present
    return link.cached_url.startsWith("/")
      ? link.cached_url
      : `/${link.cached_url}`;
  }

  if (link.url) {
    // External link - return as-is
    return link.url;
  }

  return fallback;
}

/**
 * Helper function to determine if a link should open in a new tab.
 *
 * @param {StoryblokLink | undefined} link - Link object to check
 * @returns {boolean} True if link should open in new tab
 *
 * @example
 * const shouldOpenNewTab = isExternalLink({ url: "https://example.com" }); // true
 * const shouldOpenNewTab = isExternalLink({ cached_url: "about" }); // false
 */
export function isExternalLink(link: StoryblokLink | undefined): boolean {
  if (!link) return false;
  return link.target === "_blank" || (!!link.url && !link.cached_url);
}

/**
 * Base interface for all Storyblok components
 */
export interface StoryblokComponentBase {
  _uid: string;
  component: string;
  _editable?: string;
}
