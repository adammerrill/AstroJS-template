/**
 * @file HeroLocal.test.ts
 * @description Unit tests for HeroLocal.
 */
import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import HeroLocal from "./HeroLocal.svelte";
import type { HeroLocalBlok } from "@/types/generated/storyblok";

// Mock Storyblok Action
const mockBlok: HeroLocalBlok = {
  _uid: "456",
  component: "hero_local",
  headline: "Plumbing Experts Near You",
  subheadline:
    "Fast, reliable, and affordable plumbing services for your home or business.",
  service_area: "Austin, TX",
  cta_primary_label: "Book Service Now",
  background_image: { filename: "" }
};

describe("HeroLocal Component", () => {
  it("renders the split headline correctly", () => {
    render(HeroLocal, { props: { blok: mockBlok } });
    // This checks for the primary word and the rest of the text based on the Svelte logic
    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText("Experts Near You")).toBeInTheDocument();
  });

  it("renders the service area badge", () => {
    render(HeroLocal, { props: { blok: mockBlok } });
    expect(screen.getByText(/Serving: Austin, TX/i)).toBeInTheDocument();
  });

  it("renders the CTA button for mobile view", () => {
    render(HeroLocal, { props: { blok: mockBlok } });
    const button = screen.getByRole("link", { name: "Book Service Now" });
    expect(button).toBeInTheDocument();
  });
});
