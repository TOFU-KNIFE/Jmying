import { test, expect } from "@playwright/test";

test("reduced motion keeps reveal content visible and shows the static study preview", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const motionRequests = [];
  page.on("request", (request) => {
    if (request.url().includes(".mp4")) motionRequests.push(request.url());
  });
  await page.goto("/");

  const belowFoldCard = page.locator(".highlight-card").nth(3);
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  await expect(belowFoldCard).toHaveAttribute("data-reveal", "");
  await expect(belowFoldCard).toHaveCSS("opacity", "1");
  await expect(belowFoldCard).toHaveCSS("transform", "none");

  const sticker = page.locator("[data-sticker-module]");
  await sticker.scrollIntoViewIfNeeded();
  await expect(page.locator("[data-sticker-play]")).toBeDisabled();
  await expect(page.locator(".sticker-static")).toBeVisible();
  await expect(page.locator(".sticker-video")).not.toHaveAttribute("src", /.+/);
  expect(motionRequests).toEqual([]);
});

test("motion-enabled reveal marks content visible when it enters the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const belowFoldCard = page.locator(".highlight-card").nth(3);
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await expect(belowFoldCard).toHaveAttribute("data-reveal", "");
  await expect(belowFoldCard).not.toHaveClass(/is-visible/);
  await belowFoldCard.scrollIntoViewIfNeeded();
  await expect(belowFoldCard).toHaveClass(/is-visible/);
  await expect(belowFoldCard).toHaveCSS("opacity", "1");
});

test("enabling reduced motion reveals pending content immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const belowFoldCard = page.locator(".highlight-card").nth(3);
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  await expect(belowFoldCard).toHaveCSS("opacity", "1");
  await expect(belowFoldCard).toHaveCSS("transform", "none");
});

