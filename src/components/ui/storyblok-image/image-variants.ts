/**
 * @file image-variants.ts
 * @description Tailwind CSS v4 styling configuration for StoryblokImage.
 * Defines standard visual variants to ensure UI consistency.
 *
 * @module components/ui/storyblok-image/variants
 * @version 1.0.0
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
