import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import HeroSaas from "./HeroSaas.svelte";
import type { HeroSaasBlok } from "@/types/generated/storyblok";

// Mock Storyblok Blok with correct structure
const mockBlok: HeroSaasBlok = {
  _uid: "123",
  component: "hero_saas",
  headline: "Unit Test Headline",
  subheadline: "Unit Test Subheadline",
  cta_primary_label: "Get Started",
  cta_primary: {
    cached_url: "/signup",
    linktype: "url",
  },
  cta_secondary_label: "",
  cta_secondary: {
    cached_url: "",
    linktype: "url",
  },
  badge: "",
  image: {
    filename: "",
    alt: "",
  },
};

describe("HeroSaas Component", () => {
  it("renders the headline and subheadline", () => {
    render(HeroSaas, { props: { blok: mockBlok } });
    expect(screen.getByText("Unit Test Headline")).toBeInTheDocument();
    expect(screen.getByText("Unit Test Subheadline")).toBeInTheDocument();
  });

  it("renders the primary CTA with correct link", () => {
    render(HeroSaas, { props: { blok: mockBlok } });
    const button = screen.getByRole("link", { name: "Get Started" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/signup");
  });
});
