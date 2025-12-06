/**
 * @file Storyblok Image Variants Configuration
 * @module components/ui/storyblok-image/variants
 * @classification Public
 * @compliance ISO/IEC 25010 - Performance Efficiency
 * @compliance REQ-PERF-001 - Image Optimization Standards
 * @author Atom Merrill
 * @version 2.0.0
 * @requirement REQ-PERF-001 - Image Optimization Standards
 * @requirement REQ-SYS-001 - Component Styling Conventions
 * @test_ref src/components/ui/storyblok-image/storyblok-image.test.ts
 * 
 * @description
 * Tailwind CSS v4 styling configuration for StoryblokImage component.
 * Defines responsive behavior and visual variants for CMS-managed assets.
 *
 * @description Performance Implications:
 * - **Base layer**: `max-w-full h-auto` prevents layout shift
 * - **Transition**: 500ms ease-out for blur-up effect
 * - **Shadow variants**: Soft shadows for elevated image cards
 */

import { tv, type VariantProps } from "tailwind-variants";

export const imageVariants = tv({
  base: "block max-w-full h-auto transition-all duration-500 ease-out",
  variants: {
    variant: {
      default: "rounded-none",
      rounded: "rounded-lg",
      avatar: "rounded-full aspect-square object-cover",
      hero: "w-full object-cover h-[50vh] md:h-[70vh]",
    },
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    shadow: "none",
  },
});

export type ImageVariants = VariantProps<typeof imageVariants>;
