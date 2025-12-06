/**
 * @file Core Image Service Infrastructure
 * @module lib/image-loader
 * @description
 * Handles low-level URL manipulation for Storyblok's Image Service (Img2).
 * Responsible for URL signing, format negotiation, and applying processing filters.
 *
 * @see {@link https://www.storyblok.com/docs/image-service-storyblok } Storyblok Image Service Docs
 */

import type { ImageTransformOptions } from "@/types/storyblok";

/**
 * Image loader class for Storyblok's Image Service.
 * Provides a fluent API for building optimized image URLs with transformations.
 */
export class StoryblokImageLoader {
  private originalUrl: string;
  private options: ImageTransformOptions;

  /**
   * Creates a new image loader instance.
   * @param src - The original asset URL from Storyblok (e.g. https://a.storyblok.com/f/ ...)
   * @param options - Transformation settings for width, height, format, quality, etc.
   */
  constructor(src: string, options: ImageTransformOptions = {}) {
    this.originalUrl = src;
    this.options = options;
  }

  /**
   * Generates the final transformed image URL.
   *
   * Logic:
   * 1. Validates if the URL is a Storyblok asset.
   * 2. Appends the '/m/' service trigger for image processing.
   * 3. Adds dimensions WxH for responsive sizing.
   * 4. Applies quality, format, and focal filters as needed.
   *
   * @returns The processed URL ready for use in img src or srcset
   */
  public getUrl(): string {
    // Return original if not a Storyblok URL
    if (!this.originalUrl.includes("a.storyblok.com")) {
      return this.originalUrl;
    }

    // Return original if SVG (Storyblok Img2 doesn't process SVGs)
    if (this.originalUrl.endsWith(".svg")) {
      return this.originalUrl;
    }

    const { width = 0, height = 0, format, quality, focus, fitIn } = this.options;

    // No transformation requested
    if (width === 0 && height === 0 && !format && !quality) {
      return this.originalUrl;
    }

    // Construct the processing path
    // Pattern: /m/{width}x{height}
    let processPath = `/m/${width}x${height}`;

    if (fitIn) {
      processPath = `/m/fit-in/${width}x${height}`;
    }

    const filters: string[] = [];

    // Format Filter
    if (format) {
      filters.push(`format(${format})`);
    }

    // Quality Filter
    if (quality) {
      filters.push(`quality(${quality})`);
    }

    // Focal Point Filter (Manual Smart Cropping)
    if (focus) {
      filters.push(`focal(${focus})`);
    }

    // Construct Filter String
    // Pattern: /filters:filter1():filter2()
    const filterString = filters.length > 0 ? `/filters:${filters.join(":")}` : "";

    /**
     * URL Injection Logic:
     * We assume the URL format: https://a.storyblok.com/f/{space}/{dimensions}/{hash}/{filename}
     * We assume the Image Service expects the /m/ parameter appended to the end of the resource path.
     *
     * Note: If the URL already contains query parameters, we strip them to avoid conflicts.
     */
    const baseUrl = this.originalUrl.split("?")[0];

    return `${baseUrl}${processPath}${filterString}`;
  }
}