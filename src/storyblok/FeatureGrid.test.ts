import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import FeatureGrid from "./FeatureGrid.svelte";
import type { SbBlokData } from "@storyblok/astro";

// Mock Data
const mockBlok = {
  _uid: "grid-1",
  component: "feature_grid",
  headline: "Powerful Features",
  description: "Everything you need to succeed.",
  columns: [
    {
      _uid: "f1",
      component: "feature",
      headline: "Speed",
      description: "Fast rendering.",
    },
    {
      _uid: "f2",
      component: "feature",
      headline: "Security",
      description: "Safe data.",
    },
    {
      _uid: "f3",
      component: "feature",
      headline: "Scalability",
      description: "Grows with you.",
    },
  ],
} as unknown as SbBlokData;

describe("FeatureGrid Component", () => {
  it("renders the section headline and description", () => {
    render(FeatureGrid, { props: { blok: mockBlok } });
    expect(
      screen.getByRole("heading", { name: "Powerful Features" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Everything you need to succeed."),
    ).toBeInTheDocument();
  });

  it("renders the correct number of feature cards", () => {
    render(FeatureGrid, { props: { blok: mockBlok } });
    expect(screen.getByRole("heading", { name: "Speed" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Security" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Scalability" }),
    ).toBeInTheDocument();
  });
});
