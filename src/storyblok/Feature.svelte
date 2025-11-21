---
import GridSvelte from './Grid.svelte';
const { blok } = Astro.props;
---
<script>
  // @ts-ignore
  import { storyblokEditable } from "@storyblok/svelte";

  // Storyblok passes the block data via a prop called 'blok'
  export let blok; 
</script>

<div use:storyblokEditable={blok} class="p-6 bg-white shadow-lg rounded-lg text-center">
  <h3 class="text-xl font-bold text-gray-900">{blok.headline}</h3>
  <p class="mt-2 text-gray-600">{blok.description}</p>
  <a href={blok.link.url} class="mt-4 inline-block text-blue-600 hover:underline">
    Learn More &rarr;
  </a>
</div>