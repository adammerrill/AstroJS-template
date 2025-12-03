<script lang="ts">
  /**
   * @file PricingTable.svelte
   * @description Interactive Pricing Table with strict typing.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  // 1. Import strictly typed interfaces
  import type { PricingTableBlok, PricingTierBlok, PricingFeatureBlok } from "@/types/generated/storyblok";
  import { resolveLink } from "@/types/storyblok";

  interface Props {
    blok: PricingTableBlok;
  }

  let { blok }: Props = $props();

  let isYearly = $state(false);
  let isHydrated = $state(false);

  const toggleBilling = () => {
    isYearly = !isYearly;
  };

  $effect(() => {
    if (typeof window !== 'undefined') {
      isHydrated = true;
    }
  });
</script>

<section
  use:storyblokEditable={blok as any}
  class="py-24 bg-background relative"
  data-testid="pricing-table"
  data-hydrated={isHydrated}
  data-billing-mode={isYearly ? 'yearly' : 'monthly'}
>
  <div class="container mx-auto px-4">
    <div class="mx-auto max-w-3xl text-center mb-16">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {blok.headline || "Simple, Transparent Pricing"}
      </h2>
      {#if blok.subheadline}
        <p class="mt-4 text-lg text-muted-foreground">
          {blok.subheadline}
        </p>
      {/if}

      <div class="mt-8 flex items-center justify-center gap-4">
        <span class={cn("text-sm font-medium transition-colors", !isYearly ? "text-foreground" : "text-muted-foreground")}>
          Monthly
        </span>
        <button
          onclick={toggleBilling}
          class={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isYearly ? "bg-primary" : "bg-input"
          )}
          role="switch"
          aria-checked={isYearly}
          aria-label="Toggle yearly billing"
          data-testid="billing-toggle"
        >
          <span
            class={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
              isYearly ? "translate-x-5" : "translate-x-0"
            )}
            aria-hidden="true"
          ></span>
        </button>
        <span class={cn("text-sm font-medium transition-colors", isYearly ? "text-foreground" : "text-muted-foreground")}>
          Yearly <span class="text-primary text-xs ml-1">(Save 20%)</span>
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {#if blok.tiers && blok.tiers.length > 0}
        {#each blok.tiers as tierBlok (tierBlok._uid)}
          <!-- Strict casting for nested blocks -->
          {@const tier = tierBlok as PricingTierBlok}
          <div
            class={cn(
              "relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all duration-300",
              tier.highlight 
                ? "border-primary bg-background shadow-xl scale-105 z-10 ring-1 ring-primary" 
                : "border-border bg-card hover:border-primary/50"
            )}
            data-testid={`pricing-card-${tier.name?.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {#if tier.highlight}
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
            {/if}

            <div class="mb-6">
              <h3 class="text-lg font-semibold text-foreground">{tier.name}</h3>
              {#if tier.description}
                <p class="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              {/if}
            </div>

            <div class="mb-6 flex items-baseline gap-1">
              <span class="text-4xl font-bold tracking-tight text-foreground" data-testid="price-display">
                {isYearly ? tier.price_yearly : tier.price_monthly}
              </span>
              <span class="text-sm font-semibold text-muted-foreground">
                /{isYearly ? 'yr' : 'mo'}
              </span>
            </div>

            <ul class="mb-8 space-y-3 flex-1">
              {#if tier.features}
                {#each tier.features as featureBlok}
                  {@const feature = featureBlok as PricingFeatureBlok}
                  <li class="flex items-start gap-3 text-sm text-muted-foreground">
                    <svg class="h-5 w-5 shrink-0 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {feature.text}
                  </li>
                {/each}
              {/if}
            </ul>

            <Button 
              href={resolveLink(tier.cta_url)} 
              variant={tier.highlight ? "default" : "outline"}
              class="w-full"
            >
              {tier.cta_label || "Get Started"}
            </Button>
          </div>
        {/each}
      {:else}
        <div class="col-span-full text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
          No pricing tiers configured. Add them in Storyblok.
        </div>
      {/if}
    </div>
  </div>
</section>
