<script lang="ts">
  /**
   * @file Feature Component
   * @module components/storyblok/feature
   * @classification Public
   * @compliance ISO/IEC 25010 - Reusability & Compatibility
   * @compliance WCAG 2.2 AA - Image Alt Text & Color Contrast
   * @author Atom Merrill
   * @version 2.0.0
   * @requirement REQ-UI-006
   * @requirement REQ-SYS-001 - Design System Component
   * @test_ref src/storyblok/Feature.test.ts
   * @test_ref tests/unit/feature-component.spec.ts
   * @test_ref tests/a11y/feature-contrast.spec.ts
   * 
   * @description
   * Atomic feature card component for grids and lists. Displays icon, headline,
   * and description in a standardized card layout. Used within `FeatureGrid`,
   * `FeatureAlternating`, and other composition containers.
   *
   * @description Content Architecture:
   * - **Icon handling**: Accepts `StoryblokAsset` with 64x64px recommended size
   * - **Flexible text**: Supports optional headline fallback to `name` field
   * - **Card styling**: `shadow-lg` and `card-hover` utility for visual elevation
   * - **Center alignment**: Flexbox `justify-center` for balanced composition
   *
   * @description Performance:
   * - **Lazy loading**: Icons use `loading="lazy"` as they're typically below fold
   * - **Object fit**: `object-contain` preserves aspect ratio of brand logos
   * - **Bundle impact**: ~1.5KB compressed (minimal atomic component)
   *
   * @description Migration Notes:
   * - **[Epic 4]**: Replaced raw `<img>` with `<StoryblokImage>` for format optimization
   * - **[Epic 5]**: Added `FeatureBlok` typing for strict property contracts
   *
   * @see {@link FeatureGrid.svelte} - Primary container for feature cards
   * @see {@link FeatureAlternating.svelte} - Alternative layout using this component
   */

  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/svelte";
  import type { FeatureBlok } from "@/types/generated/storyblok";
  import { StoryblokImage } from "@/components/ui/storyblok-image";

  interface Props {
    blok: FeatureBlok;
  }

  let { blok }: Props = $props();
</script>

<div
  use:storyblokEditable={blok as SbBlokData}
  class="card-hover p-6 bg-white shadow-lg rounded-lg text-center"
>
  {#if blok.image?.filename}
    <div class="mb-4 flex justify-center">
      <StoryblokImage
        image={blok.image}
        alt={blok.image.alt || blok.headline || "Feature Icon"}
        width={64}
        height={64}
        variant="rounded"
        class="object-contain"
        loading="lazy"
      />
    </div>
  {/if}

  <h3 class="text-xl font-bold text-gray-900 mb-2">
    {blok.headline || blok.name || "Feature Name"}
  </h3>

  <p class="text-gray-600 leading-relaxed">
    {blok.description || "Feature description placeholder"}
  </p>
</div>
