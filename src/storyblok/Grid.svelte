<script lang="ts">
  /**
   * @file Grid.svelte
   * @description Layout component for grid columns.
   * @version 2.0.0 (Strictly Typed)
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import type { GridBlok } from "@/types/generated/storyblok";

  interface Props {
    blok: GridBlok;
    // Children are passed via Astro slots (snippets in Svelte 5)
    children?: import("svelte").Snippet;
  }

  let { blok, children }: Props = $props();
</script>

<div
  use:storyblokEditable={blok as any}
  class="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8"
  data-testid="grid"
>
  {@render children?.()}
</div>
