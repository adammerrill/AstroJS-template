/**
 * @file header.spec.ts
 * @description End-to-end tests for Header component with responsive navigation.
 * Validates responsive behavior, accessibility, and interaction patterns.
 *
 * Test Coverage:
 * - Responsive breakpoint behavior (1020px)
 * - Mobile drawer interactions (open, close, keyboard, backdrop)
 * - Focus management and trap
 * - Body scroll lock/unlock
 * - Layout and spacing at various viewports
 * - ARIA attributes and accessibility
 * - Visual effects (glass, blur)
 *
 * @requires @playwright/test
 * @requires Header.astro (component under test)
 * @see {@link https://playwright.dev/docs/writing-tests}
 * @version 2025-12-01 - Includes global mock for deterministic Storyblok header/footer data.
 */

import {
  test,
  expect,
  type Page,
  type BrowserContext,
  type Route,
} from "@playwright/test";
import { mockGlobalSettings } from "./global-mock-setup";

/**
 * Predefined viewport sizes for testing responsive behavior.
 * @constant
 */
const viewports = {
  wide: { width: 1280, height: 900 },
  narrow: { width: 390, height: 844 },
  breakpointExact: { width: 1020, height: 900 },
  breakpointMinusOne: { width: 1019, height: 900 },
};

test.describe("Header Component - Production Validation", () => {
  test.beforeEach(
    async ({
      page,
      context,
    }: {
      page: Page;
      context: BrowserContext;
    }): Promise<void> => {
      // Mock Storyblok Global Settings
      // This ensures header/footer data is reliable and eliminates 404 console noise.
      await mockGlobalSettings(page);

      // Isolate tests by blocking potential external scripts that cause timeouts.
      // This addresses the observed failures in opening the mobile menu.
      await context.route("**/@storyblok/**", (route: Route) => route.abort());
      await context.route(
        "**/node_modules/.vite/deps/@storyblok**",
        (route: Route) => route.abort(),
      );
      await context.route("**/__astro_dev_toolbar__**", (route: Route) =>
        route.abort(),
      );
      await context.route("**/storyblok-v2-latest.js*", (route: Route) =>
        route.abort(),
      ); // Block Bridge script

      // Navigate to the base route AFTER setting up the mock and blocking rules.
      await page.goto("/", { waitUntil: "domcontentloaded" });

      // There isn't a global window var for the header script, so we wait for stability
      await page.waitForLoadState("networkidle");
    },
  );

  // -------------------------------------------------------------------------
  // TEST SUITE: Breakpoint Behavior (1020px)
  // -------------------------------------------------------------------------
  test.describe("Breakpoint Behavior (1020px)", () => {
    /**
     * Test case: Checks desktop layout visibility.
     */
    test("Wide: ≥1020px hides hamburger and shows desktop nav", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.wide);
      // Note: page.goto is already called in beforeEach for '/'

      await expect(page.locator("#mobile-menu-button")).toBeHidden();
      await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
      // Assertion uses the MOCK SITE title if the global settings mock contains it
      await expect(
        page.locator('span:text-is("Astro Template")'),
      ).toBeVisible();

      // Only visible CTA (not drawer CTA)
      await expect(
        page.locator('[data-testid="header-cta"] >> visible=true'),
      ).toBeVisible();
    });

    /**
     * Test case: Checks mobile layout visibility.
     */
    test("Narrow: <1020px shows hamburger and hides desktop nav", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      // Note: page.goto is already called in beforeEach for '/'

      const hamburger = page.locator("#mobile-menu-button");
      await expect(hamburger).toBeVisible();
      await expect(hamburger).toHaveAttribute("aria-expanded", "false");

      await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();
      await expect(page.locator('span:text-is("Astro Template")')).toBeHidden();
      await expect(page.locator('[data-testid="header-cta"]')).toBeVisible();
    });

    /**
     * Test case: Checks strict breakpoint for hamburger menu visibility.
     */
    test("Exact breakpoint 1020px: no hamburger", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.breakpointExact);
      await page.goto("/");
      await expect(page.locator("#mobile-menu-button")).toBeHidden();
      await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
    });

    /**
     * Test case: Checks strict breakpoint transition.
     */
    test("Breakpoint minus 1px (1019px): hamburger visible", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.breakpointMinusOne);
      await page.goto("/");
      await expect(page.locator("#mobile-menu-button")).toBeVisible();
      await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();
    });
  });

  // -------------------------------------------------------------------------
  // TEST SUITE: Layout and Spacing (Remaining tests utilize the same setup)
  // -------------------------------------------------------------------------
  test.describe("Layout & Spacing", () => {
    // Note: The parent beforeEach ensures the necessary mocking is active.

    /**
     * Test case: Verifies horizontal padding consistency on mobile screens.
     */
    test("Padding: 16px horizontal <1020px", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const container = page.locator("#main-header > div");
      await expect(container).toHaveCSS("padding-left", "16px");
      await expect(container).toHaveCSS("padding-right", "16px");
    });

    /**
     * Test case: Verifies horizontal padding consistency on desktop screens.
     */
    test("Padding: 24px horizontal ≥1020px", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.wide);
      await page.goto("/");
      const container = page.locator("#main-header > div");
      await expect(container).toHaveCSS("padding-left", "24px");
      await expect(container).toHaveCSS("padding-right", "24px");
    });

    /**
     * Test case: Verifies vertical padding consistency.
     */
    test("Vertical padding: 16px top/bottom", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const container = page.locator("#main-header > div");
      await expect(container).toHaveCSS("padding-top", "16px");
      await expect(container).toHaveCSS("padding-bottom", "16px");
    });

    /**
     * Test case: Verifies container width constraint.
     */
    test("Max width: 1280px", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize({ width: 2000, height: 900 });
      await page.goto("/");
      await expect(page.locator("#main-header > div")).toHaveCSS(
        "max-width",
        "1280px",
      );
    });

    /**
     * Test case: Verifies logo positioning relative to the container edge.
     */
    test("Left alignment: logo at container edge", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const logo = page.locator("#main-header svg").first();
      const container = page.locator("#main-header > div");
      const logoBox = await logo.boundingBox();
      const containerBox = await container.boundingBox();
      if (logoBox && containerBox) {
        expect(logoBox.x).toBe(containerBox.x + 16);
      }
    });

    /**
     * Test case: Verifies CTA/Hamburger group positioning relative to the container edge.
     */
    test("Right alignment: CTA/hamburger at right edge", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const rightGroup = page.locator("#main-header > div > div:last-child");
      const container = page.locator("#main-header > div");
      const groupBox = await rightGroup.boundingBox();
      const containerBox = await container.boundingBox();
      if (groupBox && containerBox) {
        expect(groupBox.x + groupBox.width).toBe(
          containerBox.x + containerBox.width - 16,
        );
      }
    });

    /**
     * Test case: Verifies spacing (gap) between the CTA button and the hamburger menu.
     */
    test("Gap: 24px between CTA and hamburger", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const cta = page.locator('[data-testid="header-cta"]');
      const hamburger = page.locator("#mobile-menu-button");
      const ctaBox = await cta.boundingBox();
      const hamburgerBox = await hamburger.boundingBox();
      if (ctaBox && hamburgerBox) {
        const gap = hamburgerBox.x - (ctaBox.x + ctaBox.width);
        expect(gap).toBe(24);
      }
    });
  });

  // -------------------------------------------------------------------------
  // TEST SUITE: Mobile Drawer Interactions (Functional)
  // -------------------------------------------------------------------------
  test.describe("Mobile Drawer", () => {
    test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
    });

    /**
     * Test case: Verifies the drawer opens and the glass/blur backdrop is active.
     */
    test("Opens with backdrop blur", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      const hamburger = page.locator("#mobile-menu-button");

      // Wait for button to be interactive
      await expect(hamburger).toBeVisible();
      await expect(hamburger).toBeEnabled();

      // Click and wait for drawer state change
      await hamburger.click();

      // Wait for drawer to fully open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      const backdrop = page.locator("#drawer-backdrop");
      await expect(backdrop).toBeVisible();
      const backdropFilter = await backdrop.evaluate(
        (el: HTMLElement) => window.getComputedStyle(el).backdropFilter,
      );
      expect(backdropFilter).toContain("blur");
    });

    /**
     * Test case: Verifies the contents match the mock/default links.
     */
    test("Contains navigation links", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.locator("#mobile-menu-button").click();

      // Wait for drawer to open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      const navLinks = page.locator("#mobile-drawer nav a");
      // Assertion relies on the mock returning empty navLinks, defaulting to 4 in Header.astro
      await expect(navLinks).toHaveCount(4);

      // Verify 'About' link exists (from default links)
      await expect(
        page.locator('#mobile-drawer a:text-is("About")'),
      ).toBeVisible();
    });

    /**
     * Test case: Verifies the primary closing mechanism (Escape key).
     */
    test("Closes on Escape key", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.locator("#mobile-menu-button").click();

      // Wait for drawer to fully open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      // Press Escape
      await page.keyboard.press("Escape");

      // Wait for drawer to close
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "closed", { timeout: 5000 });
    });

    /**
     * Test case: Verifies closing by clicking the backdrop outside the drawer panel.
     */
    test("Closes on backdrop click", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.locator("#mobile-menu-button").click();

      // Wait for drawer to fully open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      // Click backdrop (force because it may be behind panel)
      await page.locator("#drawer-backdrop").click({ force: true });

      // Wait for drawer to close
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "closed", { timeout: 5000 });
    });

    /**
     * Test case: Verifies focus cycling and trap behavior inside the modal drawer.
     */
    test("Focus trap cycles within drawer", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.locator("#mobile-menu-button").click();

      // Wait for drawer to open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      const closeButton = page.locator("#drawer-close-button");

      // Verify close button receives initial focus
      await expect(closeButton).toBeFocused({ timeout: 5000 });

      // Tab forward to first nav link
      await page.keyboard.press("Tab");
      await expect(page.locator("#mobile-drawer nav a").first()).toBeFocused();

      // Shift+Tab back to close button
      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      await expect(closeButton).toBeFocused();
    });

    /**
     * Test case: Verifies body scroll is locked when the drawer is open.
     */
    test("Body scroll lock when open", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.locator("#mobile-menu-button").click();

      // Wait for drawer to open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      const isLocked = await page.evaluate(
        () => document.body.style.overflow === "hidden",
      );
      expect(isLocked).toBe(true);
    });

    /**
     * Test case: Verifies body scroll state is restored when the drawer closes.
     */
    test("Body scroll restored when closed", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      // Open drawer
      await page.locator("#mobile-menu-button").click();

      // Wait for drawer to open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      // Close drawer with Escape
      await page.keyboard.press("Escape");

      // Wait for drawer to close
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "closed", { timeout: 5000 });

      // Verify body scroll is restored
      const isRestored = await page.evaluate(
        () =>
          document.body.style.overflow === "" ||
          document.body.style.overflow === "visible",
      );
      expect(isRestored).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // TEST SUITE: Accessibility (ARIA)
  // -------------------------------------------------------------------------
  test.describe("Accessibility", () => {
    /**
     * Test case: Verifies required ARIA attributes on the hamburger button.
     */
    test("Hamburger ARIA attributes", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const hamburger = page.locator("#mobile-menu-button");
      await expect(hamburger).toHaveAttribute(
        "aria-label",
        "Open navigation menu",
      );
      await expect(hamburger).toHaveAttribute("aria-expanded", "false");
      await expect(hamburger).toHaveAttribute("aria-controls", "mobile-drawer");
    });

    /**
     * Test case: Verifies required ARIA attributes on the mobile drawer element.
     */
    test("Drawer ARIA attributes", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const drawer = page.locator('[data-testid="mobile-drawer"]');
      await expect(drawer).toHaveAttribute("role", "dialog");
      await expect(drawer).toHaveAttribute("aria-modal", "true");
      await expect(drawer).toHaveAttribute("aria-hidden", "true");

      await page.locator("#mobile-menu-button").click();
      await expect(drawer).toHaveAttribute("aria-hidden", "false", {
        timeout: 5000,
      });
    });
  });

  // -------------------------------------------------------------------------
  // TEST SUITE: Visual Effects
  // -------------------------------------------------------------------------
  test.describe("Visual Effects", () => {
    /**
     * Test case: Verifies the header maintains the CSS 'glass' effect (backdrop filter).
     */
    test("Header glass effect at all widths", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");

      // Use specific header selector
      const header = page.locator("#main-header");
      const backdropFilter = await header.evaluate(
        (el: HTMLElement) => window.getComputedStyle(el).backdropFilter,
      );
      expect(backdropFilter).toContain("blur");

      await page.setViewportSize(viewports.wide);
      await page.reload();

      const headerWide = page.locator("#main-header");
      const backdropFilterWide = await headerWide.evaluate(
        (el: HTMLElement) => window.getComputedStyle(el).backdropFilter,
      );
      expect(backdropFilterWide).toContain("blur");
    });

    /**
     * Test case: Verifies the drawer panel uses the 'glass' effect when open.
     */
    test("Drawer glass effect when open", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      await page.locator("#mobile-menu-button").click();

      // Wait for drawer to open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      const drawerPanel = page.locator("#drawer-panel");
      const styles = await drawerPanel.evaluate((el: HTMLElement) => ({
        backdropFilter: window.getComputedStyle(el).backdropFilter,
        backgroundColor: window.getComputedStyle(el).backgroundColor,
      }));
      expect(styles.backdropFilter).toContain("blur");
      expect(styles.backgroundColor).toContain("rgba");
    });
  });

  // -------------------------------------------------------------------------
  // TEST SUITE: CTA Persistence
  // -------------------------------------------------------------------------
  test.describe("CTA Persistence", () => {
    /**
     * Test case: Verifies the CTA button is visible in the main header at all widths.
     */
    test("CTA visible at all widths", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      await expect(
        page.locator('[data-testid="header-cta"] >> visible=true'),
      ).toBeVisible();

      await page.setViewportSize(viewports.wide);
      await page.reload();
      await expect(
        page.locator('[data-testid="header-cta"] >> visible=true'),
      ).toBeVisible();
    });

    /**
     * Test case: Verifies the CTA is duplicated and visible in both the header and the open drawer.
     */
    test("CTA appears once in header, once in drawer when open", async ({
      page,
    }: {
      page: Page;
    }): Promise<void> => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");

      // Initially one VISIBLE CTA in header (drawer CTA is hidden)
      const visibleCtas = page.locator(
        '[data-testid="header-cta"] >> visible=true',
      );
      expect(await visibleCtas.count()).toBe(1);

      // Open drawer
      await page.locator("#mobile-menu-button").click();

      // Wait for drawer to open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      // Should now have header CTA + drawer CTA
      const headerCta = page.locator(
        '[data-testid="header-cta"] >> visible=true',
      );
      const drawerCta = page.locator(
        '[data-testid="drawer-cta"] >> visible=true',
      );
      expect(await headerCta.count()).toBe(1);
      expect(await drawerCta.count()).toBe(1);
    });
  });
});
