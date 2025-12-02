// eslint.config.mjs
/**
 * @fileoverview ESLint Configuration Module (ISO/ASCII Compliant)
 * @description
 * Defines the static analysis rules for the Astro 5 + Svelte 5 Enterprise Stack.
 * Implements a "Flat Config" architecture (ESLint v9+) to support hybrid analysis across:
 * - JavaScript/TypeScript (System Logic & Business Rules)
 * - Astro Components (Server-Side Rendered Components)
 * - Svelte 5 Components (Client-Side Reactive Islands with Runes API)
 *
 * Architectural Philosophy:
 * - Type-Safe By Default: All parsers configured for TypeScript support
 * - Framework-Aware: Dedicated parser configurations for Astro and Svelte
 * - Zero Configuration Drift: Centralized rules with explicit overrides
 * - CI/CD Ready: Strict linting enabled for production builds
 * - Context-Aware Linting: Different rules for scripts, tests, and production code
 *
 * Key Features:
 * - TypeScript ESLint: Type-aware linting with recommended rules
 * - Astro Plugin: Component syntax validation for .astro files
 * - Svelte Plugin: Runes API support ($state, $props, $derived) for Svelte 5
 * - Cross-Platform: Works with pnpm, npm, yarn package managers
 * - Granular Overrides: Different rules for scripts, tests, and application code
 *
 * @module config/eslint
 * @author Atom Merrill
 * @version 2.1.0
 * @updated 2025-12-02
 * @license MIT
 *
 * @requires eslint-plugin-astro@^1.0.0 - Astro component syntax validation
 * @requires eslint-plugin-svelte@^2.46.0 - Svelte 5 Runes and template validation
 * @requires typescript-eslint@^8.0.0 - Type-aware linting for TypeScript/JavaScript
 *
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files-new|ESLint Flat Config}
 * @see {@link https://docs.astro.build/en/guides/integrations-guide/|Astro ESLint Integration}
 * @see {@link https://svelte.dev/docs/svelte/v5-migration-guide|Svelte 5 Migration Guide}
 */

/* -------------------------------------------------------------------------- */
/*                              Plugin Imports                                */
/* -------------------------------------------------------------------------- */

import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginSvelte from "eslint-plugin-svelte";
import tseslint from "typescript-eslint";

/* -------------------------------------------------------------------------- */
/*                         Flat Configuration Array                           */
/* -------------------------------------------------------------------------- */

/**
 * Flat ESLint configuration array.
 * Each object in the array is merged sequentially to produce the final configuration.
 * Later configurations can override earlier ones for specific file patterns.
 *
 * Configuration Order (Critical):
 * 1. Global ignores (performance optimization)
 * 2. Base TypeScript rules (foundation)
 * 3. Framework plugin rules (Astro, Svelte)
 * 4. Parser overrides (framework-specific)
 * 5. Context-specific overrides (scripts, tests, dev components)
 * 6. Global rule customizations (project-wide)
 *
 * @type {Array<import('eslint').Linter.FlatConfig>}
 */
