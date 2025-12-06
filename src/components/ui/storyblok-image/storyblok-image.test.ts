/**
 * @file storyblok-image.test.ts
 * @description Unit tests for the StoryblokImage component (Epic 2 Features).
 */

import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import { StoryblokImage } from "./index";
import type { StoryblokAsset } from "@/types/storyblok";

const mockImage: StoryblokAsset = {
  filename: "https://a.storyblok.com/f/12345/2000x1000/abc/test.jpg",
  alt: "Test Alt Text",
  id: 123,
};

describe("StoryblokImage Component", () => {
  it("generates default responsive srcset widths (Epic 2 Requirement)", () => {
    render(StoryblokImage, {
      props: { image: mockImage, width: 2000, height: 1000 },
    });

    const img = screen.getByRole("img");
    const srcset = img.getAttribute("srcset") || "";

    // Verify all Epic 2 required breakpoints exist
    expect(srcset).toContain("640w");
    expect(srcset).toContain("768w");
    expect(srcset).toContain("1024w");
    expect(srcset).toContain("1280w");
    expect(srcset).toContain("1536w");
    
    // Verify structure
    expect(srcset).toContain("/m/640x320 640w"); // 2:1 aspect ratio maintained
  });

  it("applies aspect-ratio and LQIP background style", () => {
    render(StoryblokImage, {
      props: { 
        image: mockImage, 
        width: 1000, 
        height: 500, 
        loading: "lazy" 
      },
    });

    const img = screen.getByRole("img");
    const style = img.getAttribute("style");

    // Check CLS prevention
    expect(style).toContain("aspect-ratio: 1000 / 500");
    
    // Check LQIP injection (20px width)
    expect(style).toContain("background-image: url");
    expect(style).toContain("/m/20x10"); // 2:1 ratio small placeholder
  });

  it("does not apply blur/LQIP if loading is eager", () => {
    render(StoryblokImage, {
      props: { 
        image: mockImage, 
        width: 1000, 
        height: 500, 
        loading: "eager" 
      },
    });

    const img = screen.getByRole("img");
    const style = img.getAttribute("style");

    // LQIP should be absent for eager images to save requests
    expect(style).not.toContain("background-image");
    expect(img.className).not.toContain("img-loading");
  });

  it("handles onload state transition", async () => {
    render(StoryblokImage, {
      props: { image: mockImage, width: 100, height: 100, loading: "lazy" },
    });

    const img = screen.getByRole("img");
    
    // Initial State
    expect(img.className).toContain("img-loading");

    // Simulate Load
    await fireEvent.load(img);

    // Loaded State
    expect(img.className).toContain("img-loaded");
    expect(img.className).not.toContain("img-loading");
  });
});

describe("StoryblokImage Resilience", () => {
  it("renders safely when image data is null or undefined", () => {
    // Test with null by casting - this tests the component's null guards
    const { container } = render(StoryblokImage, { 
      props: { image: null as unknown as StoryblokAsset, width: 500 } 
    });
    
    const img = container.querySelector('img');
    
    // Component should render an img tag but with empty/safe src
    // The null guards in the component prevent errors and return empty strings
    if (img) {
      const src = img.getAttribute("src");
      expect(src).toBe("");
    } else {
      // Or component might not render at all (also acceptable)
      expect(img).toBeNull();
    }
  });

  it("handles missing filename gracefully", () => {
    const invalidImage = {
      filename: "",
      alt: "No filename",
      id: 456,
    } as StoryblokAsset;

    const { container } = render(StoryblokImage, {
      props: { image: invalidImage, width: 500, height: 300 },
    });

    const img = container.querySelector('img');
    
    // Should render but with empty src (graceful degradation)
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute("src")).toBe("");
    expect(img?.getAttribute("srcset")).toBeNull();
  });

  it("skips optimization for SVG files", () => {
    const svgImage: StoryblokAsset = {
      filename: "https://a.storyblok.com/f/12345/logo.svg",
      alt: "SVG Logo",
      id: 789,
    };

    render(StoryblokImage, {
      props: { image: svgImage, width: 200, height: 200 },
    });

    const img = screen.getByRole("img");
    
    // SVGs should not have srcset (no optimization needed)
    expect(img.getAttribute("srcset")).toBeNull();
    
    // Should use original SVG URL
    expect(img.getAttribute("src")).toBe(svgImage.filename);
  });

  it("skips optimization for non-Storyblok URLs", () => {
    const externalImage: StoryblokAsset = {
      filename: "https://example.com/image.jpg",
      alt: "External Image",
      id: 999,
    };

    render(StoryblokImage, {
      props: { image: externalImage, width: 500, height: 300 },
    });

    const img = screen.getByRole("img");
    
    // External URLs should not have srcset
    expect(img.getAttribute("srcset")).toBeNull();
  });
});
