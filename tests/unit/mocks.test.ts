/**
 * @file mocks.test.ts
 * @description Unit tests for the Automated Mock Factory.
 * Ensures that developers can easily generate valid test data.
 */
import { describe, it, expect } from "vitest";
import { MockFactory } from "@/lib/mocks.generated";

describe("Automated Mock Factory", () => {
  it("generates a valid Hero SaaS mock with defaults", () => {
    const mock = MockFactory.hero_saas();

    expect(mock.component).toBe("hero_saas");
    expect(mock._uid).toBeDefined();
    // Should have generated faker data
    expect(typeof mock.headline).toBe("string");
    expect(mock.headline?.length).toBeGreaterThan(0);
  });

  it("accepts deep overrides", () => {
    const customHeadline = "Astro Enterprise v5";
    const mock = MockFactory.hero_saas({
      headline: customHeadline,
      badge: "New Release",
    });

    expect(mock.headline).toBe(customHeadline);
    expect(mock.badge).toBe("New Release");
    // Ensure other fields are still populated defaults
    expect(mock.component).toBe("hero_saas");
  });
});