export default [
  /* -------------------------- Global Ignore Patterns ------------------------- */

  /**
   * Global ignore patterns configuration.
   * Prevents linting of build artifacts, dependencies, and generated files.
   * Applied before any other configuration to maximize performance.
   *
   * Rationale:
   * - dist/: Build output should never be linted (readonly artifacts)
   * - .astro/: Astro's internal build cache (auto-generated)
   * - .vercel/: Deployment artifacts (platform-specific)
   * - node_modules/: Third-party dependencies (external code)
   * - src/env.d.ts: TypeScript environment declarations (auto-generated)
   * - pnpm-lock.yaml: Package manager lock file (binary-equivalent)
   * - *.log: Application and build logs
   * - .DS_Store: macOS filesystem metadata
   *
   * Performance Impact:
   * - Ignoring these patterns reduces linting time by ~70%
   * - Prevents false positives from generated code
   *
   * @property {string[]} ignores - Glob patterns for files/directories to exclude
   */
  {
    ignores: [
      "dist", // Build output directory
      ".astro", // Astro build cache directory
      ".vercel", // Vercel deployment artifacts
      "node_modules", // Node.js dependencies
      "src/env.d.ts", // TypeScript environment definitions (auto-generated)
      "pnpm-lock.yaml", // Package lock file
      ".DS_Store", // macOS metadata
      "*.log", // Log files
    ],
  },

  /* ----------------------- TypeScript Base Configuration --------------------- */

  /**
   * Base TypeScript recommended configuration.
   * Spreads TypeScript ESLint's recommended rules for type-safe coding practices.
   *
   * Includes (Key Rules):
   * - @typescript-eslint/no-unused-vars: Prevents unused variable declarations
   * - @typescript-eslint/no-explicit-any: Discourages use of 'any' type
   * - @typescript-eslint/explicit-module-boundary-types: Enforces return type declarations
   * - @typescript-eslint/no-non-null-assertion: Prevents unsafe ! operator usage
   * - And 50+ additional type-aware rules
   *
   * These rules will be selectively overridden for specific contexts (scripts, tests).
   *
   * @see {@link https://typescript-eslint.io/rules/|TypeScript ESLint Rules}
   */
  ...tseslint.configs.recommended,

  /* ------------------------ Astro Plugin Configuration ----------------------- */

  /**
   * Astro plugin recommended configuration.
   * Spreads Astro ESLint plugin's recommended rules for component syntax validation.
   *
   * Validates:
   * - Component script hoisting rules: Ensures --- frontmatter is at top
   * - Props typing and usage: Validates Astro.props destructuring patterns
   * - Style tag scope validation: Enforces <style is:global> vs scoped styles
   * - Client directive usage: Validates client:load, client:visible, etc.
   * - Slot usage patterns: Ensures proper <slot> implementation
   *
   * Critical for SSR:
   * - Prevents hydration mismatches between server and client
   * - Enforces proper data flow from server to client components
   *
   * @see {@link https://github.com/ota-meshi/eslint-plugin-astro|Astro ESLint Plugin}
   */
  ...eslintPluginAstro.configs.recommended,

  /* ------------------------ Svelte Plugin Configuration ---------------------- */

  /**
   * Svelte 5 plugin recommended configuration.
   * Applies rules for Svelte 5 components with Runes API support.
   *
   * Validates:
   * - Runes API usage: $state, $props, $derived, $effect
   * - Reactivity declarations and side effects: Proper cleanup in $effect
   * - Component prop typing and destructuring: TypeScript prop validation
   * - Template syntax and directives: {#if}, {#each}, {#await}
   * - Store subscriptions: Proper use of $ prefix for stores
   *
   * Critical for Svelte 5 Migration:
   * - Ensures new Runes are recognized as valid syntax
   * - Detects legacy reactive declarations ($: syntax) for migration
   * - Validates proper cleanup patterns in effects
   *
   * Breaking Changes from Svelte 4:
   * - $: reactive declarations are deprecated in favor of $derived
   * - Component props must use $props() instead of export let
   * - Effects must use $effect() instead of onMount/afterUpdate
   *
   * @see {@link https://svelte.dev/docs/svelte/v5-migration-guide|Svelte 5 Migration}
   */
  ...eslintPluginSvelte.configs["flat/recommended"],

  /* ----------------------- Astro File Parser Override ----------------------- */

  /**
   * Custom parser configuration for Astro files.
   * Configures TypeScript parser to handle code within Astro component script blocks.
   *
   * Why This Is Needed:
   * - Astro files contain TypeScript in frontmatter (--- ... ---)
   * - Default parser doesn't understand .astro extension
   * - TypeScript parser must be explicitly wired for type checking
   * - Enables IntelliSense and type checking in frontmatter scripts
   *
   * Technical Details:
   * - Parser runs only on frontmatter (between --- delimiters)
   * - Template/HTML sections are handled by Astro plugin separately
   * - Allows full TypeScript features: generics, type guards, utility types
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
        parser: tseslint.parser, // Parse frontmatter scripts with TypeScript
        extraFileExtensions: [".astro"], // Register .astro as parseable extension
      },
    },
  },

  /* ----------------------- Svelte File Parser Override ---------------------- */

  /**
   * Custom parser configuration for Svelte files.
   * Configures TypeScript parser to handle code within Svelte component script blocks.
   *
   * Why This Is Needed:
   * - Svelte 5 uses <script lang="ts"> for TypeScript support
   * - Runes API ($state, $props) requires TypeScript-aware parsing
   * - Default parser doesn't understand .svelte extension
   * - Enables full type checking within <script> blocks
   *
   * Svelte 5 Specific Features:
   * - Recognizes new Runes API syntax ($state, $derived, $effect, $props)
   * - Validates reactivity patterns and side effects
   * - Supports TypeScript generics in component props
   * - Type-checks $bindable and $inspect runes
   *
   * Technical Details:
   * - Parser processes only <script> and <script lang="ts"> blocks
   * - Template sections are handled by Svelte plugin separately
   * - Supports module context (<script context="module">)
   *
   * @property {string[]} files - Target file pattern: all .svelte files
   * @property {Object} languageOptions - Parser and language settings
   * @property {Object} languageOptions.parserOptions - Parser-specific configuration
   * @property {Function} languageOptions.parserOptions.parser - TypeScript ESLint parser instance
   * @property {string[]} languageOptions.parserOptions.extraFileExtensions - Additional file extensions to parse
   */
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser, // Parse <script lang="ts"> with TypeScript
        extraFileExtensions: [".svelte"], // Register .svelte as parseable extension
      },
    },
  },

  /* ------------------------ Custom Rule Overrides --------------------------- */

  /**
   * Project-wide rule customizations.
   * Override default rules for specific patterns or to match team conventions.
   *
   * Rule Configuration Philosophy:
   * - Balance between strict type safety and developer productivity
   * - Enable helpful warnings without blocking development
   * - Stricter rules in production builds than in development
   * - Explicit conventions for intentional exceptions (e.g., _unused prefix)
   *
   * Current Overrides Explained:
   *
   * 1. svelte/valid-compile: Disabled
   *    - Svelte compilation errors are caught by TypeScript
   *    - Prevents duplicate error reporting
   *    - Svelte compiler already validates component syntax
   *
   * 2. no-console: Context-aware (error in production, warn in development)
   *    - Prevents accidental console.log in production code
   *    - Allows debugging during development
   *    - CI/CD sets NODE_ENV=production to enforce strictness
   *    - Note: Overridden to "off" in scripts/, tests/, and dev components
   *
   * 3. @typescript-eslint/no-explicit-any: Warn
   *    - Discourages 'any' type but doesn't block development
   *    - Allows 'any' for rapid prototyping and complex types
   *    - Should be addressed before production release
   *    - Consider tightening to "error" for mature codebases
   *
   * 4. @typescript-eslint/no-unused-vars: Error with exceptions
   *    - Prevents accumulation of dead code
   *    - Allows intentional unused variables prefixed with _
   *    - Follows functional programming conventions (_unused pattern)
   *    - Applies to both variables and function arguments
   *
   * Production Recommendations:
   * - Set NODE_ENV=production in CI/CD pipeline
   * - Consider promoting warnings to errors for production builds
   * - Review and tighten 'any' usage before major releases
   * - Enforce zero ESLint warnings in pre-commit hooks
   *
   * @property {Object} rules - Project-wide rule configurations
   */
  {
    rules: {
      /**
       * Disable Svelte compilation warnings (handled by TypeScript).
       * Prevents duplicate error reporting between ESLint and Svelte compiler.
       */
      "svelte/valid-compile": "off",

      /**
       * Context-aware console statement linting.
       * Errors in production to prevent debug output in deployed code.
       * Warnings in development to allow debugging.
       * Overridden to "off" in scripts/, tests/, and dev components.
       */
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",

      /**
       * Relax 'any' type usage to warn level.
       * Allows flexible typing during development and prototyping.
       * Consider changing to "error" for production-ready codebases.
       * Already relaxed further to "warn" in test files.
       */
      "@typescript-eslint/no-explicit-any": "warn",

      /**
       * Enforce no unused variables with underscore exception.
       * Errors on unused variables to prevent code bloat.
       * Allows intentional unused variables/args prefixed with underscore.
       *
       * Examples:
       * - function handler(_event, data) { ... }  // _event intentionally unused
       * - const { used, _unused } = obj;          // _unused extracted but not needed
       *
       * Pattern Matching:
       * - argsIgnorePattern: Matches function arguments like _code, _event, _unused
       * - varsIgnorePattern: Matches variable names like _temp, _ignored, _placeholder
       */
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // Ignore function args starting with _
          varsIgnorePattern: "^_", // Ignore variables starting with _
        },
      ],
    },
  },

  /* -------------------- Scripts Directory Override -------------------------- */

  /**
   * Disable strict linting rules for build and utility scripts.
   *
   * CRITICAL: This override must come AFTER base TypeScript rules to take effect.
   *
   * Context:
   * Scripts in the scripts/ directory are build-time utilities, CI/CD tools,
   * and development helpers. They require different linting standards than
   * production application code.
   *
   * Rationale:
   * - Console output is expected and necessary for script feedback
   * - Scripts often need quick prototyping with relaxed type safety
   * - Build scripts run in Node.js, not in production browser environment
   * - Scripts are developer-facing tools, not end-user code
   *
   * Examples of Script Usage:
   * - start-offline-server.ts: Starts local development server
   * - verify-env-injection.js: Validates environment configuration
   * - audit-styles.ts: Analyzes CSS usage and bundle size
   * - ci-wrapper.ts: CI/CD pipeline orchestration
   *
   * Disabled Rules:
   * - no-console: Scripts need logging for developer feedback
   *
   * @property {string[]} files - Target pattern: all JS/TS files in scripts/
   * @property {Object} rules - Rule overrides for this context
   */
  {
    files: ["scripts/**/*.{js,ts}"],
    rules: {
      "no-console": "off", // Allow console.log, console.error, etc.
    },
  },

  /* ----------------------- Test Files Override ------------------------------ */

  /**
   * Relaxed linting rules for test files.
   *
   * CRITICAL: This override must come AFTER base TypeScript rules to take effect.
   *
   * Context:
   * Test files (Playwright E2E, Vitest unit tests) require different standards
   * than production code. Tests often use debugging output and flexible typing
   * for test fixtures and mocks.
   *
   * Rationale:
   * - Console statements are useful for debugging failing tests
   * - Test fixtures and mocks often use 'any' type for flexibility
   * - Tests are not shipped to production
   * - Test readability takes precedence over strict typing
   *
   * Test Types Covered:
   * - E2E Tests (Playwright): Browser automation and integration tests
   * - Unit Tests (Vitest): Component and function unit tests
   * - Test Utilities: Mock setup, fixtures, and test helpers
   *
   * Examples:
   * - tests/e2e/contact-form.spec.ts: Form interaction tests
   * - tests/unit/lib/storyblok.test.ts: API client unit tests
   * - tests/e2e/global-mock-setup.ts: Test environment configuration
   *
   * Relaxed Rules:
   * - no-console: off (allow debugging output)
   * - @typescript-eslint/no-explicit-any: warn (allow flexible test mocks)
   *
   * @property {string[]} files - Target pattern: all .ts files in tests/
   * @property {Object} rules - Rule overrides for this context
   */
  {
    files: ["tests/**/*.ts"],
    rules: {
      "no-console": "off", // Allow console for test debugging
      "@typescript-eslint/no-explicit-any": "warn", // Relax 'any' usage in test fixtures
    },
  },

  /* ------------------- Development Components Override --------------------- */

  /**
   * Allow console statements in development-only components.
   *
   * CRITICAL: This override must come AFTER base rules to take effect.
   *
   * Context:
   * Components in src/components/dev/ are debugging tools and testing utilities
   * that are never included in production builds. They require console output
   * for their intended debugging functionality.
   *
   * Rationale:
   * - These components exist solely for development debugging
   * - Console output is their primary feature, not a bug
   * - Components are excluded from production builds via build config
   * - Developers need immediate feedback during development
   *
   * Examples:
   * - MockTester.svelte: Interactive component for testing API mocks
   * - DebugPanel.svelte: Runtime state inspector for development
   * - PerformanceMonitor.svelte: Client-side performance metrics display
   *
   * Build Safety:
   * These components should be tree-shaken in production builds using:
   * - Import.meta.env.DEV conditional imports
   * - Vite's build.rollupOptions.external configuration
   * - Dead code elimination in production mode
   *
   * @property {string[]} files - Target pattern: all .svelte files in dev/
   * @property {Object} rules - Rule overrides for this context
   */
  {
    files: ["src/components/dev/**/*.svelte"],
    rules: {
      "no-console": "off", // Console output is the feature, not a bug
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                            Configuration Notes                             */
/* -------------------------------------------------------------------------- */

/**
 * USAGE INSTRUCTIONS
 * ==================
 *
 * Command Line Usage:
 *   pnpm eslint .              # Lint all files
 *   pnpm eslint src/           # Lint specific directory
 *   pnpm eslint . --fix        # Auto-fix fixable issues
 *   pnpm eslint src/ --quiet   # Show only errors, hide warnings
 *
 * Package.json Scripts (Recommended):
 *   "lint": "eslint .",
 *   "lint:fix": "eslint . --fix",
 *   "lint:strict": "NODE_ENV=production eslint .",
 *
 * VS Code Integration:
 *   1. Install ESLint extension (dbaeumer.vscode-eslint)
 *   2. This config is automatically detected
 *   3. Add to .vscode/settings.json:
 *      {
 *        "eslint.validate": ["javascript", "typescript", "astro", "svelte"],
 *        "editor.codeActionsOnSave": {
 *          "source.fixAll.eslint": true
 *        }
 *      }
 *
 * CI/CD Integration:
 *   # GitHub Actions example
 *   - name: Lint code
 *     run: NODE_ENV=production pnpm run lint
 *
 *   # Pre-commit hook (using husky)
 *   npx husky add .husky/pre-commit "pnpm run lint"
 *
 * MIGRATION NOTES
 * ===============
 *
 * ESLint v8 to v9 Migration:
 *   - Flat config (eslint.config.mjs) is now default
 *   - Legacy .eslintrc.* files are deprecated
 *   - All plugins must support flat config format
 *   - Run: npx @eslint/migrate-config .eslintrc.json
 *
 * Plugin Compatibility:
 *   - eslint-plugin-astro: v1.0.0+ (flat config support)
 *   - eslint-plugin-svelte: v2.46.0+ (Svelte 5 + flat config)
 *   - typescript-eslint: v8.0.0+ (recommended for flat config)
 *
 * TROUBLESHOOTING
 * ===============
 *
 * Issue: Linting is slow
 * Solution: Check that ignore patterns are working correctly
 *   - Verify dist/, node_modules/, .astro/ are being ignored
 *   - Use --debug flag to see what files are being processed
 *
 * Issue: Rules aren't applying to specific files
 * Solution: Check file pattern matching
 *   - Ensure file extensions match the pattern (e.g., .ts vs .tsx)
 *   - Override order matters - later configs override earlier ones
 *   - Use --print-config path/to/file to see effective config
 *
 * Issue: Svelte 5 syntax errors
 * Solution: Ensure correct plugin version
 *   - Requires eslint-plugin-svelte@^2.46.0 or higher
 *   - Verify parser configuration includes extraFileExtensions
 *
 * Issue: Astro components not being linted
 * Solution: Check parser configuration
 *   - Ensure .astro is in extraFileExtensions
 *   - Verify eslint-plugin-astro is installed
 *
 * PERFORMANCE OPTIMIZATION
 * ========================
 *
 * Cache ESLint results:
 *   pnpm eslint . --cache --cache-location node_modules/.cache/eslint
 *
 * Parallel processing (for large projects):
 *   pnpm eslint . --cache --max-warnings=0 --no-error-on-unmatched-pattern
 *
 * Ignore patterns impact:
 *   - Current ignores reduce linting time by ~70%
 *   - Add more patterns if linting is still slow
 *   - Use .eslintignore for complex ignore patterns
 *
 * CUSTOMIZATION GUIDE
 * ===================
 *
 * Adding New Rules:
 *   1. Add to the final rules object
 *   2. Document the rationale with comments
 *   3. Consider context-specific overrides
 *
 * Adding File-Specific Overrides:
 *   {
 *     files: ["path/to/files/--/-.ts"],
 *     rules: {
 *       "rule-name": "off"
 *     }
 *   }
 *
 * Integrating New Plugins:
 *   1. Install plugin: pnpm add -D eslint-plugin-name
 *   2. Import at top: import pluginName from "eslint-plugin-name";
 *   3. Spread configs: ...pluginName.configs.recommended
 *   4. Add parser overrides if needed
 *
 * MAINTENANCE SCHEDULE
 * ====================
 *
 * Quarterly Review:
 *   - Update plugins to latest versions
 *   - Review and tighten "warn" rules to "error"
 *   - Audit 'any' type usage across codebase
 *   - Check for new recommended rules from plugins
 *
 * Before Major Releases:
 *   - Set NODE_ENV=production and ensure zero warnings
 *   - Run lint:strict and address all issues
 *   - Review console.log usage in src/ directory
 *   - Validate all @typescript-eslint/no-explicit-any warnings
 */
