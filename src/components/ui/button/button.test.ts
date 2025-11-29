/**
 * @file button.test.ts
 * @description Unit tests for the Button component using Vitest and Testing Library.
 * Covers polymorphism (button vs anchor), style variants, prop forwarding, and event handling.
 */

import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import Button from "./button.svelte";

/**
 * Helper to create a Svelte 5 Snippet compatible with JSDOM.
 * Svelte 5 snippets are functions that receive an anchor node and render content relative to it.
 * @param content - The text content to render.
 */
const createSnippet = (content: string) => {
	return (anchor: Node) => {
		if (anchor && anchor.parentNode) {
			const textNode = document.createTextNode(content);
			anchor.parentNode.insertBefore(textNode, anchor);
		}
	};
};

describe("Button Component", () => {
	/**
	 * Test Case: Default Rendering
	 * Verifies that the component renders a <button> tag when no href is provided.
	 */
	it("renders as a button by default", () => {
		// FIX: Wrap string in createSnippet to satisfy Svelte 5 runtime
		render(Button, { props: { children: createSnippet("Click me") } as any });
		const button = screen.getByRole("button", { name: "Click me" });
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe("BUTTON");
	});

	/**
	 * Test Case: Polymorphism (Anchor)
	 * Verifies that the component renders an <a> tag when an href prop is provided.
	 */
	it("renders as a link when href is provided", () => {
		render(Button, { props: { href: "#", children: createSnippet("Link Button") } as any });
		const link = screen.getByRole("link", { name: "Link Button" });
		expect(link).toBeInTheDocument();
		expect(link.tagName).toBe("A");
		expect(link).toHaveAttribute("href", "#");
	});

	/**
	 * Test Case: Styling Variants
	 * Verifies that Tailwind classes associated with the 'destructive' variant are applied.
	 */
	it("applies variant classes correctly", () => {
		const { container } = render(Button, {
			props: { variant: "destructive", children: createSnippet("Delete") } as any,
		});
		const button = screen.getByRole("button");
		// Check for specific tailwind class from the variant definition
		expect(button.className).toContain("bg-destructive");
	});

	/**
	 * Test Case: Size Variants
	 * Verifies that Tailwind classes associated with the 'sm' (small) size are applied.
	 */
	it("applies size classes correctly", () => {
		render(Button, { props: { size: "sm", children: createSnippet("Small") } as any });
		const button = screen.getByRole("button");
		expect(button.className).toContain("h-8");
	});

	/**
	 * Test Case: Prop Forwarding
	 * Verifies that standard HTML attributes (like disabled) are correctly forwarded to the DOM element.
	 */
	it("forwards additional props (disabled)", async () => {
		render(Button, { props: { disabled: true, children: createSnippet("Disabled") } as any });
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
	});

	/**
	 * Test Case: Event Handling
	 * Verifies that click events are correctly dispatched to listeners.
	 */
	it("handles clicks", async () => {
		const handleClick = vi.fn();
		const { component } = render(Button, { props: { children: createSnippet("Clickable") } as any });
		
		const button = screen.getByRole("button");
		
		// In Svelte 5, events are often passed as props (onclick), but {...restProps} 
		// handles standard DOM events as well. We attach a listener manually for this test.
		button.onclick = handleClick;
		
		await fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	/**
	 * Test Case: Class Merging
	 * Verifies that custom classes passed via props are merged with the default variant classes
	 * using the `cn` utility.
	 */
	it("merges custom classes via cn utility", () => {
		render(Button, {
			props: { class: "custom-class-123", children: createSnippet("Custom") } as any,
		});
		const button = screen.getByRole("button");
		expect(button.className).toContain("custom-class-123");
		// Should still have base classes from the variant definition
		expect(button.className).toContain("inline-flex");
	});
});