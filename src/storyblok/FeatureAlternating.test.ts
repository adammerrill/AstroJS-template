/**
 * @file FeatureAlternating.test.ts
 * @description Unit tests for the Zig-Zag layout logic.
 * Verifies that CSS classes for row-reversal are applied correctly based on index.
 */
import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import FeatureAlternating from "./FeatureAlternating.svelte";
import type { SbBlokData } from "@storyblok/astro";

// Mock Data
const mockBlok = {
  _uid: "alt-1",
  component: "feature_alternating",
  headline: "Deep Dive",
  items: [
    {
      _uid: "1",
      headline: "Item One (Left)",
      description: "Desc 1",
      image: { filename: "" },
    },
    {
      _uid: "2",
      headline: "Item Two (Right)",
      description: "Desc 2",
      image: { filename: "" },
    },
    {
      _uid: "3",
      headline: "Item Three (Left)",
      description: "Desc 3",
      image: { filename: "" },
    },
  ],
} as unknown as SbBlokData;

describe("FeatureAlternating Component", () => {
  it("renders the main headline", () => {
    render(FeatureAlternating, { props: { blok: mockBlok } });
    expect(
      screen.getByRole("heading", { name: "Deep Dive" }),
    ).toBeInTheDocument();
  });

  it("renders all feature items", () => {
    render(FeatureAlternating, { props: { blok: mockBlok } });
    expect(
      screen.getByRole("heading", { name: "Item One (Left)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Item Two (Right)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Item Three (Left)" }),
    ).toBeInTheDocument();
  });

  it("applies alternating layout classes", () => {
    render(FeatureAlternating, { props: { blok: mockBlok } });

    // Item 0 (Even) -> Standard Row
    const row0 = screen.getByTestId("feature-row-0");
    expect(row0.className).toContain("lg:flex-row");
    expect(row0.className).not.toContain("lg:flex-row-reverse");

    // Item 1 (Odd) -> Reversed Row
    const row1 = screen.getByTestId("feature-row-1");
    expect(row1.className).toContain("lg:flex-row-reverse");

    // Item 2 (Even) -> Standard Row
    const row2 = screen.getByTestId("feature-row-2");
    expect(row2.className).toContain("lg:flex-row");
    expect(row2.className).not.toContain("lg:flex-row-reverse");
  });
});
