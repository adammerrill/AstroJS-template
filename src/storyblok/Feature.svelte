<script lang="ts">
  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/astro";

  interface FeatureProps {
    blok: SbBlokData & {
      headline?: string;
      description?: string;
      link?: { url: string };
    };
  }

  let { blok }: FeatureProps = $props();
</script>

<div 
  use:storyblokEditable={blok} 
  class="p-6 bg-white shadow-lg rounded-lg text-center"
>
  <h3 class="text-xl font-bold text-gray-900">
    {blok.headline || 'Feature Title'}
  </h3>
  <p class="mt-2 text-gray-600">
    {blok.description || 'Feature description'}
  </p>
  {#if blok.link?.url}
    <a 
      href={blok.link.url} 
      class="mt-4 inline-block text-blue-600 hover:underline"
    >
      Learn More &rarr;
    </a>
  {/if}
</div>