<script lang="ts">
  /**
   * @file ContactForm.svelte
   * @description A generic contact form with client-side validation and state management.
   * Supports configurable endpoints via Storyblok props.
   * @modernization Uses DOM-based hydration detection (data-hydrated attribute)
   * instead of window properties for improved testability and decoupling.
   */
  import { storyblokEditable } from "@storyblok/svelte";
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  import type { SbBlokData } from "@storyblok/astro";

  interface ContactFormProps {
    blok: SbBlokData & {
      headline?: string;
      subheadline?: string;
      submit_label?: string;
      success_message?: string;
      api_endpoint?: string;
    };
  }

  let { blok }: ContactFormProps = $props();

  // --- State Management with Runes ---
  let formData = $state({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  let errors = $state({
    name: "",
    email: "",
    message: ""
  });

  type SubmissionStatus = "idle" | "submitting" | "success" | "error";
  let status = $state<SubmissionStatus>("idle");

  // --- DOM-based hydration signal (replaces window.__contactFormReady) ---
  let isHydrated = $state(false);

  // --- Validation Logic ---
  const validate = () => {
    let isValid = true;
    
    // Reset errors
    errors.name = "";
    errors.email = "";
    errors.message = "";

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    }

    return isValid;
  };

  // --- Submission Handler ---
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validate()) return;

    status = "submitting";

    try {
      // Simulate network request if no endpoint provided (dev mode)
      if (!blok.api_endpoint) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // eslint-disable-next-line no-console
        console.log("[ContactForm] Dev Submission:", formData);
      } else {
        const response = await fetch(blok.api_endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error("Submission failed");
      }

      status = "success";
      // Clear form
      formData = { name: "", email: "", subject: "", message: "" };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      status = "error";
    }
  };

  // --- Hydration Detection via $effect (runs only in browser after mount) ---
  $effect(() => {
    if (typeof window !== 'undefined') {
      isHydrated = true;
      // eslint-disable-next-line no-console
      console.log('[CONTACT_FORM] Component hydrated (via $effect)');
    }
  });
</script>

<section
  use:storyblokEditable={blok}
  class="py-24 bg-muted/30"
  data-testid="contact-form"
  data-hydrated={isHydrated}
  data-status={status}
>
  <div class="container mx-auto px-4 max-w-2xl">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {blok.headline || "Get in Touch"}
      </h2>
      {#if blok.subheadline}
        <p class="mt-4 text-lg text-muted-foreground">
          {blok.subheadline}
        </p>
      {/if}
    </div>

    <div class="bg-card border border-border rounded-xl shadow-sm p-8">
      {#if status === "success"}
        <div class="text-center py-12 animate-in fade-in zoom-in duration-300" data-testid="success-message">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-foreground">Message Sent!</h3>
          <p class="text-muted-foreground mt-2">
            {blok.success_message || "Thank you for reaching out. We'll get back to you shortly."}
          </p>
          <button 
            onclick={() => status = "idle"}
            class="mt-6 text-primary hover:underline text-sm"
          >
            Send another message
          </button>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-6" novalidate>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Name <span class="text-destructive">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                bind:value={formData.name}
                class={cn(
                  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.name ? "border-destructive" : "border-input"
                )}
                placeholder="John Doe"
                disabled={status === "submitting"}
              />
              {#if errors.name}
                <p class="text-sm font-medium text-destructive" data-testid="error-name">{errors.name}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <label for="email" class="text-sm font-medium leading-none">
                Email <span class="text-destructive">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                bind:value={formData.email}
                class={cn(
                  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.email ? "border-destructive" : "border-input"
                )}
                placeholder="john@example.com"
                disabled={status === "submitting"}
              />
              {#if errors.email}
                <p class="text-sm font-medium text-destructive" data-testid="error-email">{errors.email}</p>
              {/if}
            </div>
          </div>

          <div class="space-y-2">
            <label for="subject" class="text-sm font-medium leading-none">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              bind:value={formData.subject}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="How can we help?"
              disabled={status === "submitting"}
            />
          </div>

          <div class="space-y-2">
            <label for="message" class="text-sm font-medium leading-none">
              Message <span class="text-destructive">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              bind:value={formData.message}
              class={cn(
                "flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.message ? "border-destructive" : "border-input"
              )}
              placeholder="Tell us about your project..."
              disabled={status === "submitting"}
            ></textarea>
            {#if errors.message}
              <p class="text-sm font-medium text-destructive" data-testid="error-message">{errors.message}</p>
            {/if}
          </div>

          {#if status === "error"}
            <div class="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              Something went wrong. Please try again later.
            </div>
          {/if}

          <Button 
            type="submit" 
            class="w-full" 
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending..." : (blok.submit_label || "Send Message")}
          </Button>
        </form>
      {/if}
    </div>
  </div>
</section>
