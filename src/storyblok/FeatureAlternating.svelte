<script lang="ts">
  /**
   * @file FeatureAlternating.svelte
   * @component FeatureAlternating
   * @description Zig-Zag layout component.
   *
   * @description Migration: [Epic 4] Implemented strict `sizes` for bp1020 logic and lazy loading.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import { cn } from "@/lib/utils";
  import { StoryblokImage } from "@/components/ui/storyblok-image";
  import type { SbBlokData } from "@storyblok/astro";
  import type { StoryblokAsset } from "@/types/storyblok";

  interface FeatureItem {
    _uid: string;
    headline: string;
    description: string;
    image?: StoryblokAsset;
    cta_label?: string;
    cta_url?: { url: string };
  }

  interface FeatureAlternatingProps {
    blok: SbBlokData & {
      headline?: string;
      subheadline?: string;
      items?: FeatureItem[];
    };
  }

  let { blok }: FeatureAlternatingProps = $props();
</script>

<section
  use:storyblokEditable={blok}
  class="py-24 bg-background overflow-hidden"
  data-testid="feature-alternating"
>
  <div class="container mx-auto px-4">
    <div class="mx-auto max-w-3xl text-center mb-20">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {blok.headline || "Deep Dive Features"}
      </h2>
      {#if blok.subheadline}
        <p class="mt-4 text-lg text-muted-foreground">
          {blok.subheadline}
        </p>
      {/if}
    </div>

    <div class="space-y-24">
      {#if blok.items && blok.items.length > 0}
        {#each blok.items as item, i (item._uid)}
          <div 
            class={cn(
              "flex flex-col gap-12 lg:gap-24 items-center",
              i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            )}
            data-testid={`feature-row-${i}`}
          >
            <div class="flex-1 space-y-6">
              <h3 class="text-2xl font-bold tracking-tight text-foreground">
                {item.headline || "Feature Headline"}
              </h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                {item.description || "Feature description goes here."}
              </p>
              {#if item.cta_label && item.cta_url?.url}
                <a 
                  href={item.cta_url.url}
                  class="inline-flex items-center text-primary font-semibold hover:underline underline-offset-4"
                >
                  {item.cta_label} &rarr;
                </a>
              {/if}
            </div>

            <div class="flex-1 w-full">
              <div class="relative rounded-2xl border bg-muted/30 p-2 ring-1 ring-inset ring-foreground/10 lg:rounded-3xl lg:p-4">
                {#if item.image?.filename}
                  <StoryblokImage
                    image={item.image}
                    alt={item.image.alt || item.headline}
                    width={800}
                    height={450}
                    class="rounded-xl shadow-2xl ring-1 ring-foreground/10 w-full h-auto object-cover"
                    loading="lazy"
                    sizes="(max-width: 1020px) 100vw, 50vw"
                  />
                {:else}
                  <div class="aspect-video w-full rounded-xl bg-secondary/50 flex items-center justify-center border border-dashed border-border">
                    <span class="text-muted-foreground font-mono text-sm">Image Placeholder</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
          No feature items added.
        </div>
      {/if}
    </div>
  </div>
</section>
