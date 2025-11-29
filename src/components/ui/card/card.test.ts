/**
 * @file card.test.ts
 * @description Unit tests for the Card component system using Vitest and Testing Library.
 * Covers the full composite pattern: Root, Header, Title, Description, Content, Footer, and Action.
 * Verifies Svelte 5 snippet rendering, class merging, and prop forwarding.
 */

import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	CardAction
} from "./index.js";

/**
 * Helper to create a Svelte 5 Snippet compatible with JSDOM.
 * Svelte 5 snippets are functions that receive an anchor node and render content relative to it.
 * This allows us to pass string content to the 'children' prop during testing.
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

describe("Card System", () => {
	
	// --- Root Card Tests ---
	describe("Card (Root)", () => {
		it("renders with default classes and data-slot", () => {
			render(Card, { props: { children: createSnippet("Card Body") } as any });
			const card = screen.getByText("Card Body").closest("div");
			
			expect(card).toBeInTheDocument();
			expect(card).toHaveAttribute("data-slot", "card");
			expect(card?.className).toContain("bg-card");
			expect(card?.className).toContain("rounded-xl");
		});

		it("merges custom classes", () => {
			render(Card, { props: { class: "w-[300px] border-red-500", children: createSnippet("Custom Card") } as any });
			const card = screen.getByText("Custom Card").closest("div");
			expect(card?.className).toContain("w-[300px]");
			expect(card?.className).toContain("border-red-500");
			// Ensures base classes are still present
			expect(card?.className).toContain("border"); 
		});
	});

	// --- Card Header Tests ---
	describe("CardHeader", () => {
		it("renders correctly with grid layout", () => {
			render(CardHeader, { props: { children: createSnippet("Header Content") } as any });
			const header = screen.getByText("Header Content").closest("div");
			
			expect(header).toBeInTheDocument();
			expect(header).toHaveAttribute("data-slot", "card-header");
			// FIX: Your component uses 'grid', not 'flex'
			expect(header?.className).toContain("grid");
			expect(header?.className).toContain("gap-1.5");
		});
	});

	// --- Card Title Tests ---
	describe("CardTitle", () => {
		it("renders as a generic div with semantic classes", () => {
			render(CardTitle, { props: { children: createSnippet("Card Title") } as any });
			const title = screen.getByText("Card Title").closest("div");
			
			expect(title).toBeInTheDocument();
			expect(title).toHaveAttribute("data-slot", "card-title");
			expect(title?.className).toContain("font-semibold");
			expect(title?.className).toContain("leading-none");
		});

		it("forwards arbitrary props (e.g. id)", () => {
			render(CardTitle, { props: { id: "test-title-id", children: createSnippet("Title") } as any });
			const title = screen.getByText("Title").closest("div");
			expect(title).toHaveAttribute("id", "test-title-id");
		});
	});

	// --- Card Description Tests ---
	describe("CardDescription", () => {
		it("renders as a paragraph (<p>) tag", () => {
			render(CardDescription, { props: { children: createSnippet("Description text") } as any });
			const desc = screen.getByText("Description text");
			
			expect(desc.tagName).toBe("P");
			expect(desc).toHaveAttribute("data-slot", "card-description");
			expect(desc.className).toContain("text-muted-foreground");
		});
	});

	// --- Card Content Tests ---
	describe("CardContent", () => {
		it("renders with horizontal padding", () => {
			render(CardContent, { props: { children: createSnippet("Main Content") } as any });
			const content = screen.getByText("Main Content").closest("div");
			
			expect(content).toHaveAttribute("data-slot", "card-content");
			// FIX: Your component uses 'px-6', not 'p-6'
			expect(content?.className).toContain("px-6");
		});
	});

	// --- Card Footer Tests ---
	describe("CardFooter", () => {
		it("renders with flex layout", () => {
			render(CardFooter, { props: { children: createSnippet("Footer Content") } as any });
			const footer = screen.getByText("Footer Content").closest("div");
			
			expect(footer).toHaveAttribute("data-slot", "card-footer");
			expect(footer?.className).toContain("flex");
			expect(footer?.className).toContain("items-center");
		});
	});

	// --- Card Action Tests ---
	describe("CardAction", () => {
		it("renders with specific grid positioning classes", () => {
			render(CardAction, { props: { children: createSnippet("Action") } as any });
			const action = screen.getByText("Action").closest("div");
			
			expect(action).toHaveAttribute("data-slot", "card-action");
			// Check for the specific grid placement classes defined in card-action.svelte
			expect(action?.className).toContain("col-start-2");
			expect(action?.className).toContain("justify-self-end");
		});
	});
});