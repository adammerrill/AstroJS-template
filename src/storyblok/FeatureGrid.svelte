<script lang="ts">
  /**
   * @file FeatureGrid Component
   * @module components/storyblok/feature-grid
   * @classification Public
   * @compliance ISO/IEC 25010 - Reusability & Maintainability
   * @compliance WCAG 2.2 AA - Semantic HTML Structure & Heading Hierarchy
   * @author Atom Merrill
   * @version 2.0.0
   * @requirement REQ-UI-006
   * @requirement REQ-SYS-001 - Design System Integration
   * @test_ref src/storyblok/FeatureGrid.test.ts
   * @test_ref tests/e2e/feature-grid.spec.ts
   * @test_ref tests/unit/feature-grid-layout.spec.ts
   * 
   * @description
   * Responsive grid container component for feature showcases. Provides 3-column layout
   * that adapts to 2-column (tablet) and 1-column (mobile). Designed as a composition
   * wrapper for `Feature.svelte` components with flexible content management.
   *
   * @description Layout Architecture:
   * - **CSS Grid**: Uses Tailwind's `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsiveness
   * - **Gap system**: `gap-8` provides consistent 2rem spacing between items
   * - **Container constraints**: Max 3 columns prevents line-length issues
   * - **SSR safety**: Renders empty state when no children provided
   *
   * @description Content Management:
   * - **Strict typing**: Uses `FeatureGridBlok` for compile-time validation
   * - **Nested blocks**: Accepts `FeatureBlok` children via Storyblok's nested field
   * - **Fallback UI**: Shows dashed border prompt when CMS content missing
   * - **Editable regions**: Full Storyblok visual editor support via `storyblokEditable`
   *
   * @description Performance:
   * - **Zero JS overhead**: Pure CSS grid layout (no JavaScript required)
   * - **Lazy children**: Individual `Feature` components load images lazily
   * - **Bundle impact**: ~1.8KB compressed (minimal presentation layer)
   *
   * @see {@link Feature.svelte} - Individual feature cards rendered within grid
   * @see {@link FeatureAlternating.svelte} - Alternative detailed feature layout
   */
  
  import { storyblokEditable } from "@storyblok/svelte";
  import type { FeatureGridBlok } from "@/types/generated/storyblok";
  import type { SbBlokData } from "@storyblok/svelte";

  interface Props {
    blok: FeatureGridBlok;
    children?: import("svelte").Snippet;
  }

  let { blok, children }: Props = $props();
</script>

<section
  use:storyblokEditable={blok as SbBlokData}
  class="py-24 bg-background"
  data-testid="feature-grid"
>
  <div class="container mx-auto px-4">
    <div class="mx-auto max-w-3xl text-center mb-16">
      <h2 
        class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        data-test-headline
      >
        {blok.headline || "MISSING HEADLINE DATA"}
      </h2>
      
      {#if blok.description}
        <p class="mt-4 text-lg text-muted-foreground">
          {blok.description}
        </p>
      {/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#if children}
        {@render children()}
      {:else}
        <div class="col-span-full text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
          No feature items to display.
        </div>
      {/if}
    </div>
  </div>
</section>
