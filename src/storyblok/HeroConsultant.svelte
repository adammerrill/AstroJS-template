<script lang="ts">
  import { storyblokEditable } from "@storyblok/svelte";
  import { Button } from "@/components/ui/button";
  import type { SbBlokData } from "@storyblok/astro";

  interface HeroConsultantProps {
    blok: SbBlokData & {
      headline?: string;
      subheadline?: string;
      cta_primary_label?: string;
      cta_primary?: { url: string }[];
      headshot?: { filename: string; alt?: string };
    };
  }

  let { blok }: HeroConsultantProps = $props();
</script>

<section
  use:storyblokEditable={blok}
  class="py-24 md:py-32 lg:py-40 bg-muted/20"
  data-testid="hero-consultant"
>
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
      
      <div class="lg:order-1 order-2">
        <h1 class="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {blok.headline || "Scale Your Business with Clarity."}
        </h1>
        
        <p class="mt-6 text-xl text-muted-foreground leading-relaxed">
          {blok.subheadline || "As a fractional executive, I help established firms unblock growth, optimize operational efficiency, and capture new market share—without the full-time commitment."}
        </p>

        <div class="mt-8">
          {#if blok.cta_primary_label}
            <Button size="lg" href={blok.cta_primary?.[0]?.url || "#"}>
              {blok.cta_primary_label}
            </Button>
          {/if}
        </div>
      </div>
      
      <div class="lg:order-2 order-1 relative mx-auto max-w-sm lg:max-w-none">
        <div class="absolute inset-0 -z-10 rounded-full bg-primary/10 animate-pulse-slow"></div>

        {#if blok.headshot?.filename}
          <img
            src={blok.headshot.filename}
            alt={blok.headshot.alt || "Consultant Headshot"}
            class="w-full h-auto aspect-square object-cover rounded-full shadow-2xl ring-4 ring-background ring-offset-4 ring-offset-muted/20"
            width="500"
            height="500"
          />
        {:else}
          <div class="aspect-square w-full rounded-full bg-linear-to-br from-primary/10 to-muted flex items-center justify-center border-4 border-dashed border-primary/20 p-8">
            <span class="text-primary font-mono text-sm text-center">Headshot Placeholder (500x500)</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
