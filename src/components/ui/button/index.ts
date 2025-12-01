/**
 * @file index.ts
 * @description Public API export for the Button component directory.
 * This barrel file exports the component itself, the variant configuration, and all associated types.
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
