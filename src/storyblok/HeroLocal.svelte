<script lang="ts">
  import { storyblokEditable } from "@storyblok/svelte";
  import { Button } from "@/components/ui/button";
  import type { HeroLocalBlok } from "@/types/generated/storyblok";
  import type { SbBlokData } from "@storyblok/svelte";

  interface Props {
    blok: HeroLocalBlok;
  }

  let { blok }: Props = $props();

  const getFirstWord = (text: string) => text.split(' ')[0];
  const restOfText = (text: string) => text.split(' ').slice(1).join(' ');
</script>

<section
  use:storyblokEditable={blok as unknown as SbBlokData}
  class="relative overflow-hidden py-24 md:py-36 lg:py-48"
  data-testid="hero-local"
>
  {#if blok.background_image?.filename}
    <img
      src={blok.background_image.filename}
      alt={blok.background_image.alt || 'Background image of service area'}
      class="absolute inset-0 h-full w-full object-cover object-center"
    />
    <div class="absolute inset-0 bg-primary/70 backdrop-brightness-50"></div>
  {:else}
    <div class="absolute inset-0 bg-primary/70"></div>
  {/if}
  
  <div class="container mx-auto px-4 relative z-10 text-white">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="lg:pr-12">
        {#if blok.service_area}
          <div class="mb-4 inline-flex items-center rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-lg">
            Serving: {blok.service_area}
          </div>
        {/if}

        <h1 class="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          <span class="block text-secondary-foreground">{getFirstWord(blok.headline || "Expert Local Services")}</span>
          <span class="block mt-2 font-light">{restOfText(blok.headline || "Near You")}</span>
        </h1>
        
        <p class="mt-6 max-w-xl text-xl font-light opacity-90">
          {blok.subheadline || "Reliable, fast, and fully insured professionals for all your home and business needs."}
        </p>

        <div class="mt-8 lg:hidden">
          <Button size="lg" variant="secondary" href="#form-anchor">
            {blok.cta_primary_label || "Get a Free Quote"}
          </Button>
        </div>
      </div>

      <div class="mt-12 lg:mt-0">
        <div class="rounded-xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm md:p-8 lg:p-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Quick Quote in 60 Seconds
          </h2>
          <div class="aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center p-8 text-center text-gray-600">
            <span class="font-mono text-sm">
              {blok.form_placeholder_text || "ContactForm.svelte Embed Will Go Here"}
            </span>
          </div>
          <p class="mt-4 text-xs text-gray-500 text-center">
            Or call us now at (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
