/**
 * @file card.test.ts
 * @description Unit tests for the Card component system.
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
  CardAction,
} from "./index.js";

const createSnippet = (content: string) => {
  return (anchor: Node) => {
    if (anchor && anchor.parentNode) {
      const textNode = document.createTextNode(content);
      anchor.parentNode.insertBefore(textNode, anchor);
    }
  };
};

describe("Card System", () => {
  describe("Card (Root)", () => {
    it("renders with default classes and data-slot", () => {
      render(Card, {
        props: { children: createSnippet("Card Body") } as Record<
          string,
          unknown
        >,
      });
      const card = screen.getByText("Card Body").closest("div");

      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("data-slot", "card");
      expect(card?.className).toContain("bg-card");
      expect(card?.className).toContain("rounded-xl");
    });

    it("merges custom classes", () => {
      render(Card, {
        props: {
          class: "w-[300px] border-red-500",
          children: createSnippet("Custom Card"),
        } as Record<string, unknown>,
      });
      const card = screen.getByText("Custom Card").closest("div");
      expect(card?.className).toContain("w-[300px]");
      expect(card?.className).toContain("border-red-500");
      expect(card?.className).toContain("border");
    });
  });

  describe("CardHeader", () => {
    it("renders correctly with grid layout", () => {
      render(CardHeader, {
        props: { children: createSnippet("Header Content") } as Record<
          string,
          unknown
        >,
      });
      const header = screen.getByText("Header Content").closest("div");

      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("data-slot", "card-header");
      expect(header?.className).toContain("grid");
      expect(header?.className).toContain("gap-1.5");
    });
  });

  describe("CardTitle", () => {
    it("renders as a generic div with semantic classes", () => {
      render(CardTitle, {
        props: { children: createSnippet("Card Title") } as Record<
          string,
          unknown
        >,
      });
      const title = screen.getByText("Card Title").closest("div");

      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "card-title");
      expect(title?.className).toContain("font-semibold");
      expect(title?.className).toContain("leading-none");
    });

    it("forwards arbitrary props (e.g. id)", () => {
      render(CardTitle, {
        props: {
          id: "test-title-id",
          children: createSnippet("Title"),
        } as Record<string, unknown>,
      });
      const title = screen.getByText("Title").closest("div");
      expect(title).toHaveAttribute("id", "test-title-id");
    });
  });

  describe("CardDescription", () => {
    it("renders as a paragraph (<p>) tag", () => {
      render(CardDescription, {
        props: { children: createSnippet("Description text") } as Record<
          string,
          unknown
        >,
      });
      const desc = screen.getByText("Description text");

      expect(desc.tagName).toBe("P");
      expect(desc).toHaveAttribute("data-slot", "card-description");
      expect(desc.className).toContain("text-muted-foreground");
    });
  });

  describe("CardContent", () => {
    it("renders with horizontal padding", () => {
      render(CardContent, {
        props: { children: createSnippet("Main Content") } as Record<
          string,
          unknown
        >,
      });
      const content = screen.getByText("Main Content").closest("div");

      expect(content).toHaveAttribute("data-slot", "card-content");
      expect(content?.className).toContain("px-6");
    });
  });

  describe("CardFooter", () => {
    it("renders with flex layout", () => {
      render(CardFooter, {
        props: { children: createSnippet("Footer Content") } as Record<
          string,
          unknown
        >,
      });
      const footer = screen.getByText("Footer Content").closest("div");

      expect(footer).toHaveAttribute("data-slot", "card-footer");
      expect(footer?.className).toContain("flex");
      expect(footer?.className).toContain("items-center");
    });
  });

  describe("CardAction", () => {
    it("renders with specific grid positioning classes", () => {
      render(CardAction, {
        props: { children: createSnippet("Action") } as Record<string, unknown>,
      });
      const action = screen.getByText("Action").closest("div");

      expect(action).toHaveAttribute("data-slot", "card-action");
      expect(action?.className).toContain("col-start-2");
      expect(action?.className).toContain("justify-self-end");
    });
  });
});
