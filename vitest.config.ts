/**
 * @file vitest.config.ts
 * @description Configuration for the Vitest unit testing framework.
 * This config utilizes Astro's `getViteConfig` helper to inherit the project's
 * existing Vite settings (Svelte integration, path aliases, etc.).
 *
 * @module config/vitest
 * @see https://docs.astro.build/en/guides/testing/#vitest
 */

/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import type { UserConfig } from "vite";
// FIX: Imports InlineConfig from 'vite' to resolve TS Error 2305 ("Module 'vitest' has no exported member 'InlineConfig'.")
import type { InlineConfig } from "vite";
import path from "path"; // REQUIRED for robust path resolution

// Define a combined interface to satisfy TypeScript strict checks
interface VitestUserConfig extends UserConfig {
  /**
   * @property {InlineConfig} test - Configuration block for Vitest's specific settings.
   */
  test: InlineConfig;
}

export default getViteConfig({
  test: {
    /**
     * The test environment.
     * 'jsdom' simulates a browser environment (DOM, window, document) in Node.js,
     * which is required for testing Svelte components.
     */
    environment: "jsdom",

    /**
     * Glob patterns to include in the test run.
     */
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx,svelte}"],

    /**
     * Glob patterns to exclude from the test run.
     */
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "tests/**"],

    /**
     * Coverage configuration.
     */
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{js,ts,svelte}"],
      exclude: ["src/**/*.d.ts", "src/env.d.ts"],
    },

    /**
     * Setup files to run before each test file.
     * FIX: Corrected path from './src/vitest.setup.ts' to './vitest.setup.ts'
     * as the file is located in the project root based on the directory listing.
     * Uses path.resolve for maximum robustness.
     */
    setupFiles: [path.resolve("./vitest.setup.ts")],
  },

  /**
   * RESOLUTION CONFIGURATION (CRITICAL FOR SVELTE 5)
   *
   * We force Vite to resolve exports using the 'browser' condition and prioritize browser
   * fields. This loads the Svelte client-side runtime for testing, preventing the
   * "lifecycle_function_unavailable" Svelte error.
   */
  resolve: {
    conditions: ["browser"],
    mainFields: ["browser", "module", "main"],
  },

  /**
   * SSR CONFIGURATION
   * Ensures Svelte dependencies are processed by Vite/Vitest and not externalized.
   */
  ssr: {
    noExternal: ["@astrojs/svelte", "svelte", "clsx", "tailwind-merge"],
  },
} as VitestUserConfig);
