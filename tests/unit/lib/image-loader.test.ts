/**
 * @file image-loader.test.ts
 * @description Unit tests for the StoryblokImageLoader class.
 * Verifies URL construction, filter application, and edge case handling.
 */

import { describe, it, expect } from "vitest";
import { StoryblokImageLoader } from "@/lib/image-loader";

describe("StoryblokImageLoader", () => {
  const TEST_URL = "https://a.storyblok.com/f/123456/1000x800/a1b2c3d4/test-image.jpg";

  it("returns original URL if no options provided", () => {
    const loader = new StoryblokImageLoader(TEST_URL);
    expect(loader.getUrl()).toBe(TEST_URL);
  });

  it("returns original URL for non-Storyblok domains", () => {
    const external = "https://example.com/image.jpg";
    const loader = new StoryblokImageLoader(external, { width: 500 });
    expect(loader.getUrl()).toBe(external);
  });

  it("returns original URL for SVGs", () => {
    const svg = "https://a.storyblok.com/f/123/icon.svg";
    const loader = new StoryblokImageLoader(svg, { width: 500, format: "webp" });
    expect(loader.getUrl()).toBe(svg);
  });

  it("constructs basic resize URL correctly", () => {
    const loader = new StoryblokImageLoader(TEST_URL, { width: 800, height: 600 });
    // Expected: .../m/800x600
    expect(loader.getUrl()).toBe(`${TEST_URL}/m/800x600`);
  });

  it("applies format filter (WebP)", () => {
    const loader = new StoryblokImageLoader(TEST_URL, {
      width: 800,
      height: 600,
      format: "webp",
    });
    // Expected: .../m/800x600/filters:format(webp)
    expect(loader.getUrl()).toBe(`${TEST_URL}/m/800x600/filters:format(webp)`);
  });

  it("applies quality filter", () => {
    const loader = new StoryblokImageLoader(TEST_URL, {
      width: 800,
      height: 600,
      quality: 80,
    });
    // Expected: .../m/800x600/filters:quality(80)
    expect(loader.getUrl()).toBe(`${TEST_URL}/m/800x600/filters:quality(80)`);
  });

  it("applies multiple filters (format + quality)", () => {
    const loader = new StoryblokImageLoader(TEST_URL, {
      width: 500,
      height: 0,
      format: "avif",
      quality: 90,
    });
    expect(loader.getUrl()).toBe(
      `${TEST_URL}/m/500x0/filters:format(avif):quality(90)`
    );
  });

  it("handles focal point cropping", () => {
    const focalPoint = "400x300:500x400";
    const loader = new StoryblokImageLoader(TEST_URL, {
      width: 300,
      height: 300,
      focus: focalPoint,
    });
    expect(loader.getUrl()).toBe(
      `${TEST_URL}/m/300x300/filters:focal(${focalPoint})`
    );
  });

  it("handles 'fit-in' mode", () => {
    const loader = new StoryblokImageLoader(TEST_URL, {
      width: 400,
      height: 400,
      fitIn: true,
      format: 'webp'
    });
    expect(loader.getUrl()).toBe(
      `${TEST_URL}/m/fit-in/400x400/filters:format(webp)`
    );
  });
});
