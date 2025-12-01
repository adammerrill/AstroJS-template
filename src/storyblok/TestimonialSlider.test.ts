import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import TestimonialSlider from "./TestimonialSlider.svelte";
import type { SbBlokData } from "@storyblok/astro";

// Mock Data
const mockBlok = {
  _uid: "slider-1",
  component: "testimonial_slider",
  headline: "Client Success Stories",
  testimonials: [
    {
      _uid: "t1",
      quote: "Astro-Svelte is the future.",
      name: "Alice",
      title: "CEO",
    },
    {
      _uid: "t2",
      quote: "The best boilerplate I have ever used.",
      name: "Bob",
      title: "CTO",
    },
    {
      _uid: "t3",
      quote: "Passed all my tests!",
      name: "Charlie",
      title: "Developer",
    },
  ],
} as unknown as SbBlokData;

describe("TestimonialSlider Component", () => {
  it("renders the headline and the first testimonial", () => {
    render(TestimonialSlider, { props: { blok: mockBlok } });
    expect(
      screen.getByRole("heading", { name: "Client Success Stories" }),
    ).toBeInTheDocument();

    // Check for the first testimonial content
    expect(screen.getByText(/Astro-Svelte is the future/i)).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("advances to the next slide on click and cycles back", async () => {
    render(TestimonialSlider, { props: { blok: mockBlok } });

    const nextButton = screen.getByRole("button", { name: "Next testimonial" });
    const prevButton = screen.getByRole("button", {
      name: "Previous testimonial",
    });

    // 1. Check initial state
    expect(screen.getByText("Alice")).toBeInTheDocument();

    // 2. Click Next (Alice -> Bob)
    await fireEvent.click(nextButton);
    expect(screen.getByText("Bob")).toBeInTheDocument();

    // 3. Click Next (Bob -> Charlie)
    await fireEvent.click(nextButton);
    expect(screen.getByText("Charlie")).toBeInTheDocument();

    // 4. Click Next (Charlie -> Alice - Cycle)
    await fireEvent.click(nextButton);
    expect(screen.getByText("Alice")).toBeInTheDocument();

    // 5. Click Prev (Alice -> Charlie)
    await fireEvent.click(prevButton);
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });
});