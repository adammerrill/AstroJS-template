/**
 * @file Astro Configuration
 * @module astro.config
 * @description
 * Main configuration file for an Astro web application integrated with Storyblok CMS.
 * Defines site settings, build pipeline, integrations, and deployment configuration.
 *
 * Key Features:
 * - Storyblok headless CMS integration with component mapping
 * - Svelte component framework support
 * - TailwindCSS utility-first styling
 * - MDX content processing
 * - Automated sitemap generation
 * - Partytown third-party script optimization
 * - Vercel serverless deployment platform
 */

// @ts-check

import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import { storyblok } from "@storyblok/astro";
import vercel from "@astrojs/vercel";

/**
 * Base site URL.
 *
 * @description
 * Resolves from SITE_URL environment variable or defaults to localhost dev server.
 * Must include protocol (https://) for proper canonical URL generation and sitemap creation.
 *
 * @constant {string}
 * @default "https://localhost:4321"
 */
const siteUrl = process.env.SITE_URL || "https://localhost:4321";

/**
 * Loaded environment variables.
 *
 * @description
 * Extracts all environment variables with STORYBLOK_ prefix using Vite's loadEnv utility.
 * Required because Astro configuration files do not natively support environment variables.
 *
 * @constant {Object<string, string>}
 */
const env = loadEnv("", process.cwd(), "STORYBLOK"); // Loads variables starting with STORYBLOK_

/**
 * Storyblok API access token.
 *
 * @description
 * Retrieved from loaded environment variables for authenticating Storyblok API requests.
 * Stored separately for explicit type clarity and reuse.
 *
 * @constant {string}
 */
const STORYBLOK_TOKEN = env.STORYBLOK_TOKEN;

/**
 * Astro configuration object.
 *
 * @type {import('astro').AstroUserConfig}
 */
export default defineConfig({
  /** Canonical site URL used for sitemaps and absolute link generation */
  site: siteUrl,

  /** Active Astro integrations for extended functionality */
  integrations: [
    /** Svelte component framework support with default extensions */
    svelte({ extensions: [".svelte"] }),

    /** MDX content processing for markdown with embedded components */
    mdx(),

    /** XML sitemap generation for search engine optimization */
    sitemap(),

    /** Partytown integration for offloading third-party scripts to web workers */
    partytown(),

    /**
     * Storyblok CMS integration configuration.
     * Maps Storyblok content blocks to local Astro/Svelte components.
     *
     * @property {string} accessToken - API authentication token loaded from environment
     * @property {Object} components - Storyblok technical names to local component paths
     */
    storyblok({
      // Use token from environment variables for API authentication
      accessToken: STORYBLOK_TOKEN,

      // Optional: Configure Storyblok API region (default is 'eu', use 'us' for US spaces)
      // apiOptions: { region: 'us' },

      /**
       * Component mapping for Storyblok blocks.
       * Keys must exactly match Storyblok technical names in the CMS.
       * Values are paths relative to src/ directory (without file extensions).
       */
      components: {
        page: "storyblok/Page", // Top-level page content type component
        feature: "storyblok/Feature", // Reusable feature/display component (Svelte)
        grid: "storyblok/Grid", // Layout grid component (Svelte)
        // Additional Storyblok block mappings should be added here
      },
    }),
  ],

  /** Vite build tool configuration for development and production */
  vite: {
    /** TailwindCSS Vite plugin for utility-first CSS processing */
    plugins: [tailwindcss()],

    /** Development server optimization settings */
    server: {
      /** File system watching configuration */
      watch: {
        // Ignore test output directories to prevent unnecessary dev server reloads
        // Improves development performance when running Playwright tests
        ignored: ["**/playwright-report/**", "**/test-results/**"],
      },
    },
  },

  /** Deployment adapter configuration for Vercel serverless platform */
  adapter: vercel(),
});
