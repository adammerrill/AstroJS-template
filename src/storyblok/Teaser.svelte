<script lang="ts">
    /**
     * @file Teaser.svelte
     * @description Component for rendering a Teaser block.
     * @version 2.0.0 (Strictly Typed)
     */
    import { storyblokEditable } from "@storyblok/svelte";
    import type { TeaserBlok } from "@/types/generated/storyblok";
  
    interface Props {
      blok: TeaserBlok;
    }
  
    let { blok }: Props = $props();
  </script>
  
  <section 
    class="teaser py-20 text-center" 
    use:storyblokEditable={blok as any}
  >
    <h2 class="text-4xl font-bold">
      {blok.headline || 'Teaser Headline'}
    </h2>
  </section>