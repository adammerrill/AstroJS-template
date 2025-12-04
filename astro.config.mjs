// astro.config.mjs
/**
 * @fileoverview Astro Configuration File (ISO/ASCII Compliant)
 * @description Defines the core build and runtime settings for the Astro project.
 * Integrates Svelte 5, Tailwind v4 (via Vite), Storyblok CMS, Sitemap generation, and Vercel SSR/SSG.
 *
 * @version 1.2.0
 * @updated 2025-12-04
 */

import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
import sitemap from "@astrojs/sitemap";
import { storyblok } from "@storyblok/astro";
import { loadEnv } from "vite";

// Load environment variables from .env file
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

/* -------------------------------------------------------------------------- */
/* Offline/Environment Logic                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Determine if running in Offline Mode.
 * This flag is injected by scripts/start-offline-server.ts.
 * We prioritize process.env over loaded env files for this specific flag.
 */
const isOffline = process.env.IS_OFFLINE === "true";

/**
 * Resolve Storyblok Token.
 * If Offline: Force empty string to trigger local fixtures.
 * If Online: Use token from process.env (CI) or loaded .env (Dev).
 */
const storyblokToken = isOffline
  ? ""
  : process.env.STORYBLOK_DELIVERY_API_TOKEN || env.STORYBLOK_DELIVERY_API_TOKEN;

export default defineConfig({
  site: "https://astro-js-template.vercel.app",
  output: "server",

  // Switch adapter based on mode:
  // - Offline: Use Node adapter for faster, dependency-free local serving
  // - Online/Prod: Use Vercel adapter for edge functions and image optimization
  adapter: isOffline
    ? node({ mode: "standalone" })
    : vercel({
        webAnalytics: { enabled: true },
        imageService: true,
      }),
  trailingSlash: "ignore",

  integrations: [
    svelte(),
    sitemap(),
    storyblok({
      accessToken: storyblokToken,
      enableDevTool: process.env.PLAYWRIGHT_TEST !== "true",
      components: {
        // HERO COMPONENTS
        hero_saas: "storyblok/HeroSaas",
        hero_local: "storyblok/HeroLocal",
        hero_consultant: "storyblok/HeroConsultant",

        // MARKETING COMPONENTS
        feature_grid: "storyblok/FeatureGrid",
        feature_alternating: "storyblok/FeatureAlternating",
        testimonial_slider: "storyblok/TestimonialSlider",
        logo_cloud: "storyblok/LogoCloud",

        // CONVERSION COMPONENTS
        pricing_table: "storyblok/PricingTable",
        contact_form: "storyblok/ContactForm",
        request_quote_form: "storyblok/RequestQuoteForm",

        // CORE LAYOUT
        page: "storyblok/Page",
        feature: "storyblok/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
      },
      bridge: {
        customParent: "https://app.storyblok.com",
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss(), mkcert()],
    logLevel: "info",
    server: {
      host: "localhost",
      https: true,
      // Note: This port (4321) is for the standard dev server.
      // The offline server script overrides this via CLI args (--port 4322).
      port: 4321,
      strictPort: true,
    },
    // Explicitly define the variable for client-side access if needed
    define: {
      "process.env.IS_OFFLINE": JSON.stringify(isOffline),
    },
  },
  devToolbar: {
    enabled: true,
  },
});
