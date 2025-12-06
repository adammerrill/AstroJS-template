<script lang="ts">
  /**
   * @file LogoCloud.svelte
   * @component LogoCloud
   * @description Social proof component displaying client logos.
   *
   * @performance
   * - Uses `format="webp"` to preserve transparency while optimizing size.
   * - Restricts dimensions to `150x50` to minimize bandwidth.
   * - Uses `loading="lazy"` as this is typically below the fold.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/svelte";
  import type { LogoCloudBlok, LogoItemBlok } from "@/types/generated/storyblok";
  import { StoryblokImage } from "@/components/ui/storyblok-image";

  interface Props {
    blok: LogoCloudBlok;
  }

  let { blok }: Props = $props();
</script>

<section
  use:storyblokEditable={blok as SbBlokData}
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
        {#each blok.logos as logoBlok (logoBlok._uid)}
          {@const logo = logoBlok as LogoItemBlok}
          <div class="w-full max-w-[140px] md:max-w-160px flex items-center justify-center p-4 grayscale transition-all duration-300 hover:grayscale-0 hover:scale-105 hover:opacity-100">
            {#if logo.filename?.filename}
              <StoryblokImage
                image={logo.filename}
                alt={logo.alt || logo.name || "Client Logo"}
                width={150}
                height={50}
                format="webp"
                class="max-h-12 w-auto object-contain"
                loading="lazy"
              />
            {:else}
              <div class="h-10 w-24 bg-muted/30 rounded border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">
                Logo
              </div>
            {/if}
          </div>
        {/each}
      {:else}
        <div class="col-span-full text-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/10 w-full">
          Add logos in Storyblok to populate this cloud.
        </div>
      {/if}
    </div>
  </div>
</section>
