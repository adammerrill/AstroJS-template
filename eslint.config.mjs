/**
 * @module ESLintConfiguration
 * @description
 * ESLint configuration module for an AstroJS application with TypeScript support.
 * Implements the flat configuration format (eslint.config.mjs) to define linting rules,
 * parser settings, and ignore patterns for JavaScript, TypeScript, and Astro files.
 *
 * @requires eslint-plugin-astro - Provides Astro-specific linting rules and processor
 * @requires typescript-eslint - Provides TypeScript parser and recommended rule set
 *
 * @exports {Array<Object>} default - Flat ESLint configuration array
 */

// Import ESLint plugin for Astro component linting
import eslintPluginAstro from "eslint-plugin-astro";

// Import TypeScript ESLint tools for type-aware linting
import tseslint from "typescript-eslint";

/**
 * Flat ESLint configuration array for AstroJS TypeScript project.
 * Each configuration object is merged to produce the final linting configuration.
 *
 * @type {Array<import('eslint').Linter.FlatConfig>}
 */
export default [
  /**
   * Global ignore patterns configuration.
   * Prevents linting of build artifacts, dependencies, and generated files.
   *
   * @property {string[]} ignores - Glob patterns for files/directories to exclude
   */
  {
    ignores: [
      "dist", // Build output directory
      ".astro", // Astro build cache directory
      ".vercel", // Vercel deployment artifacts
      "node_modules", // Node.js dependencies
      "src/env.d.ts", // TypeScript environment definitions
      "pnpm-lock.yaml", // Package lock file
    ],
  },

  /**
   * Base TypeScript recommended configuration.
   * Spreads TypeScript ESLint recommended rules for type-safe coding practices.
   */
  ...tseslint.configs.recommended,

  /**
   * Astro plugin recommended configuration.
   * Spreads Astro ESLint plugin recommended rules for Astro component syntax validation.
   */
  ...eslintPluginAstro.configs.recommended,

  /**
   * Custom parser configuration for Astro files.
   * Configures TypeScript parser to handle code within Astro component script blocks.
   *
   * @property {string[]} files - Target file pattern: all .astro files
   * @property {Object} languageOptions - Parser and language settings
   * @property {Object} languageOptions.parserOptions - Parser-specific configuration
   * @property {Function} languageOptions.parserOptions.parser - TypeScript ESLint parser instance
   * @property {string[]} languageOptions.parserOptions.extraFileExtensions - Additional file extensions to parse
   */
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        // Parse script tags inside Astro files using TypeScript parser
        parser: tseslint.parser,
        // Register Astro file extension for proper parsing
        extraFileExtensions: [".astro"],
      },
    },
  },
];
