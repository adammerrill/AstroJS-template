/**
 * @fileoverview Unit Tests for Storyblok Resilience Layer (Phase 2 Validation)
 * @description
 * Verifies fallback logic, caching, and the new GENERIC TYPING implemented in Epic 2.3.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSafeStory, getGlobalSettings } from "@/lib/storyblok";
// Import generated types to verify generic usage
import type { PageBlok } from "@/types/generated/storyblok";

/* -------------------------------------------------------------------------- */
/* Mock Setup                                                                 */
/* -------------------------------------------------------------------------- */

const mockGet = vi.fn();

vi.mock("@storyblok/astro", () => ({
  useStoryblokApi: () => ({
    get: mockGet,
  }),
}));

interface MockApiError extends Error {
  response?: { status: number; data?: unknown };
  status?: number;
}

/* -------------------------------------------------------------------------- */
/* Test Suite                                                                 */
/* -------------------------------------------------------------------------- */

describe("Storyblok Resilience Layer (Generics & Safety)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("STORYBLOK_DELIVERY_API_TOKEN", "test-token-12345");
    // @ts-expect-error - Stubbing generic env var
    vi.stubEnv("DEV", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  /* ---------------------- Generic Type Validation ----------------------- */

  it("should handle Generic <PageBlok> request successfully", async () => {
    // Arrange: Mock a response that matches the PageBlok structure
    const mockPageData = {
      _uid: "123",
      component: "page",
      body: [],
    };

    mockGet.mockResolvedValueOnce({
      data: {
        story: {
          id: 123,
          name: "Home",
          slug: "home",
          full_slug: "home",
          content: mockPageData,
        },
      },
    });

    // Act: Call with explicit Generic Type
    const result = await getSafeStory<PageBlok>("home");

    // Assert: Runtime check (TypeScript check happens at build time)
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(200);
    expect(result.story?.content.component).toBe("page");
    // Verify structure matches expected generic
    expect(result.story?.content).toEqual(mockPageData);
  });

  /* ---------------------- Online Mode (API Success) ----------------------- */

  it("should return API data when the request succeeds", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        story: {
          id: 123,
          content: { title: "Online Content", component: "page" },
        },
      },
    });

    const result = await getSafeStory("home");

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(200);
    expect(result.story?.content.component).toBe("page");
  });

  /* -------------------- Fallback Recovery ---------------- */

  it("should fallback to local fixture when API fails", async () => {
    const apiError = new Error("500 Internal Server Error") as MockApiError;
    apiError.response = { status: 500 };
    mockGet.mockRejectedValueOnce(apiError);

    const result = await getSafeStory("home");

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(200);
    // Should return the Home fixture defined in src/lib/storyblok.ts
    expect(result.story?.name).toBe("Home");
  });

  /* ---------------------- Offline Mode -------------------- */

  it("should detect Offline Mode and serve fixtures without API call", async () => {
    vi.stubEnv("STORYBLOK_DELIVERY_API_TOKEN", "");

    const result = await getSafeStory("home");

    expect(mockGet).not.toHaveBeenCalled();
    expect(result.status).toBe(200);
    expect(result.story?.name).toBe("Home");
  });

  /* -------------------- Global Settings Caching --------------------- */

  it("should cache global settings on first fetch", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        story: {
          id: 999,
          content: { site_title: "Test Site", component: "global-settings" },
        },
      },
    });

    const result1 = await getGlobalSettings();
    const result2 = await getGlobalSettings();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result1.site_title).toBe("Test Site");
    expect(result2.site_title).toBe("Test Site");
  });
});
