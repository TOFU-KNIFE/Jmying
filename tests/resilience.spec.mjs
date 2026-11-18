import { createHash } from "node:crypto";

import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test.describe("mobile first-visit resilience", () => {
  test("cold visit remains styled, readable and within the viewport", async ({
    page,
  }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".hero")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(pageErrors).toEqual([]);
  });

  test("inline production CSS survives a blocked external stylesheet", async ({
    page,
  }) => {
    await page.route("**/styles.css*", (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1")).toBeVisible();
    const layout = await page.evaluate(() => {
      const header = document.querySelector(".site-header");
      const hero = document.querySelector(".hero");
      const heading = document.querySelector("h1");
      return {
        headerHeight: header?.getBoundingClientRect().height || 0,
        heroHeight: hero?.getBoundingClientRect().height || 0,
        headingSize: Number.parseFloat(getComputedStyle(heading).fontSize),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(layout.headerHeight).toBeGreaterThan(50);
    expect(layout.heroHeight).toBeGreaterThan(300);
    expect(layout.headingSize).toBeGreaterThan(40);
    expect(layout.overflow).toBe(false);
  });

  test("failed AVIF requests move to a working picture fallback", async ({
    page,
  }) => {
    await page.route(/\.avif(?:\?|$)/, (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const heroImage = page.locator(".hero-backdrop img");
    await expect
      .poll(() => heroImage.evaluate((image) => image.currentSrc || image.src))
      .not.toMatch(/\.avif(?:\?|$)/);
    await expect
      .poll(() => heroImage.evaluate((image) => image.naturalWidth))
      .toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

  test("failed AVIF and WebP requests reach the JPEG img fallback", async ({
    page,
  }) => {
    await page.route(/\.(?:avif|webp)(?:\?|$)/, (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const heroImage = page.locator(".hero-backdrop img");
    await expect
      .poll(() => heroImage.evaluate((image) => image.currentSrc || image.src))
      .toMatch(/\.jpe?g(?:\?|$)/);
    await expect
      .poll(() => heroImage.evaluate((image) => image.naturalWidth))
      .toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

  test("failed image requests keep reserved slots without overflow", async ({
    page,
  }) => {
    await page.route(/\.(?:avif|webp|jpe?g)(?:\?|$)/, (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });

    for (const picture of await page.locator("picture").all()) {
      await picture.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(250);

    const metrics = await page.evaluate(() => {
      const selectors = [
        ".hero-backdrop",
        ".yearbook-portrait",
        ".highlight-card-backdrop",
        ".connect-backdrop",
      ];
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        failedPictures: document.querySelectorAll("picture.image-failed")
          .length,
        boxes: selectors.map((selector) => {
          const rect = document
            .querySelector(selector)
            ?.getBoundingClientRect();
          return { width: rect?.width || 0, height: rect?.height || 0 };
        }),
      };
    });

    expect(metrics.overflow).toBe(false);
    expect(metrics.failedPictures).toBeGreaterThan(0);
    expect(
      metrics.boxes.every(({ width, height }) => width <= 390 && height > 0),
    ).toBe(true);
  });

  test("content and anchor navigation remain usable when JavaScript is blocked", async ({
    page,
  }) => {
    await page.route(/\/app(?:\.[a-f0-9]+)?\.js(?:\?|$)/, (route) =>
      route.abort(),
    );
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".primary-nav")).toBeVisible();
    await expect(page.locator("[data-nav-link]")).toHaveCount(5);
    await page.locator('.primary-nav a[href="#profile"]').click();
    await expect(page).toHaveURL(/#profile$/);
    await expect(page.locator("#profile")).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

  test("keyboard reaches the expanded menu and follows a section link", async ({
    page,
  }) => {
    await page.goto("/");
    const menu = page.locator("#menuTrigger");
    const profile = page.locator('#primaryNav a[href="#profile"]');
    await menu.focus();
    await page.keyboard.press("Enter");
    await expect(profile).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(
      page.locator('#primaryNav a[href="#experience"]'),
    ).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#profile$/);
    await expect(page.locator("#profile")).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(profile).toHaveAttribute("aria-current", "location");
  });

  test("study renders its preview with the script blocked and skips motion assets", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const requests = [];
    page.on("request", (request) => {
      if (/sticker-(?:start|motion)/.test(request.url()))
        requests.push(request.url());
    });
    await page.route(/\/app(?:\.[a-f0-9]+)?\.js(?:\?|$)/, (route) =>
      route.abort(),
    );
    await page.goto("/");
    const preview = page.locator(".sticker-static");
    await preview.scrollIntoViewIfNeeded();
    await expect
      .poll(() => preview.evaluate((img) => img.naturalWidth))
      .toBeGreaterThan(0);
    await expect(preview).toHaveCSS("opacity", "1");
    await expect(page.locator("[data-sticker-play]")).toBeHidden();
    expect(requests).toEqual([]);
  });

  test("CSP authorizes the exact inline stylesheet without unsafe inline code", async ({
    page,
  }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    const csp = response.headers()["content-security-policy"] || "";
    const inlineStyle = await page.locator("style").textContent();
    const styleHash = createHash("sha256")
      .update(inlineStyle || "")
      .digest("base64");

    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toContain("'unsafe-inline'");
    expect(csp).toContain(`'sha256-${styleHash}'`);
    expect(await page.locator("style")).toHaveCount(1);
  });
});
