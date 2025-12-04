/**
 * @file PricingTable.test.ts
 * @description Unit tests for PricingTable reactivity.
 * Verifies that clicking the toggle switches displayed prices between monthly and yearly.
 */
import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import PricingTable from "./PricingTable.svelte";
import type {
  PricingTableBlok,
  PricingTierBlok,
  PricingFeatureBlok,
} from "@/types/generated/storyblok";

// Mock Data with proper typing
const mockBlok: PricingTableBlok = {
  _uid: "pricing-1",
  component: "pricing_table",
  headline: "Pricing Plans",
  tiers: [
    {
      _uid: "t1",
      component: "pricing_tier",
      name: "Starter",
      price_monthly: "$29",
      price_yearly: "$290",
      features: [
        {
          _uid: "f1",
          component: "pricing_feature",
          text: "Basic Feature",
        } as PricingFeatureBlok,
      ],
      cta_label: "Buy Now",
      cta_link: {
        cached_url: "",
        linktype: "url",
      },
      highlight: false,
    } as PricingTierBlok,
    {
      _uid: "t2",
      component: "pricing_tier",
      name: "Pro",
      price_monthly: "$99",
      price_yearly: "$990",
      features: [],
      cta_label: "",
      cta_link: {
        cached_url: "",
        linktype: "url",
      },
      highlight: true,
    } as PricingTierBlok,
  ],
};

describe("PricingTable Component", () => {
  it("renders tiers and initial monthly prices", () => {
    render(PricingTable, { props: { blok: mockBlok } });

    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();

    // Check for monthly prices
    const prices = screen.getAllByTestId("price-display");
    expect(prices[0]).toHaveTextContent("$29");
    expect(prices[1]).toHaveTextContent("$99");
  });

  it("toggles to yearly pricing on click", async () => {
    render(PricingTable, { props: { blok: mockBlok } });

    const toggle = screen.getByTestId("billing-toggle");
    await fireEvent.click(toggle);

    // Check for yearly prices
    const prices = screen.getAllByTestId("price-display");
    expect(prices[0]).toHaveTextContent("$290");
    expect(prices[1]).toHaveTextContent("$990");

    // Check suffix update
    expect(screen.getAllByText("/yr")[0]).toBeInTheDocument();
  });

  it("renders the 'Most Popular' badge on highlighted tier", () => {
    render(PricingTable, { props: { blok: mockBlok } });
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });
});
