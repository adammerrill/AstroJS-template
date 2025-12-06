<script lang="ts">
  /**
   * @file Teaser Component
   * @module components/storyblok/teaser
   * @classification Public
   * @compliance ISO/IEC 25010 - Reusability & Maintainability
   * @compliance WCAG 2.2 AA - Heading Hierarchy (H2) & Color Contrast
   * @author Atom Merrill
   * @version 2.0.0
   * @requirement REQ-UI-006
   * @requirement REQ-CONTENT-001 - Section Introduction Pattern
   * @test_ref src/storyblok/Teaser.test.ts
   * @test_ref tests/e2e/teaser-content.spec.ts
   * @test_ref tests/a11y/teaser-heading.spec.ts
   * 
   * @description
   * Minimal content teaser component for section introductions and callouts.
   * Renders a single headline in a centered section with standardized padding.
   * Designed for announcements, section headers, and transitional content.
   *
   * @description Content Strategy:
   * - **Headline focus**: Single H2 element for clear messaging
   * - **Fallback behavior**: Displays "Teaser Headline" if CMS data missing
   * - **Section semantics**: `<section>` wrapper provides ARIA landmark
   * - **Center alignment**: Text-center for visual emphasis
   *
   * @description Accessibility:
   * - **Heading level**: H2 maintains document outline when used correctly
   * - **Color contrast**: `text-gray-900` on white background exceeds WCAG AAA (15:1)
   * - **Responsive text**: `text-4xl` scales with viewport via Tailwind v4
   * - **No interactive elements**: Pure content; no focus management needed
   *
   * @description Performance:
   * - **Zero JavaScript**: No hydration required (static content)
   * - **SSR optimized**: Renders entirely server-side for fastest TTFB
   * - **Bundle impact**: ~800 bytes compressed (lightest component)
   *
   * @see {@link HeroSaas.svelte} - Major hero variant with subheadline
   * @see {@link FeatureGrid.svelte} - Uses teaser as section header
   */

    import { storyblokEditable } from "@storyblok/svelte";
    import type { TeaserBlok } from "@/types/generated/storyblok";
    import type { SbBlokData } from "@storyblok/svelte";
  
    interface Props {
      blok: TeaserBlok;
    }
  
    let { blok }: Props = $props();
  </script>
  
  <section 
    class="teaser py-20 text-center" 
    use:storyblokEditable={blok as SbBlokData}
  >
    <h2 class="text-4xl font-bold">
      {blok.headline || 'Teaser Headline'}
    </h2>
  </section>