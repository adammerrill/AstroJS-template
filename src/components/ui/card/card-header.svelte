<script lang="ts">
	/**
	 * @file Card Header Component
	 * @module components/ui/card
	 * @classification Public
	 * @author Atom Merrill
	 * @version 2.0.0
	 * @requirement REQ-SYS-001 - Card Component Standardization
	 * @test_ref src/components/ui/card/card.test.ts
	 * 
	 * @description
	 * Header container for Card using CSS Grid to support action slot positioning.
	 * Provides visual separation with optional bottom border (`.border-b` utility).
	 */
  
	import { cn } from "@/lib/utils";
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
	data-slot="card-header"
	class={cn(
		"@container/card-header has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
