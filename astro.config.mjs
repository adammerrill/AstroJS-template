// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import { storyblok } from '@storyblok/astro';
import vercel from '@astrojs/vercel';

// Determine the base site URL using an environment variable
// Use a placeholder/default URL for development if the variable isn't set, 
// but ensure it's a full URL (including the protocol).
const siteUrl = process.env.SITE_URL || 'https://localhost:4321';

// Load the Storyblok token using loadEnv
const env = loadEnv('', process.cwd(), 'STORYBLOK'); // Loads all variables starting with STORYBLOK_
const STORYBLOK_TOKEN = env.STORYBLOK_TOKEN;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  integrations: [
    svelte({ extensions: ['.svelte'] }),
    mdx(),
    sitemap(),
    partytown(),
    storyblok({
      accessToken: STORYBLOK_TOKEN, // Use the token loaded from the .env file
      // Optional: Set your Storyblok space region if it's not 'eu' (default)
      // apiOptions: { region: 'us' }, 
      
      // 👇 Component Mapping: This links Storyblok block names to your local Svelte/Astro components
      components: {
        'page': 'storyblok/Page',        // A top-level content type
        'feature': 'storyblok/Feature', // A nested component (Svelte)
        'grid': 'storyblok/Grid',       // Another nested component (Svelte)
        // Add all your Storyblok block names here, mapped to their file paths
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
});