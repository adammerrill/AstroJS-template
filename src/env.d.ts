/**
 * @file env.d.ts
 * @description TypeScript environment declarations for Astro project.
 *              Defines global Window interface extensions for test instrumentation
 *              and third-party script integration.
 *
 * @see {@link https://docs.astro.build/en/guides/typescript/}
 */

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="svelte" />

/**
 * Extends the global Window interface with custom properties.
 * These properties are used for:
 * - E2E test instrumentation (Playwright)
 * - Third-party script integration (Storyblok)
 */
interface Window {
  /**
   * Storyblok Visual Editor Bridge API.
   * Loaded dynamically when editing content in Storyblok's interface.
   * @see {@link https://www.storyblok.com/docs/guide/essentials/visual-editor}
   */
  StoryblokBridge: any;

  /**
   * Storyblok event registration helper.
   * Used to subscribe to real-time content updates in the Visual Editor.
   */
  storyblokRegisterEvent: any;

  /**
   * Test instrumentation: TestimonialSlider component state.
   * Exposes the active slide index for E2E assertions.
   */
  __testimonialActiveIndex?: number;

  /**
   * Test instrumentation: TestimonialSlider hydration flag.
   * Set to true when the Svelte component is fully interactive.
   */
  __testimonialReady?: boolean;

  /**
   * Test instrumentation: ContactForm component state.
   * Exposes form data, submission status, and validation errors.
   */
  __contactFormData?: any;
  __contactFormStatus?: "idle" | "submitting" | "success" | "error";
  __contactFormErrors?: any;

  /**
   * Test instrumentation: ContactForm hydration flag.
   * Set to true when the Svelte component is fully interactive.
   */
  __contactFormReady?: boolean;
}
