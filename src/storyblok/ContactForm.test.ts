/**
 * @file ContactForm.test.ts
 * @description Unit tests for form validation logic.
 * Ensures error messages appear when required fields are empty.
 */
import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import ContactForm from "./ContactForm.svelte";
import type { ContactFormBlok } from "@/types/generated/storyblok";

const mockBlok: ContactFormBlok = {
  _uid: "form-1",
  component: "contact_form",
  headline: "Contact Us",
  submit_label: "Send",
  // Optional fields can be omitted or added as needed
  subheadline: "",
  success_message: "",
  api_endpoint: "",
};

describe("ContactForm Component", () => {
  it("renders the form fields", () => {
    render(ContactForm, { props: { blok: mockBlok } });
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(ContactForm, { props: { blok: mockBlok } });

    const submitBtn = screen.getByRole("button", { name: "Send" });
    await fireEvent.click(submitBtn);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  it("validates email format", async () => {
    render(ContactForm, { props: { blok: mockBlok } });

    const nameInput = screen.getByLabelText(/Name/);
    const emailInput = screen.getByLabelText(/Email/);
    const messageInput = screen.getByLabelText(/Message/);

    await fireEvent.input(nameInput, { target: { value: "Test" } });
    await fireEvent.input(emailInput, { target: { value: "invalid-email" } });
    await fireEvent.input(messageInput, { target: { value: "Test message" } });

    const submitBtn = screen.getByRole("button", { name: "Send" });
    await fireEvent.click(submitBtn);

    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });

  it("submits successfully with valid data", async () => {
    render(ContactForm, { props: { blok: mockBlok } });

    const nameInput = screen.getByLabelText(/Name/);
    const emailInput = screen.getByLabelText(/Email/);
    const messageInput = screen.getByLabelText(/Message/);

    await fireEvent.input(nameInput, { target: { value: "Test User" } });
    await fireEvent.input(emailInput, {
      target: { value: "test@example.com" },
    });
    await fireEvent.input(messageInput, { target: { value: "Test message" } });

    const submitBtn = screen.getByRole("button", { name: "Send" });
    await fireEvent.click(submitBtn);

    // Should show success message after submission
    await screen.findByTestId("success-message");
    expect(screen.getByText("Message Sent!")).toBeInTheDocument();
  });
});
