<script lang="ts">
  /**
   * @component Button (Svelte 5)
   * @description A primitive button component using Svelte 5 Runes ($props).
   * Handles variant styling via Tailwind utility classes.
   */
  import { cn } from "@/lib/utils";

  // Define explicit types for variants to prevent implicit any errors
  type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
  type ButtonSize = "default" | "sm" | "lg" | "icon";

  // Svelte 5: Props Definition using Runes
  let { 
    variant = "default", 
    size = "default", 
    class: className = "",
    children,
    onclick,
    ...rest 
  } = $props<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    class?: string;
    children?: import('svelte').Snippet;
    onclick?: (e: MouseEvent) => void;
    [key: string]: any;
  }>();

  // Variant Mapping with strict typing
  const variants: Record<ButtonVariant, string> = {
    default: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2"
  };

  const sizes: Record<ButtonSize, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10 p-0 flex items-center justify-center"
  };

  // Resolve base class safely with proper type assertions
  const variantClass = variants[variant as ButtonVariant] ?? variants.default;
  const sizeClass = sizes[size as ButtonSize] ?? sizes.default;
</script>

<!-- 
  Svelte 5: Native Event Handling 
  We use the `onclick` prop passed from the parent directly on the element.
  We ONLY use {@render children()} - no <slot> allowed in Svelte 5 mode.
-->
<button
  class={cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantClass,
    sizeClass,
    className
  )}
  onclick={onclick}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</button>