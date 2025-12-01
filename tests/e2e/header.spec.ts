/**
 * @file header.spec.ts
 * @description End-to-end tests for Header component with mobile drawer.
 *              Validates responsive behavior, accessibility, and interaction patterns.
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
 */

import { test, expect } from "@playwright/test";

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
  /**
   * Test Suite: Responsive Breakpoint Behavior
   * Validates that UI elements appear/hide correctly at the 1020px breakpoint.
   */
  test.describe("Breakpoint Behavior (1020px)", () => {
    test("Wide: ≥1020px hides hamburger and shows desktop nav", async ({
      page,
    }) => {
      await page.setViewportSize(viewports.wide);
      await page.goto("/");

      await expect(page.locator("#mobile-menu-button")).toBeHidden();
      await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
      await expect(
        page.locator('span:text-is("Astro Template")'),
      ).toBeVisible();

      // Only visible CTA (not drawer CTA)
      await expect(
        page.locator('[data-testid="header-cta"] >> visible=true'),
      ).toBeVisible();
    });

    test("Narrow: <1020px shows hamburger and hides desktop nav", async ({
      page,
    }) => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");

      const hamburger = page.locator("#mobile-menu-button");
      await expect(hamburger).toBeVisible();
      await expect(hamburger).toHaveAttribute("aria-expanded", "false");

      await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();
      await expect(page.locator('span:text-is("Astro Template")')).toBeHidden();
      await expect(page.locator('[data-testid="header-cta"]')).toBeVisible();
    });

    test("Exact breakpoint 1020px: no hamburger", async ({ page }) => {
      await page.setViewportSize(viewports.breakpointExact);
      await page.goto("/");
      await expect(page.locator("#mobile-menu-button")).toBeHidden();
      await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
    });

    test("Breakpoint minus 1px (1019px): hamburger visible", async ({
      page,
    }) => {
      await page.setViewportSize(viewports.breakpointMinusOne);
      await page.goto("/");
      await expect(page.locator("#mobile-menu-button")).toBeVisible();
      await expect(page.locator('[data-testid="desktop-nav"]')).toBeHidden();
    });
  });

  /**
   * Test Suite: Layout and Spacing
   * Validates padding, max-width, and alignment at different viewports.
   */
  test.describe("Layout & Spacing", () => {
    test("Padding: 16px horizontal <1020px", async ({ page }) => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const container = page.locator("#main-header > div");
      await expect(container).toHaveCSS("padding-left", "16px");
      await expect(container).toHaveCSS("padding-right", "16px");
    });

    test("Padding: 24px horizontal ≥1020px", async ({ page }) => {
      await page.setViewportSize(viewports.wide);
      await page.goto("/");
      const container = page.locator("#main-header > div");
      await expect(container).toHaveCSS("padding-left", "24px");
      await expect(container).toHaveCSS("padding-right", "24px");
    });

    test("Vertical padding: 16px top/bottom", async ({ page }) => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const container = page.locator("#main-header > div");
      await expect(container).toHaveCSS("padding-top", "16px");
      await expect(container).toHaveCSS("padding-bottom", "16px");
    });

    test("Max width: 1280px", async ({ page }) => {
      await page.setViewportSize({ width: 2000, height: 900 });
      await page.goto("/");
      await expect(page.locator("#main-header > div")).toHaveCSS(
        "max-width",
        "1280px",
      );
    });

    test("Left alignment: logo at container edge", async ({ page }) => {
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

    test("Right alignment: CTA/hamburger at right edge", async ({ page }) => {
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

    test("Gap: 24px between CTA and hamburger", async ({ page }) => {
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

  /**
   * Test Suite: Mobile Drawer Interactions
   * Validates drawer open/close, keyboard navigation, focus trap, and scroll lock.
   */
  test.describe("Mobile Drawer", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
    });

    test("Opens with backdrop blur", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      
      // Wait for drawer to fully open
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open", { timeout: 5000 });

      const backdrop = page.locator("#drawer-backdrop");
      await expect(backdrop).toBeVisible();
      const backdropFilter = await backdrop.evaluate(
        (el) => window.getComputedStyle(el).backdropFilter,
      );
      expect(backdropFilter).toContain("blur");
    });

    test("Contains navigation links", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      
      // Wait for drawer to open
      await page.waitForTimeout(500);
      
      const navLinks = page.locator("#mobile-drawer nav a");
      await expect(navLinks).toHaveCount(4);
      
      // Verify 'About' link exists (updated from 'Contact')
      await expect(
        page.locator('#mobile-drawer a:text-is("About")'),
      ).toBeVisible();
    });

    test("Closes on Escape key", async ({ page }) => {
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

    test("Closes on backdrop click", async ({ page }) => {
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

    test("Focus trap cycles within drawer", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      
      // Wait for drawer to open and focus to be set
      await page.waitForTimeout(500);
      
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

    test("Body scroll lock when open", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      
      // Wait for drawer to open
      await page.waitForTimeout(500);
      
      const isLocked = await page.evaluate(
        () => document.body.style.overflow === "hidden",
      );
      expect(isLocked).toBe(true);
    });

    test("Body scroll restored when closed", async ({ page }) => {
      // Open drawer
      await page.locator("#mobile-menu-button").click();
      
      // Wait for drawer to open
      await page.waitForTimeout(500);
      
      // Close drawer with Escape
      await page.keyboard.press("Escape");
      
      // Wait for close animation to complete
      await page.waitForTimeout(500);
      
      // Verify body scroll is restored
      const isRestored = await page.evaluate(
        () => document.body.style.overflow === "" || document.body.style.overflow === "visible",
      );
      expect(isRestored).toBe(true);
    });
  });

  /**
   * Test Suite: Accessibility
   * Validates ARIA attributes and keyboard navigation.
   */
  test.describe("Accessibility", () => {
    test("Hamburger ARIA attributes", async ({ page }) => {
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

    test("Drawer ARIA attributes", async ({ page }) => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      const drawer = page.locator('[data-testid="mobile-drawer"]');
      await expect(drawer).toHaveAttribute("role", "dialog");
      await expect(drawer).toHaveAttribute("aria-modal", "true");
      await expect(drawer).toHaveAttribute("aria-hidden", "true");

      await page.locator("#mobile-menu-button").click();
      await expect(drawer).toHaveAttribute("aria-hidden", "false", { timeout: 5000 });
    });
  });

  /**
   * Test Suite: Visual Effects
   * Validates backdrop blur and glass effects.
   */
  test.describe("Visual Regression", () => {
    test("Header glass effect at all widths", async ({ page }) => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");

      // Use specific header selector
      const header = page.locator("#main-header");
      const backdropFilter = await header.evaluate(
        (el) => window.getComputedStyle(el).backdropFilter,
      );
      expect(backdropFilter).toContain("blur");

      await page.setViewportSize(viewports.wide);
      await page.reload();

      const headerWide = page.locator("#main-header");
      const backdropFilterWide = await headerWide.evaluate(
        (el) => window.getComputedStyle(el).backdropFilter,
      );
      expect(backdropFilterWide).toContain("blur");
    });

    test("Drawer glass effect when open", async ({ page }) => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
      await page.locator("#mobile-menu-button").click();

      const drawerPanel = page.locator("#drawer-panel");
      const styles = await drawerPanel.evaluate((el) => ({
        backdropFilter: window.getComputedStyle(el).backdropFilter,
        backgroundColor: window.getComputedStyle(el).backgroundColor,
      }));
      expect(styles.backdropFilter).toContain("blur");
      expect(styles.backgroundColor).toContain("rgba");
    });
  });

  /**
   * Test Suite: CTA Persistence
   * Validates that CTA buttons appear in correct locations at all viewports.
   */
  test.describe("CTA Persistence", () => {
    test("CTA visible at all widths", async ({ page }) => {
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

    test("CTA appears once in header, once in drawer when open", async ({
      page,
    }) => {
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
      await page.waitForTimeout(500);

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