<script lang="ts">
  /**
   * @file LogoCloud.svelte
   * @description A "Trusted By" social proof component.
   * Renders a responsive grid of client logos. Includes a grayscale filter
   * that transitions to full color on hover for a polished, interactive feel.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/astro";

  interface LogoItem {
    _uid: string;
    filename: string;
    alt?: string;
    name?: string; // Optional company name for alt text fallback
  }

  interface LogoCloudProps {
    blok: SbBlokData & {
      headline?: string;
      logos?: LogoItem[];
    };
  }

  let { blok }: LogoCloudProps = $props();
</script>

<section
  use:storyblokEditable={blok}
  class="py-12 md:py-20 bg-background border-y border-border/40"
  data-testid="logo-cloud"
>
  <div class="container mx-auto px-4">
    {#if blok.headline}
      <p class="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8 md:mb-12">
        {blok.headline}
      </p>
    {/if}

    <div 
      class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 items-center justify-items-center opacity-90"
    >
      {#if blok.logos && blok.logos.length > 0}
        {#each blok.logos as logo (logo._uid)}
          <div class="w-full max-w-[140px] md:max-w-[160px] flex items-center justify-center p-4 grayscale transition-all duration-300 hover:grayscale-0 hover:scale-105 hover:opacity-100">
            {#if logo.filename}
              <img
                src={logo.filename}
                alt={logo.alt || logo.name || "Client Logo"}
                class="max-h-12 w-auto object-contain"
                loading="lazy"
                width="150"
                height="50"
              />
            {:else}
              <!-- Fallback for empty image slots during dev -->
              <div class="h-10 w-24 bg-muted/30 rounded border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">
                Logo
              </div>
            {/if}
          </div>
        {/each}
      {:else}
        <!-- Empty State -->
        <div class="col-span-full text-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/10 w-full">
          Add logos in Storyblok to populate this cloud.
        </div>
      {/if}
    </div>
  </div>
</section>
