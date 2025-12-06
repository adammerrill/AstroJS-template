<script lang="ts">
	/**
	 * @file Card Title Component
	 * @module components/ui/card
	 * @classification Public
	 * @author Atom Merrill
	 * @version 2.0.0
	 * @requirement REQ-SYS-001 - Card Component Standardization
	 * @test_ref src/components/ui/card/card.test.ts
	 * 
	 * @description
	 * Title text component for Card. Renders as semibold typography integrated with card grid layout.
	 * Semantic heading level should be set via `aria-level` prop by consumer.
	 */
  
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "@/lib/utils";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-title"
	class={cn("font-semibold leading-none", className)}
	{...restProps}
>
	{@render children?.()}
</div>
