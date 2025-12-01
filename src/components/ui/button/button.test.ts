/**
 * @file button.test.ts
 * @description Unit tests for the Button component using Vitest and Testing Library.
 */

import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import Button from "./button.svelte";

/**
 * Helper to create a Svelte 5 Snippet compatible with JSDOM.
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
  it("renders as a button by default", () => {
    render(Button, {
      props: { children: createSnippet("Click me") } as Record<string, unknown>,
    });
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  it("renders as a link when href is provided", () => {
    render(Button, {
      props: {
        href: "#",
        children: createSnippet("Link Button"),
      } as Record<string, unknown>,
    });
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "#");
  });

  it("applies variant classes correctly", () => {
    // FIX: Removed unused 'container'
    render(Button, {
      props: {
        variant: "destructive",
        children: createSnippet("Delete"),
      } as Record<string, unknown>,
    });
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-destructive");
  });

  it("applies size classes correctly", () => {
    render(Button, {
      props: {
        size: "sm",
        children: createSnippet("Small"),
      } as Record<string, unknown>,
    });
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-8");
  });

  it("forwards additional props (disabled)", async () => {
    render(Button, {
      props: {
        disabled: true,
        children: createSnippet("Disabled"),
      } as Record<string, unknown>,
    });
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("handles clicks", async () => {
    const handleClick = vi.fn();
    // FIX: Removed unused 'component'
    render(Button, {
      props: { children: createSnippet("Clickable") } as Record<
        string,
        unknown
      >,
    });

    const button = screen.getByRole("button");
    button.onclick = handleClick;

    await fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("merges custom classes via cn utility", () => {
    render(Button, {
      props: {
        class: "custom-class-123",
        children: createSnippet("Custom"),
      } as Record<string, unknown>,
    });
    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class-123");
    expect(button.className).toContain("inline-flex");
  });
});
