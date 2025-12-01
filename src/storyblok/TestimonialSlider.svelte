<script lang="ts">
  import { storyblokEditable } from "@storyblok/svelte";
  import type { SbBlokData } from "@storyblok/astro";

  interface Testimonial {
    _uid: string;
    quote: string;
    name: string;
    title: string;
  }

  interface TestimonialSliderProps {
    blok: SbBlokData & {
      headline?: string;
      testimonials?: Testimonial[];
    };
  }

  let { blok }: TestimonialSliderProps = $props();

  // Svelte 5 Rune: Tracks the active slide index
  let activeIndex = $state(0);
  
  const totalSlides = blok.testimonials?.length || 0;

  const nextSlide = () => {
    activeIndex = (activeIndex + 1) % totalSlides;
  };

  const prevSlide = () => {
    activeIndex = (activeIndex - 1 + totalSlides) % totalSlides;
  };

  // --- E2E Test Instrumentation & Hydration Logic ---
  $effect(() => {
    if (typeof window !== 'undefined') {
      // 1. Sync activeIndex for Playwright
      (window as any).__testimonialActiveIndex = activeIndex;
      
      // 2. Set Ready flag (acts like onMount as it runs on init)
      if (!(window as any).__testimonialReady) {
        (window as any).__testimonialReady = true;
        console.log('[TESTIMONIAL] Component hydrated and ready (via $effect)');
      }
      
      console.log('[TESTIMONIAL] $effect: activeIndex changed to:', activeIndex);
    }
  });
</script>

<section
  use:storyblokEditable={blok}
  class="py-24 bg-primary-foreground/5"
  data-testid="testimonial-slider"
>
  <div class="container mx-auto px-4">
    <div class="mx-auto max-w-3xl text-center mb-12">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {blok.headline || "What Our Clients Say"}
      </h2>
    </div>

    {#if totalSlides > 0}
      <div class="relative mx-auto max-w-4xl pt-10 pb-20">
        <div class="overflow-hidden rounded-xl bg-card p-8 shadow-xl md:p-12">
          {#each blok.testimonials as testimonial, i}
            {#if i === activeIndex}
              <div
                class="transition-opacity duration-500 ease-in-out animate-in fade-in slide-in-from-right-4"
                data-testid="testimonial-slide-{i}"
              >
                <blockquote class="text-center">
                  <p class="text-2xl italic text-foreground mb-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  
                  <div class="mx-auto h-1 w-16 bg-primary/20 mb-6"></div>

                  <footer class="text-center">
                    <p class="text-lg font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p class="text-sm text-muted-foreground">
                      {testimonial.title}
                    </p>
                  </footer>
                </blockquote>
              </div>
            {/if}
          {/each}
        </div>
        
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-4 mt-6 items-center">
          <button 
            onclick={prevSlide}
            disabled={totalSlides <= 1}
            data-testid="prev-button"
            class="h-10 w-10 flex items-center justify-center rounded-full border border-primary/20 bg-background text-primary hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous testimonial"
          >
            &larr;
          </button>
          
          {#each blok.testimonials as _, i}
            <button
              onclick={() => activeIndex = i}
              data-testid="dot-{i}"
              class="h-3 w-3 rounded-full transition-colors {i === activeIndex ? 'bg-primary' : 'bg-primary/20'}"
              aria-label={`Go to testimonial ${i + 1}`}
            ></button>
          {/each}
          
          <button 
            onclick={nextSlide}
            disabled={totalSlides <= 1}
            data-testid="next-button"
            class="h-10 w-10 flex items-center justify-center rounded-full border border-primary/20 bg-background text-primary hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next testimonial"
          >
            &rarr;
          </button>
        </div>
      </div>
    {:else}
       <div class="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground mx-auto max-w-4xl">
          No testimonials added yet. Please add nested blocks in Storyblok.
        </div>
    {/if}
  </div>
</section>