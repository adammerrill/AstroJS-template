<script lang="ts">
  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/astro";

  interface GridProps {
    blok: SbBlokData & {
      columns?: SbBlokData[];
    };
    /** * Svelte 5 Snippet for children passed from Astro.
     * This contains the rendered <StoryblokComponent /> items.
     */
    children?: import("svelte").Snippet;
  }

  let { blok, children }: GridProps = $props();
</script>

<div
  use:storyblokEditable={blok}
  class="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8"
  data-testid="grid"
>
  {@render children?.()}
</div>