<script lang="ts">
  /**
   * @file FeatureAlternating.svelte
   * @description A "Zig-Zag" feature section component.
   * Renders a list of feature items, alternating the layout direction (Text Left/Image Right vs Text Right/Image Left)
   * based on the index. Uses Svelte 5 Runes for props and reactivity.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import { cn } from "@/lib/utils";
  import type { SbBlokData } from "@storyblok/astro";

  // Define the structure for individual feature items within the block
  interface FeatureItem {
    _uid: string;
    headline: string;
    description: string;
    image?: { filename: string; alt?: string };
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
    <!-- Section Header -->
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

    <!-- Alternating Features List -->
    <div class="space-y-24">
      {#if blok.items && blok.items.length > 0}
        {#each blok.items as item, i (item._uid)}
          <div 
            class={cn(
              "flex flex-col gap-12 lg:gap-24 items-center",
              // Logic: Even indexes = Standard (Row), Odd indexes = Reversed (Row-Reverse)
              i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            )}
            data-testid={`feature-row-${i}`}
          >
            <!-- Content Side -->
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

            <!-- Image Side -->
            <div class="flex-1 w-full">
              <div class="relative rounded-2xl border bg-muted/30 p-2 ring-1 ring-inset ring-foreground/10 lg:rounded-3xl lg:p-4">
                {#if item.image?.filename}
                  <img
                    src={item.image.filename}
                    alt={item.image.alt || item.headline}
                    class="rounded-xl shadow-2xl ring-1 ring-foreground/10 w-full h-auto object-cover aspect-video"
                    loading="lazy"
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
          No feature items added. Add items in Storyblok to see the alternating layout.
        </div>
      {/if}
    </div>
  </div>
</section>
