/**
 * @file Vitest Configuration (ISO/ASCII Compliant)
 * @description
 * This config uses Astro's getViteConfig to merge with the project's Vite settings,
 * enabling Vitest for an Astro + Svelte (v5) project with jsdom test environment,
 * coverage, path aliases, SSR settings, and familiar file patterns.
 *
 * @module config/vitest
 * @version 2.0.0
 * @license MIT
 */

/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";
import path from "path";

/** Vitest + Vite configuration merged via Astro helper. */
export default getViteConfig({
  test: {
    environment: "jsdom",
    include: [
      "src/**/*.{test,spec}.{js,ts,jsx,tsx,svelte}",
      "tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx,svelte}",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.astro/**",
      "**/.vercel/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "tests/e2e/**",
    ],
    globals: true,
    testTimeout: 10000,
    setupFiles: [path.resolve("./vitest.setup.ts")],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{js,ts,svelte}"],
      exclude: [
        "src/**/*.d.ts",
        "src/env.d.ts",
        "src/**/*.{test,spec}.{js,ts}",
      ],
      // thresholds: { /* optionally add thresholds here */ }
    },
  },
  resolve: {
    conditions: ["browser", "development", "import"],
    mainFields: ["browser", "module", "main"],
    // path aliases from Astro will be merged automatically
  },
  ssr: {
    noExternal: [
      "@astrojs/svelte",
      "svelte",
      "clsx",
      "tailwind-merge",
      "@testing-library/svelte",
    ],
  },
  optimizeDeps: {
    include: ["svelte", "@testing-library/svelte"],
  },
});