test("reduced motion remains usable in high contrast and forced colors", async ({
  page,
}) => {
  await page.emulateMedia({
    reducedMotion: "reduce",
    contrast: "more",
    forcedColors: "active",
    colorScheme: "light",
  });
  await page.goto("/");

  expect(
    await page.evaluate(() => ({
      contrast: window.matchMedia("(prefers-contrast: more)").matches,
      forcedColors: window.matchMedia("(forced-colors: active)").matches,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
    })),
  ).toEqual({ contrast: true, forcedColors: true, reducedMotion: true });
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  await expect(page.locator(".highlight-card").nth(3)).toHaveCSS(
    "opacity",
    "1",
  );

  const sticker = page.locator("[data-sticker-module]");
  await sticker.scrollIntoViewIfNeeded();
  await expect(page.locator("[data-sticker-play]")).toBeDisabled();
  await expect(page.locator(".sticker-static")).toBeVisible();

  await page.locator("#languageTrigger").click();
  await expect(page.locator("#closeLanguage")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#languageTrigger")).toBeFocused();
});

test("language dialog keeps keyboard focus inside and restores its trigger", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.locator("#languageTrigger");
  const close = page.locator("#closeLanguage");
  const options = page.locator("[data-language]");

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(options).toHaveCount(14);
  await expect(close).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(options.first()).toBeFocused();
  for (let index = 1; index < 14; index += 1) {
    await page.keyboard.press("Tab");
  }
  await expect(options.last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(options.last()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("highlight dialog keeps keyboard focus on its close control and restores the opener", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.locator("[data-highlight-learn]").first();
  const dialog = page.locator("#highlightDialog");
  const close = page.locator("#closeHighlight");

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

for (const [locale, direction, forwardKey, backKey] of [
  ["en", "ltr", "ArrowRight", "ArrowLeft"],
  ["ar", "rtl", "ArrowLeft", "ArrowRight"],
]) {
  test(`${locale} carousel responds to keyboard direction`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(
      (value) => localStorage.setItem("jmying-language", value),
      locale,
    );
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("dir", direction);

    const track = page.locator("#highlightTrack");
    await track.scrollIntoViewIfNeeded();
    await track.focus();
    const initialScroll = await track.evaluate((node) =>
      Math.abs(node.scrollLeft),
    );
    await page.keyboard.press(forwardKey);
    await expect
      .poll(() => track.evaluate((node) => Math.abs(node.scrollLeft)))
      .toBeGreaterThan(initialScroll + 10);
    await page.keyboard.press(backKey);
    await expect
      .poll(() => track.evaluate((node) => Math.abs(node.scrollLeft)))
      .toBeLessThan(initialScroll + 2);
  });
}

test("study motion stop and replay controls keep state feedback in sync", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const { load, play } = HTMLMediaElement.prototype;
    HTMLMediaElement.prototype.load = function () {
      if (!this.matches(".sticker-video")) return load.call(this);
    };
    HTMLMediaElement.prototype.play = function () {
      if (this.matches(".sticker-video")) return Promise.resolve();
      return play.call(this);
    };
  });
  await page.goto("/");

  const sticker = page.locator("[data-sticker-module]");
  const button = page.locator("[data-sticker-play]");
  const label = page.locator("[data-sticker-label]");
  const video = page.locator(".sticker-video");
  await sticker.scrollIntoViewIfNeeded();
  await expect
    .poll(() => sticker.getAttribute("data-sticker-state"))
    .toMatch(/^(ready|playing)$/);

  await page.evaluate(() => {
    const sticker = document.querySelector("[data-sticker-module]");
    if (sticker?.dataset.stickerState === "ready") {
      document.querySelector("[data-sticker-play]")?.click();
    }
  });
  await expect(sticker).toHaveAttribute("data-sticker-state", "playing");
  await expect(label).toHaveText("Stop motion");

  await button.click();
  await expect(sticker).toHaveAttribute("data-sticker-state", "stopped");
  await expect(label).toHaveText("Play motion");

  await button.click();
  await expect(sticker).toHaveAttribute("data-sticker-state", "playing");
  await video.evaluate((node) => node.dispatchEvent(new Event("ended")));
  await expect(sticker).toHaveAttribute("data-sticker-state", "complete");
  await expect(label).toHaveText("Replay");

  await button.click();
  await expect(sticker).toHaveAttribute("data-sticker-state", "playing");
});

for (const [label, connection] of [
  ["save-data", { saveData: true, effectiveType: "4g" }],
  ["2g", { saveData: false, effectiveType: "2g" }],
]) {
  test(`${label} connection uses the static study preview without media`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript((value) => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value,
      });
    }, connection);
    const motionRequests = [];
    page.on("request", (request) => {
      if (request.url().includes(".mp4")) motionRequests.push(request.url());
    });
    await page.goto("/");

    const sticker = page.locator("[data-sticker-module]");
    await sticker.scrollIntoViewIfNeeded();
    await expect(page.locator("[data-sticker-play]")).toBeDisabled();
    await expect(sticker).toHaveAttribute("data-sticker-state", "static");
    await expect(page.locator(".sticker-static")).toBeVisible();
    await expect(page.locator(".sticker-video")).not.toHaveAttribute(
      "src",
      /.+/,
    );
    expect(motionRequests).toEqual([]);
  });
}

test("connection changes to 2g stop requested study media", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const connection = new EventTarget();
    connection.saveData = false;
    connection.effectiveType = "4g";
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: connection,
    });
    window.setConnectionType = (effectiveType) => {
      connection.effectiveType = effectiveType;
      connection.dispatchEvent(new Event("change"));
    };
  });
  await page.goto("/");

  const sticker = page.locator("[data-sticker-module]");
  const video = page.locator(".sticker-video");
  await sticker.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("src", /\.mp4/);
  await page.evaluate(() => window.setConnectionType("2g"));
  await expect(page.locator("[data-sticker-play]")).toBeDisabled();
  await expect(sticker).toHaveAttribute("data-sticker-state", "static");
  await expect(video).not.toHaveAttribute("src", /.+/);
});
