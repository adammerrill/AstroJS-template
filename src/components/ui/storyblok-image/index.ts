/**
 * @file Storyblok Image Public API
 * @module components/ui/storyblok-image
 * @classification Public
 * @compliance ISO/IEC 25010 - Maintainability
 * @author Atom Merrill
 * @version 2.0.0
 * @requirement REQ-PERF-001
 * @requirement REQ-SYS-001
 * @test_ref src/components/ui/storyblok-image/storyblok-image.test.ts
 * 
 * @description
 * Public API for StoryblokImage component exporting root component and variant configuration.
 */

import StoryblokImage from "./storyblok-image.svelte";
import { imageVariants, type ImageVariants } from "./image-variants";

export {
  StoryblokImage,
  imageVariants,
  type ImageVariants,
};