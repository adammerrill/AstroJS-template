/**
 * @file vitest.setup.ts
 * @description Global test setup file.
 * Initializes custom matchers from @testing-library/jest-dom (e.g., toBeInTheDocument)
 * and handles automatic cleanup for Svelte components.
 * * Includes explicit type reference to ensure globally augmented matchers are recognized.
 */

/// <reference types="@testing-library/jest-dom" />

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/svelte";
import { afterEach } from "vitest";

// Automatically cleanup DOM after each test to prevent leaking state between tests
afterEach(() => {
  cleanup();
});
