import { test, expect } from "@playwright/test";

test.describe("Header Component - Production Validation", () => {

  const viewports = {
    wide: { width: 1280, height: 900 },
    narrow: { width: 390, height: 844 },
    breakpointExact: { width: 1020, height: 900 },
    breakpointMinusOne: { width: 1019, height: 900 },
  };

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

  test.describe("Mobile Drawer", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.narrow);
      await page.goto("/");
    });

    test("Opens with backdrop blur", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open");

      const backdrop = page.locator("#drawer-backdrop");
      await expect(backdrop).toBeVisible();
      const backdropFilter = await backdrop.evaluate(
        (el) => window.getComputedStyle(el).backdropFilter,
      );
      expect(backdropFilter).toContain("blur");
    });

    test("Contains navigation and footer links", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      const navLinks = page.locator("#mobile-drawer nav a");
      await expect(navLinks).toHaveCount(4);
      await expect(
        page.locator('#mobile-drawer a:text-is("Contact")'),
      ).toBeVisible();
    });

    test("Closes on Escape key", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open");
      await page.keyboard.press("Escape");
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "closed");
    });

    test("Closes on backdrop click", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "open");
      await page.locator("#drawer-backdrop").dispatchEvent("click");
      await expect(
        page.locator('[data-testid="mobile-drawer"]'),
      ).toHaveAttribute("data-state", "closed");
    });

    test("Focus trap cycles within drawer", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      const closeButton = page.locator("#drawer-close-button");
      await expect(closeButton).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(page.locator("#mobile-drawer nav a").first()).toBeFocused();

      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      await expect(closeButton).toBeFocused();
    });

    test("Body scroll lock when open", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      const isLocked = await page.evaluate(
        () => document.body.style.overflow === "hidden",
      );
      expect(isLocked).toBe(true);
    });

    test("Body scroll restored when closed", async ({ page }) => {
      await page.locator("#mobile-menu-button").click();
      await page.keyboard.press("Escape");
      const isRestored = await page.evaluate(
        () => document.body.style.overflow === "",
      );
      expect(isRestored).toBe(true);
    });
  });

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
      await expect(drawer).toHaveAttribute("aria-hidden", "false");
    });
  });

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
