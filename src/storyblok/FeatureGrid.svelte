<script lang="ts">
  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/astro";

  interface FeatureGridProps {
    blok: SbBlokData & {
      headline?: string;
      description?: string;
      columns?: SbBlokData[]; // Array of nested Feature blocks
    };
  }

  let { blok }: FeatureGridProps = $props();
</script>

<section
  use:storyblokEditable={blok}
  class="py-24 bg-background"
  data-testid="feature-grid"
>
  <div class="container mx-auto px-4">
    <div class="mx-auto max-w-3xl text-center mb-16">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {blok.headline || "Our Core Features"}
      </h2>
      {#if blok.description}
        <p class="mt-4 text-lg text-muted-foreground">
          {blok.description}
        </p>
      {/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#if blok.columns && blok.columns.length > 0}
        {#each blok.columns as nestedBlok (nestedBlok._uid)}
           <div class="card-hover p-6 rounded-xl border bg-card text-card-foreground">
             <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
             </div>
             
             <h3 class="mb-2 text-xl font-semibold">{nestedBlok.headline || 'Feature Title'}</h3>
             <p class="text-muted-foreground">{nestedBlok.description || 'Feature description placeholder text.'}</p>
           </div>
        {/each}
      {:else}
        <div class="col-span-full text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
          Add "Feature" blocks to the "Columns" field in Storyblok.
        </div>
      {/if}
    </div>
  </div>
</section>
