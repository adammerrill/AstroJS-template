/**
 * @module svelte.config
 * @description
 * Svelte configuration file for AstroJS application.
 * Configures the Svelte compiler and preprocessing pipeline.
 * Enables Vite-powered preprocessing for .svelte files.
 */
import { vitePreprocess } from "@astrojs/svelte";

/**
 * Default Svelte configuration object.
 * Defines preprocessors and supported file extensions.
 *
 * @type {object}
 * @property {Function} preprocess - Vite-powered preprocessor for Svelte files
 * @property {string[]} extensions - File extensions processed by Svelte
 */
export default {
  // Enable Vite-powered preprocessing for Svelte components
  preprocess: vitePreprocess(),

  // Restrict processing to .svelte files
  extensions: [".svelte"],
};
