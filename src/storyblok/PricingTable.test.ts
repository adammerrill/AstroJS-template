/**
 * @file PricingTable.test.ts
 * @description Unit tests for PricingTable reactivity.
 * Verifies that clicking the toggle switches displayed prices between monthly and yearly.
 */
import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import PricingTable from "./PricingTable.svelte";
import type { SbBlokData } from "@storyblok/astro";

// Mock Data
const mockBlok = {
  _uid: "pricing-1",
  component: "pricing_table",
  headline: "Pricing Plans",
  tiers: [
    {
      _uid: "t1",
      name: "Starter",
      price_monthly: "$29",
      price_yearly: "$290",
      features: [{ text: "Basic Feature" }],
      cta_label: "Buy Now",
    },
    {
      _uid: "t2",
      name: "Pro",
      price_monthly: "$99",
      price_yearly: "$990",
      highlight: true,
    },
  ],
} as unknown as SbBlokData;

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
