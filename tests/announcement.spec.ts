import { test, expect } from "@playwright/test";

test.describe("Announcement Card - Mobile Variant & Persistence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      localStorage.removeItem("announcement-dismissed"),
    );
  });

  test("mobile variant is visible on <768px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const announcement = page.locator("#announcement-card");
    await expect(announcement).toBeVisible();

    const position = await announcement.evaluate(
      (el) => window.getComputedStyle(el).position,
    );
    expect(position).not.toBe("fixed");
  });

  test("desktop variant is fixed on ≥768px", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    const announcement = page.locator("#announcement-card");
    await expect(announcement).toBeVisible();

    const position = await announcement.evaluate(
      (el) => window.getComputedStyle(el).position,
    );
    expect(position).toBe("fixed");
  });

  test("closes when clicking X and persists state", async ({ page }) => {
    await page.goto("/");
    const announcement = page.locator("#announcement-card");
    const closeButton = page.locator("#close-announcement");

    await expect(announcement).toBeVisible();
    await closeButton.click();

    const display = await announcement.evaluate(
      (el) => window.getComputedStyle(el).display,
    );
    expect(display).toBe("none");

    const isDismissed = await page.evaluate(() =>
      localStorage.getItem("announcement-dismissed"),
    );
    expect(isDismissed).toBe("true");
  });

  test("remains hidden on page refresh if previously dismissed", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#close-announcement").click();

    await page.reload();
    const announcement = page.locator("#announcement-card");

    const display = await announcement.evaluate(
      (el) => window.getComputedStyle(el).display,
    );
    expect(display).toBe("none");

    const isDismissed = await page.evaluate(() =>
      localStorage.getItem("announcement-dismissed"),
    );
    expect(isDismissed).toBe("true");
  });

  test("mobile has compact padding (p-4)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const announcement = page.locator("#announcement-card");
    const padding = await announcement.evaluate(
      (el) => window.getComputedStyle(el).padding,
    );
    expect(padding).toBe("16px");
  });

  test("desktop has expanded padding (p-6)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    const announcement = page.locator("#announcement-card");
    const padding = await announcement.evaluate(
      (el) => window.getComputedStyle(el).padding,
    );
    expect(padding).toBe("24px");
  });
});
