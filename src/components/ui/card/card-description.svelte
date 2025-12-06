<script lang="ts">
	/**
	 * @file Card Description Component
	 * @module components/ui/card
	 * @classification Public
	 * @author Atom Merrill
	 * @version 2.0.0
	 * @requirement REQ-SYS-001 - Card Component Standardization
	 * @test_ref src/components/ui/card/card.test.ts
	 * 
	 * @description
	 * Description text component for Card. Renders as muted paragraph text with proper line height.
	 * Intended for supplementary information below CardTitle.
	 */

	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "@/lib/utils.js";

	// Note: Description uses a <p> tag, so we use HTMLParagraphElement
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLParagraphElement> & { ref?: HTMLParagraphElement | null } = $props();
</script>

<p
	bind:this={ref}
	data-slot="card-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
>
	{@render children?.()}
</p>
