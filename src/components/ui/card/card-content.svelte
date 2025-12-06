<script lang="ts">
	/**
	 * @file Card Content Component
	 * @module components/ui/card
	 * @classification Public
	 * @author Atom Merrill
	 * @version 2.0.0
	 * @requirement REQ-SYS-001 - Card Component Standardization
	 * @test_ref src/components/ui/card/card.test.ts
	 * 
	 * @description
	 * Content container for Card. Provides standardized padding and typography for card body content.
	 * Accepts arbitrary children for flexible content composition.
	 */

	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "@/lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();
</script>

<div bind:this={ref} data-slot="card-content" class={cn("px-6", className)} {...restProps}>
	{@render children?.()}
</div>
