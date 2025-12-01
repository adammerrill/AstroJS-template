/**
 * @fileoverview Astro Configuration File (ISO/ASCII Compliant)
 * @description Defines the core build and runtime settings for the Astro project.
 * Integrates Svelte 5, Tailwind v4 (via Vite), Storyblok CMS, Sitemap generation, and Vercel SSR.
 *
 * @version 1.1.0
 * @date 2025-12-01
 */

import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
import sitemap from "@astrojs/sitemap";
import { storyblok } from "@storyblok/astro";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineConfig({
  site: "https://astro-js-template.vercel.app",
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  trailingSlash: "ignore",

  integrations: [
    svelte(),
    sitemap(),
    storyblok({
      accessToken: env.STORYBLOK_DELIVERY_API_TOKEN,
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
    plugins: [
      tailwindcss(),
      mkcert(),
    ],
    logLevel: "info",
    server: {
      host: "localhost",
      https: true,
      port: 4321,
      strictPort: true,
    },
  },
  devToolbar: {
    enabled: true,
  },
});
