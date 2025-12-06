<script lang="ts">
  /**
   * @file HeroSaas.svelte
   * @component HeroSaas
   * @description SaaS-style Hero component with strict property typing and image optimization.
   *
   * @description Migration: [Epic 3] Replaced raw <img> with <StoryblokImage> to utilize Img2 service.
   * @description Performance: LCP Optimized: Main dashboard image uses eager loading and high fetch priority.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import { Button } from "@/components/ui/button";
  import { StoryblokImage } from "@/components/ui/storyblok-image";
  import type { SbBlokData } from "@storyblok/svelte";
  import type { HeroSaasBlok } from "@/types/generated/storyblok";
  import { resolveLink } from "@/types/storyblok";

  interface Props {
    blok: HeroSaasBlok;
  }

  let { blok }: Props = $props();
</script>

<section
  data-testid="hero-saas"
  use:storyblokEditable={blok as unknown as SbBlokData}
  class="relative overflow-hidden pt-16 pb-32 md:pt-32 md:pb-48"
>
  <div
    class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-40"
  ></div>

  <div class="container mx-auto px-4 text-center">
    {#if blok.badge}
      <div
        class="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
      >
        {blok.badge}
      </div>
    {/if}

    <h1
      class="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
    >
      {blok.headline || "Enterprise SaaS Solution"}
    </h1>

    <p
      class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
    >
      {blok.subheadline || "Streamline your workflow."}
    </p>

    <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
      {#if blok.cta_primary_label}
        <Button size="lg" href={resolveLink(blok.cta_primary)}>
          {blok.cta_primary_label}
        </Button>
      {/if}

      {#if blok.cta_secondary_label}
        <Button
          variant="outline"
          size="lg"
          href={resolveLink(blok.cta_secondary)}
        >
          {blok.cta_secondary_label}
        </Button>
      {/if}
    </div>

    <div class="mt-20 relative mx-auto max-w-5xl">
      <div
        class="relative rounded-xl border bg-background/50 p-2 ring-1 ring-inset ring-foreground/10 lg:rounded-2xl lg:p-4 glass"
      >
        {#if blok.image?.filename}
          <StoryblokImage
            image={blok.image}
            alt={blok.image.alt || "Dashboard Preview"}
            width={1200}
            height={800}
            class="w-full rounded-md shadow-2xl ring-1 ring-foreground/10"
            loading="eager"
            fetchpriority="high"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        {:else}
          <div
            class="aspect-video w-full rounded-md bg-linear-to-br from-muted to-muted/50 flex items-center justify-center border border-dashed border-border"
          >
            <span class="text-muted-foreground font-mono text-sm"
              >Dashboard Image Placeholder</span
            >
          </div>
        {/if}
      </div>

      <div
        class="absolute -top-24 -inset-x-20 -z-10 bg-primary/20 blur-3xl h-[120%] opacity-30 pointer-events-none"
      ></div>
    </div>
  </div>
</section>
