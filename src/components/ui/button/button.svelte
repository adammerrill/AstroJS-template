<script lang="ts">
	/**
	 * @file button.svelte
	 * @component
	 * @description A polymorphic button component that conforms to Shadcn UI design patterns.
	 * It renders either an HTML `<button>` or an `<a>` tag based on the presence of the `href` prop.
	 * * @example
	 * ```svelte
	 * <Button variant="destructive" onclick={() => console.log('click')}>Delete</Button>
	 * <Button href="/login" variant="outline">Login</Button>
	 * ```
	 */

	import { cn } from "@/lib/utils.js";
	import { buttonVariants, type ButtonProps } from "./button-variants.js";

	/**
	 * Destructuring props using Svelte 5 $props rune.
	 * We use explicit default values for variant, size, and type.
	 */
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<!-- 
		Render an Anchor tag if href is present.
		We cast `ref` to HTMLAnchorElement to satisfy strict typing on bind:this.
	-->
	<a
		bind:this={ref as HTMLAnchorElement}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{href}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<!-- 
		Render a Button tag if href is absent.
		We cast `ref` to HTMLButtonElement to satisfy strict typing on bind:this.
	-->
	<button
		bind:this={ref as HTMLButtonElement}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}