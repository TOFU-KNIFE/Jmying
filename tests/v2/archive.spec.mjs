import { test, expect } from "@playwright/test";
async function enter(page) {
  console.info("Archive boot: opening document");
  await page.addInitScript(() => {
    localStorage.setItem(
      "rhine-settings",
      JSON.stringify({
        superPerformance: true,
        sound: false,
        music: false,
        reduced: true,
      }),
    );
    // Cover the WebKit startup failure without adding another heavy 3D boot.
    if (innerWidth < 700) {
      document.fonts.load = () => new Promise(() => {});
    }
  });
  await page.goto("/?scene=archive");
  console.info("Archive boot: waiting for model readiness");
  await expect(page.locator("#loading")).toHaveCount(0);
  await expect(page.locator("canvas").first()).toBeVisible();
  console.info("Archive boot: model and canvas ready");
}
test("complete 3D archive journey: search, read, model, save, export, preferences and classic", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await enter(page);
  await expect(page.locator(".brand h1")).toHaveText("JMYING");
  if (!process.env.CI) {
    await page.screenshot({
      path: `qa/rhine/v2-${page.viewportSize().width}.png`,
    });
  }
  await page.locator('[data-action="search"]').click();
  await expect(page.locator("#archive-search")).toBeVisible();
  await page.locator("#archive-search").fill("JEREMY");
  await expect(page.locator("#search-results")).toContainText("Jeremy");
  expect(errors).toEqual([]);
  await page.locator('[data-action="close-modal"]').click();
  console.info("Archive flow: reading and model viewer");
  await page.locator(".read-file").click();
  await expect(page.locator("#detail-content h2")).toContainText("JEREMY");
  await page.locator('[data-tab="notes"]').click();
  await expect(page.locator(".research-notes")).toContainText("个人");
  await page.locator('[data-action="bookmark"]').click();
  await expect(page.locator('[data-action="bookmark"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const href = await page.locator(".export-button").getAttribute("href");
  expect((await page.request.get(href)).status()).toBe(200);
  await page.locator('[data-action="model-viewer"]').click();
  await expect(page.locator('[data-viewer="explode"]')).toBeVisible();
  const viewerStats = () =>
    page
      .locator(".model-viewer")
      .evaluate((node) => JSON.parse(node.dataset.stats ?? "{}"));
  await expect.poll(async () => (await viewerStats()).ready).toBe(true);
  await expect
    .poll(async () => (await viewerStats()).reusedFrames ?? 0)
    .toBeGreaterThan(3);
  const idle = await viewerStats();
  await expect
    .poll(async () => (await viewerStats()).reusedFrames)
    .toBeGreaterThan(idle.reusedFrames + 2);
  expect((await viewerStats()).renderedFrames).toBe(idle.renderedFrames);
  await page.locator('[data-viewer="explode"]').click();
  await expect(page.locator('[data-viewer="explode"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect
    .poll(async () => (await viewerStats()).renderedFrames)
    .toBeGreaterThan(idle.renderedFrames);
  await page.locator('[data-viewer="assemble"]').click();
  await expect(page.locator('[data-viewer="assemble"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator('[data-viewer="close"]').click();
  await page.locator('[data-action="back"]').click();
  await expect(page.locator(".archive-ui")).toBeVisible();
  console.info("Archive flow: preferences and classic profile");
  await page.locator('[data-action="settings"]').click();
  await expect(page.locator(".settings-modal")).toBeVisible();
  await page.locator('[data-action="close-modal"]').click();
  await expect(page.locator(".jmying-links a").first()).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/jeremy-ying-a8520b350/",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  if (page.viewportSize().width < 700) {
    const links = await page.locator(".jmying-links").boundingBox();
    const callout = await page.locator(".archive-callout").boundingBox();
    expect(links.y + links.height).toBeLessThan(callout.y);
  }
  await page.goto("/classic.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#heroTitle")).toContainText("Jeremy");
  await page.locator("#languageTrigger").click();
  await expect(page.locator("[data-language]")).toHaveCount(14);
});
test("without JavaScript the classic profile is reachable", async ({
  browser,
}) => {
  const c = await browser.newContext({ javaScriptEnabled: false });
  const p = await c.newPage();
  await p.goto("/");
  await expect(p.locator("noscript a")).toBeVisible();
  await p.locator("noscript a").click();
  await expect(p.locator("#heroTitle")).toContainText("Jeremy");
  await c.close();
});

test("WebGL failure offers the classic profile", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return String(type).startsWith("webgl")
        ? null
        : original.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await expect(
    page.locator('.error-state a[href="/classic.html"]'),
  ).toBeVisible();
  await page.locator('.error-state a[href="/classic.html"]').click();
  await expect(page.locator("#heroTitle")).toContainText("Jeremy");
});
