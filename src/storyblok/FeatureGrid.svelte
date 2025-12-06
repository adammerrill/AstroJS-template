<script lang="ts">
  /**
   * @file FeatureGrid.svelte
   * @component FeatureGrid
   * @description Svelte 5 implementation of the Feature Grid layout.
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
