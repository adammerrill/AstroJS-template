<script lang="ts">
  /**
   * @file Feature.svelte
   * @component Feature
   * @description Standard feature block used in grids and lists.
   *
   * @description Migration: [Epic 4] Replaced raw <img> with <StoryblokImage>.
   * @description Performance: Lazy loads small icon/thumbnail images to save bandwidth.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/svelte";
  import type { FeatureBlok } from "@/types/generated/storyblok";
  import { StoryblokImage } from "@/components/ui/storyblok-image";

  interface Props {
    blok: FeatureBlok;
  }

  let { blok }: Props = $props();
</script>

<div
  use:storyblokEditable={blok as SbBlokData}
  class="card-hover p-6 bg-white shadow-lg rounded-lg text-center"
>
  {#if blok.image?.filename}
    <div class="mb-4 flex justify-center">
      <StoryblokImage
        image={blok.image}
        alt={blok.image.alt || blok.headline || "Feature Icon"}
        width={64}
        height={64}
        variant="rounded"
        class="object-contain"
        loading="lazy"
      />
    </div>
  {/if}

  <h3 class="text-xl font-bold text-gray-900 mb-2">
    {blok.headline || blok.name || "Feature Name"}
  </h3>

  <p class="text-gray-600 leading-relaxed">
    {blok.description || "Feature description placeholder"}
  </p>
</div>
