<script lang="ts">
  /**
   * @file RequestQuoteForm.svelte
   * @description A multi-step wizard for requesting quotes.
   * Features step-based validation, progress tracking, and final submission.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  import type { SbBlokData } from "@storyblok/astro";

  interface RequestQuoteProps {
    blok: SbBlokData & {
      headline?: string;
      subheadline?: string;
      api_endpoint?: string;
    };
  }

  let { blok }: RequestQuoteProps = $props();

  // --- State ---
  let currentStep = $state(1);
  const totalSteps = 3;
  
  let formData = $state({
    serviceType: "",
    description: "",
    address: "",
    zipCode: "",
    name: "",
    email: "",
    phone: ""
  });

  let errors = $state<Record<string, string>>({});
  let status = $state<"idle" | "submitting" | "success" | "error">("idle");

  // --- Type Definitions for E2E Testing ---
  // Extends the global Window interface to include our test hooks
  interface TestWindow extends Window {
    __quoteFormStep?: number;
    __quoteFormStatus?: string;
    __quoteFormReady?: boolean;
  }

  // --- Validation Logic ---
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.serviceType) {
        newErrors.serviceType = "Please select a service.";
        isValid = false;
      }
      if (!formData.description.trim()) {
        newErrors.description = "Please describe the issue.";
        isValid = false;
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required.";
        isValid = false;
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = "Zip code is required.";
        isValid = false;
      }
    }

    if (step === 3) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required.";
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
        isValid = false;
      }
    }

    errors = newErrors;
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      currentStep++;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      currentStep--;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    status = "submitting";

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // eslint-disable-next-line no-console
      console.log("[RequestQuote] Submission:", formData);
      status = "success";
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      status = "error";
    }
  };

  // --- E2E Instrumentation ---
  $effect(() => {
    if (typeof window !== "undefined") {
      // Safe cast to our extended interface
      const testWindow = window as unknown as TestWindow;
      
      testWindow.__quoteFormStep = currentStep;
      testWindow.__quoteFormStatus = status;
      
      if (!testWindow.__quoteFormReady) {
        testWindow.__quoteFormReady = true;
        // eslint-disable-next-line no-console
        console.log("[QUOTE] Component Ready");
      }
    }
  });
</script>

<section
  use:storyblokEditable={blok}
  class="py-16 bg-background"
  data-testid="request-quote-form"
>
  <div class="container mx-auto px-4 max-w-xl">
    <div class="mb-8 text-center">
      <h2 class="text-2xl font-bold">{blok.headline || "Request a Quote"}</h2>
      {#if blok.subheadline}
        <p class="text-muted-foreground">{blok.subheadline}</p>
      {/if}
    </div>

    <div class="bg-card border rounded-xl shadow-xs p-6 md:p-8">
      {#if status === "success"}
        <div class="text-center py-10" data-testid="success-message">
          <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Quote Requested!</h3>
          <p class="text-muted-foreground">We will review your request and contact you shortly.</p>
        </div>
      {:else}
        <div class="flex items-center justify-between mb-8 text-sm font-medium text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <div class="h-2 w-32 bg-secondary rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-300" style="width: {(currentStep / totalSteps) * 100}%"></div>
          </div>
        </div>

        <form onsubmit={(e) => e.preventDefault()}>
          {#if currentStep === 1}
            <div class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div class="space-y-2">
                <label for="service" class="text-sm font-medium">Service Type</label>
                <select 
                  id="service" 
                  bind:value={formData.serviceType}
                  class={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", errors.serviceType && "border-destructive")}
                >
                  <option value="" disabled>Select a service...</option>
                  <option value="hvac">HVAC Repair</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                </select>
                {#if errors.serviceType}
                  <p class="text-xs text-destructive">{errors.serviceType}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <label for="desc" class="text-sm font-medium">Description</label>
                <textarea 
                  id="desc" 
                  bind:value={formData.description}
                  class={cn("flex min-h-80px w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", errors.description && "border-destructive")}
                  placeholder="Describe your issue..."
                ></textarea>
                {#if errors.description}
                  <p class="text-xs text-destructive">{errors.description}</p>
                {/if}
              </div>
            </div>
          {/if}

          {#if currentStep === 2}
            <div class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div class="space-y-2">
                <label for="address" class="text-sm font-medium">Address</label>
                <input 
                  id="address" 
                  type="text" 
                  bind:value={formData.address}
                  class={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", errors.address && "border-destructive")}
                  placeholder="123 Main St"
                />
                {#if errors.address}
                  <p class="text-xs text-destructive">{errors.address}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <label for="zip" class="text-sm font-medium">Zip Code</label>
                <input 
                  id="zip" 
                  type="text" 
                  bind:value={formData.zipCode}
                  class={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", errors.zipCode && "border-destructive")}
                  placeholder="78701"
                />
                {#if errors.zipCode}
                  <p class="text-xs text-destructive">{errors.zipCode}</p>
                {/if}
              </div>
            </div>
          {/if}

          {#if currentStep === 3}
            <div class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div class="space-y-2">
                <label for="name" class="text-sm font-medium">Name</label>
                <input 
                  id="name" 
                  type="text" 
                  bind:value={formData.name}
                  class={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", errors.name && "border-destructive")}
                  placeholder="Jane Doe"
                />
                {#if errors.name}
                  <p class="text-xs text-destructive">{errors.name}</p>
                {/if}
              </div>

              <div class="space-y-2">
                <label for="email" class="text-sm font-medium">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  bind:value={formData.email}
                  class={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", errors.email && "border-destructive")}
                  placeholder="jane@example.com"
                />
                {#if errors.email}
                  <p class="text-xs text-destructive">{errors.email}</p>
                {/if}
              </div>
            </div>
          {/if}

          <div class="flex justify-between mt-8 pt-4 border-t">
            <Button 
              variant="outline" 
              onclick={prevStep} 
              disabled={currentStep === 1 || status === "submitting"}
              class={currentStep === 1 ? "invisible" : ""}
            >
              Back
            </Button>

            {#if currentStep < totalSteps}
              <Button onclick={nextStep}>
                Next Step
              </Button>
            {:else}
              <Button onclick={handleSubmit} disabled={status === "submitting"}>
                {status === "submitting" ? "Submitting..." : "Submit Request"}
              </Button>
            {/if}
          </div>
        </form>
      {/if}
    </div>
  </div>
</section>
