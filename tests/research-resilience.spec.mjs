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
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#research-tab-2")).toBeFocused();
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

test("tab icon offers a vector and a white rounded PNG fallback", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.locator('link[rel="icon"][type="image/svg+xml"]'),
  ).toHaveAttribute("href", /\/favicon\.svg\?h=[a-f0-9]{64}/);
  const icon = await request.get("/favicon.svg");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
  const pixels = await page.evaluate(async () => {
    const blob = await (await fetch("/favicon-32.png")).blob();
    const image = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return {
      corner: [...ctx.getImageData(0, 0, 1, 1).data],
      backing: [...ctx.getImageData(16, 1, 1, 1).data],
    };
  });
  expect(pixels.corner[3]).toBe(0);
  expect(pixels.backing).toEqual([255, 255, 255, 255]);
});
