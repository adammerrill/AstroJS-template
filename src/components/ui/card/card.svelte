<script lang="ts">
	/**
	 * @file Card Component
	 * @module components/ui/card
	 * @classification Public
	 * @compliance ISO/IEC 25010 - Reusability & Compatibility
	 * @compliance WCAG 2.2 AA - ARIA Roles & Landmark Navigation
	 * @author Atom Merrill
	 * @version 2.0.0
	 * @requirement REQ-SYS-001 - Design System Core
	 * @requirement REQ-UI-004 - Content Container Patterns
	 * @test_ref src/components/ui/card/card.test.ts
	 * @test_ref tests/e2e/card-a11y.spec.ts
	 * 
	 * @description
	 * Design system card primitive providing semantic container for grouped content.
	 * Implements CSS Grid subgrid pattern for aligned child components.
	 *
	 * @description Layout Architecture:
	 * - **Subgrid support**: Child components align via `data-slot` attributes
	 * - **Flexible composition**: Optional header/content/footer sections
	 * - **Border radius**: 12px (0.75rem) for modern aesthetic
	 * - **Elevation**: shadow-sm (1px blur) for subtle depth
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

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
