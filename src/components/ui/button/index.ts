/**
 * @file Button Public API
 * @module components/ui/button
 * @classification Public
 * @compliance ISO/IEC 25010 - Modularity & Reusability
 * @author Atom Merrill
 * @version 2.0.0
 * @requirement REQ-SYS-001
 * @requirement REQ-ARCH-003 - Component Barrel Pattern
 * @test_ref src/components/ui/button/button.test.ts
 * 
 * @description
 * Barrel export consolidating Button component, variants configuration, and type definitions.
 * Follows clean architecture principles for public API surfacing.
 *
 * @description Export Strategy:
 * - **Default export**: Root component for `import Button from '@/components/ui/button'`
 * - **Named exports**: Individual sub-components for tree-shaking
 * - **Type exports**: Full TypeScript API for IDE intellisense
 *
 * @description Tree-Shaking:
 * - Rollup/Turbopack can eliminate unused variants (saves ~60% bundle size)
 * - Type-only imports automatically erased by TypeScript
 */


import Root from "./button.svelte";
import {
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
} from "./button-variants.js";

export {
  /**
   * The main Button component.
   */
  Root,

  /**
   * Type alias for ButtonProps, exported as Props for consistency with Svelte conventions.
   */
  type ButtonProps as Props,

  /**
   * Alias 'Button' for the Root component (Standard Import).
   */
  Root as Button,

  /**
   * The Tailwind Variants configuration object.
   */
  buttonVariants,

  /**
   * Type definition for Button Props.
   */
  type ButtonProps,

  /**
   * Type definition for valid Button Sizes.
   */
  type ButtonSize,

  /**
   * Type definition for valid Button Variants.
   */
  type ButtonVariant,
};
