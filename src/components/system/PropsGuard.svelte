<script lang="ts">
  /**
   * @file PropsGuard.svelte
   * @description A Higher-Order Component for runtime prop validation.
   * Renders the slot only if the provided data satisfies the Zod schema.
   * Renders an error boundary UI in development if validation fails.
   */
  import { type ZodType } from "zod";
  import { cn } from "@/lib/utils";

  interface Props {
    data: unknown;
    schema: ZodType;
    name?: string;
    children?: import("svelte").Snippet;
  }

  let { data, schema, name = "Component", children }: Props = $props();

  let validationResult = $derived(schema.safeParse(data));
  let isDev = import.meta.env.DEV;
</script>

{#if validationResult.success}
  {@render children?.()}
{:else if isDev}
  <!-- Dev Mode Error Boundary -->
  <div class="rounded-lg border-2 border-destructive bg-destructive/10 p-4 my-4 font-mono text-sm text-destructive">
    <div class="flex items-center gap-2 mb-2 font-bold">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      <span>Props Validation Error: {name}</span>
    </div>
    <div class="bg-background/50 p-2 rounded overflow-x-auto whitespace-pre-wrap">
      {JSON.stringify(validationResult.error.format(), null, 2)}
    </div>
  </div>
{:else}
  <!-- Production: Render nothing (collapse gracefully) or a generic fallback -->
  <!-- <div class="hidden" data-error="validation-failed-{name}"></div> -->
{/if}
