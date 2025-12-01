/**
 * @module svelte.config
 * @description
 * Svelte configuration file for AstroJS application.
 * Configures the Svelte compiler and preprocessing pipeline.
 * Enables Vite-powered preprocessing and Svelte 5 runes mode.
 */
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/**
 * Default Svelte configuration object.
 * Defines preprocessors, compiler options, and supported file extensions.
 *
 * @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig}
 */
export default {
  // Enable Vite-powered preprocessing for Svelte components
  preprocess: vitePreprocess(),

  // Compiler Options: Enable Svelte 5 runes mode
  compilerOptions: {
    runes: true, // CRITICAL: Enables $props, $state, $effect, $derived
  },

  // Restrict processing to .svelte files
  extensions: [".svelte"],
};
