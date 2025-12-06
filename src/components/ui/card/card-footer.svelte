<script lang="ts">
	/**
	 * @file Card Footer Component
	 * @module components/ui/card
	 * @classification Public
	 * @author Atom Merrill
	 * @version 2.0.0
	 * @requirement REQ-SYS-001 - Card Component Standardization
	 * @test_ref src/components/ui/card/card.test.ts
	 * 
	 * @description
	 * Footer container for Card. Provides top border styling and flex layout for action buttons.
	 * Typically contains primary/secondary action pairs.
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
	data-slot="card-footer"
	class={cn("[.border-t]:pt-6 flex items-center px-6", className)}
	{...restProps}
>
	{@render children?.()}
</div>
