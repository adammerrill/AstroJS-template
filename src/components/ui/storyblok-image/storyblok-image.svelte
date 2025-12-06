<script lang="ts">
  /**
   * @file Storyblok Image Component
   * @module components/ui/storyblok-image
   * @classification Public
   * @compliance ISO/IEC 25010 - Performance Efficiency
   * @compliance ISO/IEC 27001 - Asset Security & Data Integrity
   * @compliance REQ-PERF-001 - CLS Prevention & LQIP Implementation
   * @compliance REQ-UI-008 - Rich Media Display Standards
   * @author Atom Merrill
   * @version 3.0.0
   * @requirement REQ-SYS-001
   * @test_ref src/components/ui/storyblok-image/storyblok-image.test.ts
   * @test_ref tests/performance/lcp-optimization.spec.ts
   * 
   * @description
   * Production image component implementing "Source of Truth" strategy for all CMS assets.
   * Features responsive srcset, LQIP blur-up, CLS prevention, and format optimization.
   *
   * @description Performance Architecture:
   * - **srcset generation**: 5 breakpoints (640w, 768w, 1024w, 1280w, 1536w)
   * - **CLS Prevention**: Enforces aspect-ratio + explicit width/height
   * - **LQIP**: 20px thumbnail at quality=10 for instant visual feedback
   * - **SSR Safety**: Graceful degradation for missing assets
   * - **SVG passthrough**: Bypasses optimization for vector graphics
   *
   * @description Security:
   * - Validates StoryblokAsset interface at compile time
   * - URL sanitization via StoryblokImageLoader
   * - Prevents XSS via filename validation
   */

  import { type StoryblokAsset } from "@/types/storyblok";
  import { StoryblokImageLoader } from "@/lib/image-loader";
  import { cn } from "@/lib/utils";
  import { imageVariants, type ImageVariants } from "./image-variants";

  interface Props {
    /** The raw asset object from Storyblok API */
    image: StoryblokAsset;
    /** Fallback alt text if not provided in CMS */
    alt?: string;
    /** Base width (Required for aspect ratio calculation) */
    width?: number;
    /** Base height (Required for aspect ratio calculation) */
    height?: number;
    /** Visual variant from image-variants.ts */
    variant?: ImageVariants["variant"];
    /** Shadow depth */
    shadow?: ImageVariants["shadow"];
    /** Additional CSS classes */
    class?: string;
    /** Loading strategy */
    loading?: "lazy" | "eager";
    /** Fetch Priority for LCP Optimization */
    fetchpriority?: "high" | "low" | "auto";
    /** Responsive breakpoints for srcset generation */
    widths?: number[];
    /** Sizes attribute for browser resource selection */
    sizes?: string;
    /** Force specific output format (e.g. for logos needing transparency) */
    format?: "webp" | "avif" | "jpeg" | "png";
  }

  // Standard breakpoints covering mobile to 2k screens
  const DEFAULT_WIDTHS = [640, 768, 1024, 1280, 1536];

  // Svelte 5 Props Destructuring
  let {
    image,
    alt = "",
    width,
    height,
    variant = "default",
    shadow = "none",
    class: className,
    loading = "lazy",
    fetchpriority = "auto",
    widths = DEFAULT_WIDTHS,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    format,
    ...rest
  }: Props = $props();

  // State: Tracks load status for blur-up effect
  let isLoaded = $state(false);

  /**
   * Helper: Generates optimized URLs using the Loader logic.
   * @param w - Target width
   * @param q - Optional quality override (for LQIP)
   */
  const generateUrl = (w: number, q?: number): string => {
    // NULL GUARD: Return empty string if image is missing or invalid
    if (!image || !image.filename) {
      return '';
    }

    let h = 0;
    // Calculate proportional height to maintain aspect ratio
    if (width && height && w) {
      h = Math.round((w / width) * height);
    }

    const loader = new StoryblokImageLoader(image.filename, {
      width: w,
      height: h,
      smart: true,
      quality: q,
      format: format,
    });
    return loader.getUrl();
  };

  /**
   * Computed fallback image URL for cases where srcset is not available.
   * Uses the original Storyblok asset URL with optional width parameter.
   */
  let src = $derived(
    image && image.filename 
      ? (width ? generateUrl(width) : image.filename)
      : ''
  );

  /**
   * Computed responsive srcset string for multiple screen densities/sizes.
   * Generates URLs for each breakpoint width defined in DEFAULT_WIDTHS.
   */
  let srcset = $derived.by(() => {
    if (!image || !image.filename) {
      return undefined;
    }
    
    if (image.filename.endsWith('.svg') || !image.filename.includes('storyblok.com')) {
      return undefined;
    }
    return widths.map((w) => `${generateUrl(w)} ${w}w`).join(", ");
  });

  /**
   * Computed Low-Quality Image Placeholder URL for progressive loading blur effect.
   * Only generated for lazy-loaded non-SVG images to improve perceived performance.
   */
  let lqipUrl = $derived.by(() => {
    if (!image || !image.filename) {
      return "";
    }
    
    if (loading === "lazy" && !image.filename.endsWith('.svg') && image.filename.includes('storyblok.com')) {
      return generateUrl(20, 10);
    }
    return "";
  });

  /**
   * Computed inline styles for aspect ratio enforcement and LQIP background.
   * Prevents CLS by setting aspect-ratio and shows blur placeholder while loading.
   */
  let style = $derived.by(() => {
    let s = "";
    if (width && height) {
      s += `aspect-ratio: ${width} / ${height};`;
    }
    if (lqipUrl) {
      s += `background-image: url('${lqipUrl}'); background-size: cover; background-position: center;`;
    }
    return s;
  });

  /**
   * Handles image load event to transition from blur placeholder to sharp image.
   * Triggers the blur-up effect when the full-resolution image finishes loading.
   */
  function onLoad() {
    isLoaded = true;
  }
</script>

<img
  {src}
  {srcset}
  {sizes}
  alt={image?.alt || alt}
  loading={loading}
  fetchpriority={fetchpriority}
  class={cn(
    imageVariants({ variant, shadow }), 
    // Apply blur class if lazy loading and not yet loaded
    loading === "lazy" ? (isLoaded ? "img-loaded" : "img-loading") : "", 
    className
  )}
  {style}
  width={width}
  height={height}
  decoding="async"
  onload={onLoad}
  {...rest}
/>
