/**
 * @fileoverview Astro Configuration File (ISO/ASCII Compliant)
 * @description Defines the core build and runtime settings for the Astro project.
 * Integrates Svelte 5, Tailwind v4 (via Vite), Storyblok CMS, Sitemap generation, and Node.js SSR.
 *
 * ARCHITECTURE NOTES:
 * 1. OUTPUT: 'server' mode enables Server-Side Rendering (SSR) for dynamic routing.
 * 2. ADAPTER: Uses Node.js in standalone mode (compatible with Docker/Self-Hosting).
 * 3. TAILWIND: Configured as a Vite plugin (v4 standard), avoiding legacy Astro integrations.
 * 4. CMS: Storyblok bridge is configured with strict type mapping for components.
 * 5. SEO: Sitemap integration auto-generates sitemap-index.xml based on routes.
 *
 * @version 1.0.4
 * @date 2025-11-24
 */

import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
import sitemap from "@astrojs/sitemap";
import { storyblok } from "@storyblok/astro";
import { loadEnv } from "vite";

// Load environment variables to access STORYBLOK_TOKEN
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

/**
 * @type {import('astro/config').AstroUserConfig}
 */
export default defineConfig({
  // --- CORE ARCHITECTURE CONFIGURATION ---

  // Site: Required for sitemap and canonical URL generation
  site: "https://astro-js-template.vercel.app",

  // Output Mode: 'server' enables SSR/hybrid rendering for Server Islands
  output: "server",

  // Adapter: Node.js adapter for standalone SSR deployment
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  // Trailing Slash: Normalized to 'always' for consistency
  trailingSlash: "always",

  // --- INTEGRATIONS ---

  integrations: [
    // Svelte Integration: Supports Svelte 5 Runes for interactive islands
    svelte(),

    // Sitemap: Auto-generates sitemap.xml and sitemap-index.xml at build time
    sitemap(),

    // Storyblok CMS Integration: Handles content fetching and visual bridge
    storyblok({
      accessToken: env.STORYBLOK_DELIVERY_API_TOKEN,
      components: {
        // Register core layout components mapping here
        page: "storyblok/Page",
        feature: "storyblok/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
      },
      bridge: {
        customParent: "https://app.storyblok.com",
      }
    }),
  ],

  // --- BUILD & DEV CONFIGURATION ---

  vite: {
    plugins: [
      // Tailwind v4 is now a Vite plugin
      tailwindcss(),
      mkcert(), // Local HTTPS for development
    ],
    logLevel: 'info',
  },

  // Dev Toolbar: explicitly enabled for debugging hydration issues
  devToolbar: {
    enabled: true,
  },
});
