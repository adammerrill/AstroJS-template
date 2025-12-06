<script lang="ts">
	/**
	 * @file Card Action Component
	 * @module components/ui/card
	 * @classification Public
	 * @author Atom Merrill
	 * @version 2.0.0
	 * @requirement REQ-SYS-001 - Card Component Standardization
	 * @test_ref src/components/ui/card/card.test.ts
	 * 
	 * @description
	 * Action slot component for Card. Positions interactive elements (buttons, links) in the top-right
	 * corner using CSS Grid's `grid-cols-[1fr_auto]` pattern.
	 */
	
	import { cn } from "@/lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-action"
	class={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
	{...restProps}
>
	{@render children?.()}
</div>
