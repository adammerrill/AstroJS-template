import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import HeroConsultant from "./HeroConsultant.svelte";
import type { SbBlokData } from "@storyblok/astro";

// Mock Storyblok Action
const mockBlok = {
  _uid: "789",
  component: "hero_consultant",
  headline: "Test Consulting Headline",
  subheadline: "Test Consulting Subheadline text.",
  cta_primary_label: "Book a Strategy Call",
  cta_primary: [{ url: "/contact" }],
} as unknown as SbBlokData;

describe("HeroConsultant Component", () => {
  it("renders the headline and subheadline", () => {
    render(HeroConsultant, { props: { blok: mockBlok } });
    expect(screen.getByText("Test Consulting Headline")).toBeInTheDocument();
    expect(
      screen.getByText("Test Consulting Subheadline text."),
    ).toBeInTheDocument();
  });

  it("renders the primary CTA with correct link", () => {
    render(HeroConsultant, { props: { blok: mockBlok } });
    const button = screen.getByRole("link", { name: "Book a Strategy Call" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/contact");
  });
});
