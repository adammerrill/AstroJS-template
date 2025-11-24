/**
 * @file Tailwind CSS Configuration
 * @module tailwind.config
 * @description
 * Tailwind CSS configuration module for an AstroJS application.
 *
 * Configures content scanning paths, custom theme extensions, and
 * safelisted utilities to support component-based development
 * in an AstroJS environment.
 *
 * @type {import('tailwindcss').Config}
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * Content source paths for utility class detection.
   *
   * Glob patterns specifying all project files to scan for Tailwind
   * CSS class usage. Includes Astro components, HTML, and various
   * JavaScript/TypeScript frameworks used in modern web development.
   *
   * @type {string[]}
   */
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,svelte}"],

  /**
   * Theme customization section.
   *
   * Extends Tailwind's default theme with project-specific design
   * tokens while maintaining backward compatibility.
   */
  theme: {
    extend: {
      /**
       * Custom maximum width scale.
       *
       * Adds domain-specific width constraints for consistent layout
       * and optimal content presentation.
       */
      maxWidth: {
        /**
         * Optimal content width for typographic readability.
         *
         * Value is 720px (45rem), based on research indicating optimal
         * reading line length of 45-75 characters in Latin-based scripts.
         * This width reduces eye strain and improves comprehension.
         *
         * @type {string}
         */
        content: "720px",
      },
    },
  },

  /**
   * Safelisted utility classes.
   *
   * Forces inclusion of specified classes in production builds, even
   * if not statically detectable in source files. Essential for
   * dynamically generated classes in Astro components or client-side
   * scripts that manipulate the DOM.
   *
   * Classes:
   * - max-w-content: Applies custom content width limit
   * - glass: Glass morphism effect utility
   * - header-glass: Header-specific glass effect variant
   *
   * @type {string[]}
   */
  safelist: ["max-w-content", "glass", "header-glass"],
};
