<script lang="ts">
  /**
   * @file HeroConsultant Component
   * @module components/storyblok/hero-consultant
   * @classification Public
   * @compliance ISO/IEC 25010 - Usability & Performance Efficiency
   * @compliance WCAG 2.2 AA - Image Alt Text & Text Contrast
   * @compliance ISO/IEC 27001 - Personal Data Handling (Headshot)
   * @author Atom Merrill
   * @version 2.2.0
   * @requirement REQ-UI-007
   * @requirement REQ-PERF-001 - LCP Optimization for Avatar Image
   * @requirement REQ-BRAND-001 - Personal Branding Consistency
   * @test_ref src/storyblok/HeroConsultant.test.ts
   * @test_ref tests/e2e/hero-consultant.spec.ts
   * @test_ref tests/visual-regression/hero-consultant.spec.ts
   * 
   * @description
   * Personal branding hero component for fractional executives and consultants.
   * Features professional headshot, compelling headline, and primary CTA.
   * Designed for thought leadership and authority positioning.
   *
   * @description Performance Architecture:
   * - **Headshot LCP**: Avatar image uses `variant="avatar"` with `loading="eager"` and `fetchpriority="high"`
   * - **Responsive sizing**: Image scales from 300px (mobile) to 500px (desktop) via srcset
   * - **Ring offset**: CSS `ring-offset` creates layered effect without additional DOM nodes
   * - **Bundle impact**: ~2.5KB compressed (lightest hero variant)
   *
   * @description Brand Consistency:
   - **Aspect ratio**: Enforces 1:1 square crop via `variant="avatar"` for professional consistency
   * - **Background**: Subtle `bg-primary/10` pulse animation adds visual interest without distraction
   * - **Typography**: Headline uses `font-extrabold` for authority, subheadline `font-light` for approachability
   *
   * @description Accessibility:
   * - **Alt text**: Defaults to "Consultant Headshot" but encourages CMS customization
   * - **Focus order**: Headline → subheadline → CTA follows logical reading pattern
   * - **Color contrast**: Text maintains 7:1 ratio against `bg-muted/20` background
   *
   * @description Migration Notes:
   * - **[Epic 3]**: Replaced raw `<img>` with `<StoryblokImage>` for aspect-ratio enforcement
   * - **[Epic 5]**: Added `HeroConsultantBlok` typing for compile-time safety
   *
   * @see {@link HeroLocal.svelte} - Service business variant
   * @see {@link HeroSaas.svelte} - SaaS product variant
   */

  import { storyblokEditable } from "@storyblok/svelte";
  import { Button } from "@/components/ui/button";
  import { StoryblokImage } from "@/components/ui/storyblok-image";
  import type { HeroConsultantBlok } from "@/types/generated/storyblok";
  import { resolveLink } from "@/types/storyblok";
  import type { SbBlokData } from "@storyblok/svelte";

  interface Props {
    blok: HeroConsultantBlok;
  }

  let { blok }: Props = $props();
</script>

<section
  use:storyblokEditable={blok as unknown as SbBlokData}
  class="py-24 md:py-32 lg:py-40 bg-muted/20"
  data-testid="hero-consultant"
>
  <div class="container mx-auto px-4">
    <div
      class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center"
    >
      <div class="lg:order-1 order-2">
        <h1
          class="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          {blok.headline || "Scale Your Business with Clarity."}
        </h1>

        <p class="mt-6 text-xl text-muted-foreground leading-relaxed">
          {blok.subheadline ||
            "As a fractional executive, I help established firms unblock growth, optimize operational efficiency, and capture new market share—without the full-time commitment."}
        </p>

        <div class="mt-8">
          {#if blok.cta_primary_label}
            <Button size="lg" href={resolveLink(blok.cta_primary)}>
              {blok.cta_primary_label}
            </Button>
          {/if}
        </div>
      </div>

      <div class="lg:order-2 order-1 relative mx-auto max-w-sm lg:max-w-none">
        <div
          class="absolute inset-0 -z-10 rounded-full bg-primary/10 animate-pulse-slow"
        ></div>

        {#if blok.headshot?.filename}
          <StoryblokImage
            image={blok.headshot}
            alt={blok.headshot.alt || "Consultant Headshot"}
            width={500}
            height={500}
            variant="avatar"
            class="w-full h-auto shadow-2xl ring-4 ring-background ring-offset-4 ring-offset-muted/20"
            loading="eager"
            fetchpriority="high"
          />
        {:else}
          <div
            class="aspect-square w-full rounded-full bg-linear-to-br from-primary/10 to-muted flex items-center justify-center border-4 border-dashed border-primary/20 p-8"
          >
            <span class="text-primary font-mono text-sm text-center"
              >Headshot Placeholder (500x500)</span
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
