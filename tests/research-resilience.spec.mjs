import { test, expect } from "@playwright/test";

test("research steps support pointer selection, command entry and error recovery", async ({
  page,
}) => {
  await page.goto("/#research");
  const tabs = page.locator('[role="tab"][data-research-step]');
  for (let i = 0; i < 6; i++) {
    await tabs.nth(i).click();
    await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".research-panel:visible")).toHaveCount(1);
    await expect(page.locator(`#research-panel-${i + 1}`)).toBeVisible();
  }
  const command = page.locator("#researchCommand");
  await command.fill(" gp ");
  await command.press("Enter");
  await expect(page.locator("#research-panel-4")).toBeFocused();
  await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
  await command.fill("UNKNOWN");
  await command.press("Enter");
  await expect(command).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#researchFeedback")).not.toBeEmpty();
  await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
  await command.fill("6");
  await expect(command).not.toHaveAttribute("aria-invalid");
  await command.press("Enter");
  await expect(page.locator("#research-panel-6")).toBeFocused();
  await expect(page.locator("#researchFeedback")).toBeEmpty();
});

test("research keyboard order and active panel survive language changes", async ({
  page,
}) => {
  await page.goto("/#research");
  const first = page.locator("#research-tab-1");
  await first.focus();
  const compact = await page.evaluate(
    () => matchMedia("(max-width: 700px)").matches,
  );
  await page.keyboard.press("ArrowDown");
  await expect(
    page.locator(compact ? "#research-tab-3" : "#research-tab-2"),
  ).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(first).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.locator("#research-tab-6")).toBeFocused();
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
  await page.locator("#research-tab-4").click();
  await page.locator("#languageTrigger").click();
  await page.locator('[data-language="ar"]').click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("#research-tab-4")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#research-panel-title-4")).not.toHaveText(
    "Price trend",
  );
  await page.locator("#research-tab-4").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#research-tab-5")).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#research-tab-4")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#research-panel-4")).toBeFocused();
});

test("research content and native article links work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    ignoreHTTPSErrors: true,
    viewport: { width: 320, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/#research`);
    await expect(page.locator(".research-command")).toBeHidden();
    for (let i = 1; i <= 6; i++)
      await expect(page.locator(`#research-panel-${i}`)).toBeVisible();
    await page.locator("#research-tab-4").click();
    await expect(page).toHaveURL(/#research-panel-4$/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
});

test("research article deep links and history reveal the matching panel", async ({
  page,
}) => {
  await page.goto("/#research-panel-6");
  await expect(page.locator("#research-tab-6")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.reload();
  await expect(page.locator("#research-panel-6")).toBeVisible();
  await page.evaluate(() => {
    location.hash = "research-panel-2";
  });
  await expect(page.locator("#research-panel-2")).toBeFocused();
  await page.goBack();
  await expect(page.locator("#research-tab-6")).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("search and browser tabs use a stable, crawlable brand icon", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.locator('link[rel="icon"][type="image/png"]'),
  ).toHaveAttribute("href", "/favicon.png");
  const icon = await request.get("/favicon.png");
  expect(icon.ok()).toBe(true);
  expect(icon.headers()["content-type"]).toContain("image/png");
  expect(icon.headers()["x-robots-tag"]).toBeUndefined();
  const pixels = await page.evaluate(
    async (bytes) => {
      const blob = new Blob([new Uint8Array(bytes)], { type: "image/png" });
      const image = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      return {
        corner: [...ctx.getImageData(0, 0, 1, 1).data],
        backing: [...ctx.getImageData(48, 2, 1, 1).data],
        dimensions: [image.width, image.height],
      };
    },
    [...(await icon.body())],
  );
  expect(pixels.corner[3]).toBe(0);
  expect(pixels.backing).toEqual([255, 255, 255, 255]);
  expect(pixels.dimensions).toEqual([96, 96]);
});

test("the indexable profile portrait matches the homepage and sitemap", async ({
  page,
  request,
}) => {
  const home = await page.goto("/");
  expect(home.headers()["x-robots-tag"]).toBeUndefined();
  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  expect(robots).not.toMatch(/noindex|noimageindex/);

  const profile = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  );
  const portrait = "https://jmying.com/portrait.jpg";
  expect(profile).toMatchObject({
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Jeremy (Lei) Ying",
      image: portrait,
    },
  });
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    portrait,
  );
  await expect(page.locator(".yearbook-portrait img")).toHaveAttribute(
    "src",
    "/portrait.jpg",
  );
  const responses = await Promise.all([
    request.get("/sitemap.xml"),
    request.get("/portrait.jpg"),
    request.get("/portrait-480.avif"),
    request.get("/hero-photo-1600.jpg"),
  ]);
  const [sitemap, jpeg, responsivePortrait, hero] = responses;
  expect(await sitemap.text()).toContain(`<image:loc>${portrait}</image:loc>`);
  expect(jpeg.ok()).toBe(true);
  expect(jpeg.headers()["content-type"]).toContain("image/jpeg");
  expect(jpeg.headers()["x-robots-tag"]).toBeUndefined();
  expect(responsivePortrait.ok()).toBe(true);
  expect(responsivePortrait.headers()["x-robots-tag"]).toBeUndefined();
  expect(hero.headers()["x-robots-tag"]).toContain("noindex");
});
