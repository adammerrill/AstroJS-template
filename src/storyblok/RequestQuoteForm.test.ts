/**
 * @file RequestQuoteForm.test.ts
 * @description Unit tests for the multi-step logic.
 */
import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import RequestQuoteForm from "./RequestQuoteForm.svelte";
import type { SbBlokData } from "@storyblok/astro";

const mockBlok = {
  _uid: "quote-1",
  component: "request_quote_form",
  headline: "Get a Quote",
} as unknown as SbBlokData;

describe("RequestQuoteForm Component", () => {
  it("renders step 1 initially", () => {
    render(RequestQuoteForm, { props: { blok: mockBlok } });
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Type/)).toBeInTheDocument();
  });

  it("validates step 1 before proceeding", async () => {
    render(RequestQuoteForm, { props: { blok: mockBlok } });

    const nextBtn = screen.getByText("Next Step");
    await fireEvent.click(nextBtn);

    expect(screen.getByText("Please select a service.")).toBeInTheDocument();
    expect(screen.queryByText("Step 2 of 3")).not.toBeInTheDocument();
  });

  it("moves to step 2 after valid input", async () => {
    render(RequestQuoteForm, { props: { blok: mockBlok } });

    // Fill Step 1
    const select = screen.getByLabelText(/Service Type/);
    await fireEvent.change(select, { target: { value: "plumbing" } });

    const desc = screen.getByLabelText(/Description/);
    await fireEvent.input(desc, { target: { value: "Leaky faucet" } });

    const nextBtn = screen.getByText("Next Step");
    await fireEvent.click(nextBtn);

    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/)).toBeInTheDocument();
  });
});
