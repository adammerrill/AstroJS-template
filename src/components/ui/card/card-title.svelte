<script lang="ts">
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
	data-slot="card-title"
	class={cn("font-semibold leading-none", className)}
	{...restProps}
>
	{@render children?.()}
</div>
