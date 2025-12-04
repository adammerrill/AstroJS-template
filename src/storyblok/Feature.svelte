<script lang="ts">
  /**
   * @file Feature.svelte
   * @description Component for rendering a Feature block.
   * @version 2.0.0 (Strictly Typed)
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/svelte";
  // 1. Import the generated interface
  import type { FeatureBlok } from "@/types/generated/storyblok";

  interface Props {
    // 2. Strict typing prevents accessing undefined fields
    blok: FeatureBlok;
  }

  // 3. Svelte 5 Runes
  let { blok }: Props = $props();
</script>

<div 
  use:storyblokEditable={blok as SbBlokData} 
  class="p-6 bg-white shadow-lg rounded-lg text-center"
>
  <h3 class="text-xl font-bold text-gray-900">
    {blok.name || 'Feature Name'}
  </h3>
  
  <p class="mt-2 text-gray-600">
    Feature description placeholder
  </p>
  
  </div>
  