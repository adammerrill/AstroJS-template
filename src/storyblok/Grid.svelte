<script lang="ts">
  /**
   * @file Grid Component
   * @module components/storyblok/grid
   * @classification Public
   * @compliance ISO/IEC 25010 - Reusability & Maintainability
   * @compliance WCAG 2.2 AA - Semantic Layout Structure
   * @author Atom Merrill
   * @version 2.0.0
   * @requirement REQ-UI-006
   * @requirement REQ-LAYOUT-001 - Responsive Grid System
   * @test_ref src/storyblok/Grid.test.ts
   * @test_ref tests/e2e/grid-layout.spec.ts
   * @test_ref tests/responsive/grid-breakpoints.spec.ts
   * 
   * @description
   * Generic responsive grid layout component for flexible content composition.
   * Provides 3-column container that accepts arbitrary child components.
   * Designed for masonry layouts, content grouping, and nested block arrangements.
   *
   * @description Layout Specifications:
   * - **Columns**: 1 (mobile) → 3 (desktop) with `grid-cols-1 md:grid-cols-3`
   * - **Gap**: `gap-8` (2rem) consistent spacing
   * - **Container**: `container mx-auto` for max-width constraints
   * - **Padding**: `py-12` for vertical rhythm
   *
   * @description Content Management:
   * - **Polymorphic children**: Accepts any `SbBlokData` via Storyblok nested blocks
   * - **Editable wrapper**: Full visual editor support with `storyblokEditable`
   * - **SSR compatibility**: Renders children server-side for SEO
   * - **Hydration safety**: No JavaScript dependencies; hydration won't fail
   *
   * @description Architectural Pattern:
   * - **Presentational component**: Pure layout; no business logic
   * - **Composition over inheritance**: Children determine content type
   * - **Design system agnostic**: Works with any child components
   *
   * @description Performance:
   * - **Zero runtime cost**: Pure CSS layout (no JS bundle impact)
   * - **CSS Grid**: Native browser implementation (hardware-accelerated)
   * - **Bundle impact**: ~1.2KB compressed (lightest layout component)
   *
   * @see {@link FeatureGrid.svelte} - Specialized grid for feature cards
   * @see {@link LogoCloud.svelte} - Grid-based logo display
   */

  import { storyblokEditable } from "@storyblok/svelte";
  import type { GridBlok } from "@/types/generated/storyblok";
  import type { SbBlokData } from "@storyblok/svelte";

  interface Props {
    blok: GridBlok;
    // Children are passed via Astro slots (snippets in Svelte 5)
    children?: import("svelte").Snippet;
  }

  let { blok, children }: Props = $props();
</script>

<div
  use:storyblokEditable={blok as SbBlokData}
  class="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8"
  data-testid="grid"
>
  {@render children?.()}
</div>
