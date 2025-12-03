import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import HeroConsultant from "./HeroConsultant.svelte";
import type { HeroConsultantBlok } from "@/types/generated/storyblok";

// Mock Storyblok Blok with correct structure
const mockBlok: HeroConsultantBlok = {
  _uid: "789",
  component: "hero_consultant",
  headline: "Test Consulting Headline",
  subheadline: "Test Consulting Subheadline text.",
  cta_primary_label: "Book a Strategy Call",
  cta_primary: {
    cached_url: "/contact",
    linktype: "url",
  },
  headshot: {
    filename: "",
    alt: "",
  },
};

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
