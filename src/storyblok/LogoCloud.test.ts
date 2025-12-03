/**
 * @file LogoCloud.test.ts
 * @description Unit verification for LogoCloud.
 * Ensures headlines render and images are generated with correct attributes.
 */
import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import LogoCloud from "./LogoCloud.svelte";
import type { LogoCloudBlok, LogoItemBlok } from "@/types/generated/storyblok";

// Mock Data with proper structure
const mockBlok: LogoCloudBlok = {
  _uid: "cloud-1",
  component: "logo_cloud",
  headline: "Trusted by Industry Leaders",
  logos: [
    {
      _uid: "l1",
      component: "logo_item",
      filename: {
        filename: "https://example.com/logo1.png",
        alt: "Acme Corp",
      },
      alt: "Acme Corp",
      name: "Acme Corp",
    } as LogoItemBlok,
    {
      _uid: "l2",
      component: "logo_item",
      filename: {
        filename: "https://example.com/logo2.png",
        alt: "",
      },
      alt: "",
      name: "Globex",
    } as LogoItemBlok,
  ],
};

describe("LogoCloud Component", () => {
  it("renders the headline", () => {
    render(LogoCloud, { props: { blok: mockBlok } });
    expect(screen.getByText("Trusted by Industry Leaders")).toBeInTheDocument();
  });

  it("renders logos with correct alt text", () => {
    render(LogoCloud, { props: { blok: mockBlok } });

    // Check explicit alt
    const img1 = screen.getByAltText("Acme Corp");
    expect(img1).toBeInTheDocument();
    expect(img1).toHaveAttribute("src", "https://example.com/logo1.png");

    // Check fallback to name
    const img2 = screen.getByAltText("Globex");
    expect(img2).toBeInTheDocument();
    expect(img2).toHaveAttribute("src", "https://example.com/logo2.png");
  });

  it("renders empty state when no logos provided", () => {
    const emptyBlok: LogoCloudBlok = {
      _uid: "cloud-empty",
      component: "logo_cloud",
      headline: "Trusted by Industry Leaders",
      logos: [],
    };
    render(LogoCloud, { props: { blok: emptyBlok } });
    expect(screen.getByText(/Add logos in Storyblok/i)).toBeInTheDocument();
  });
});
