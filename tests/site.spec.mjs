import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const locales = {
  en: "en",
  de: "de",
  "zh-CN": "zh-Hans",
  ja: "ja",
  th: "th",
  ar: "ar",
};
for (const width of [1440, 820, 390, 320]) {
  for (const [locale, lang] of Object.entries(locales)) {
    test(`${width}px ${locale}: readable, accessible and navigable`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem("jmying-language", value),
        locale,
      );
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("html")).not.toHaveAttribute(
        "aria-busy",
        "true",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".linkedin-cta").first()).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/jmying/",
      );
      await page.locator("#languageTrigger").click();
      await expect(page.locator("[data-language]")).toHaveCount(14);
      await expect(page.locator("#closeLanguage")).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(page.locator("[data-language]").last()).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(page.locator("#languageTrigger")).toBeFocused();
      if (width <= 820) {
        await page.locator("#menuTrigger").click();
        await expect(page.locator("#primaryNav")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator("#menuTrigger")).toHaveAttribute(
          "aria-expanded",
          "false",
        );
      }
      await page.locator("[data-highlight-learn]").first().click();
      await expect(page.locator("#highlightDialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(
        page.locator("[data-highlight-learn]").first(),
      ).toBeFocused();
      await page.locator("[data-sticker-module]").scrollIntoViewIfNeeded();
      await expect(page.locator(".sticker-video")).not.toHaveAttribute(
        "src",
        /.+/,
      );
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(accessibility.violations).toEqual([]);
      expect(errors).toEqual([]);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: testInfo.outputPath("page.png"),
        fullPage: false,
      });
    });
  }
}

test("failed language load preserves current locale and can be retried", async ({
  page,
}) => {
  await page.goto("/");
  await page.route("**/locales/de.json*", (route) => route.abort());
  await page.locator("#languageTrigger").click();
  await page.locator('[data-language="de"]').click();
  await expect(page.locator("#toast")).toContainText("Could not load");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#languageTrigger")).toBeEnabled();
  await page.unroute("**/locales/de.json*");
  await page.locator('[data-language="de"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
});

test("closing the language dialog cancels a late language change", async ({
  page,
}) => {
  await page.goto("/");
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("**/locales/de.json*", async (route) => {
    await gate;
    await route.continue().catch(() => {});
  });
  await page.locator("#languageTrigger").click();
  const request = page.waitForRequest("**/locales/de.json*");
  await page.locator('[data-language="de"]').click();
  await request;
  await page.keyboard.press("Escape");
  release();
  await expect(page.locator("#languageTrigger")).toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute("aria-busy", "true");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.locator("#languageTrigger").click();
  await page.locator('[data-language="ja"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

test("stalled locale requests time out and restore controls", async ({
  page,
}) => {
  await page.goto("/");
  await page.clock.install();
  await page.route("**/locales/de.json*", () => {});
  await page.locator("#languageTrigger").click();
  const request = page.waitForRequest("**/locales/de.json*");
  await page.locator('[data-language="de"]').click();
  await request;
  await page.clock.fastForward(8001);
  await expect(page.locator("#languageTrigger")).toBeEnabled();
  await expect(page.locator("#toast")).toContainText("Could not load");
});

test("unknown navigation and asset paths return real 404 responses", async ({
  page,
  request,
}) => {
  for (const path of ["/not-a-page", "/public/", "/dist/"]) {
    const response = await page.goto(path);
    expect(response.status()).toBe(404);
  }
  expect((await request.get("/locales/missing.json")).status()).toBe(404);
  const response = await request.get("/");
  expect(response.headers()["content-security-policy"]).toContain(
    "default-src 'none'",
  );
  expect(response.headers()["cache-control"]).toContain("no-transform");
});

for (const mode of ["dark", "contrast", "forced-colors"]) {
  test(`${mode}: content and controls remain accessible`, async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: "reduce",
      colorScheme: mode === "dark" ? "dark" : "light",
      contrast: mode === "contrast" ? "more" : "no-preference",
      forcedColors: mode === "forced-colors" ? "active" : "none",
    });
    await page.goto("/");
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.locator("#languageTrigger").click();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}

test("turning on reduced motion detaches a previously requested video", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator("[data-sticker-module]").scrollIntoViewIfNeeded();
  await expect(page.locator(".sticker-video")).toHaveAttribute("src", /\.mp4/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".sticker-video")).not.toHaveAttribute("src", /.+/);
  await expect(page.locator("[data-sticker-module]")).toHaveAttribute(
    "data-sticker-state",
    "static",
  );
});

test("all 14 languages switch, persist and recover the English fallback", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#languageTrigger").click();
  const ids = await page
    .locator("[data-language]")
    .evaluateAll((nodes) => nodes.map((node) => node.dataset.language));
  await page.keyboard.press("Escape");
  for (const locale of ids.filter((id) => id !== "en").concat("en")) {
    await page.locator("#languageTrigger").click();
    await page.locator(`[data-language="${locale}"]`).click();
    await expect(page.locator("#languageDialog")).toBeHidden();
    expect(
      await page.evaluate(() => localStorage.getItem("jmying-language")),
    ).toBe(locale);
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      locale === "ar" ? "rtl" : "ltr",
    );
    await expect(
      page.locator("[data-evidence-detail-description]"),
    ).not.toBeEmpty();
  }
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("failed startup locale keeps the English page and selector consistent", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("jmying-language", "ar"));
  await page.route("**/locales/ar.json*", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("#toast")).toContainText("Could not load");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.locator("#languageTrigger").click();
  await expect(page.locator('[data-language="en"]')).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.locator("#languageCode")).toHaveText("EN");
});

test("saving data never requests motion media", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
    }),
  );
  const media = [];
  page.on("request", (request) => {
    if (request.url().includes(".mp4")) media.push(request.url());
  });
  await page.goto("/");
  await page.locator("[data-sticker-module]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-sticker-play]")).toBeDisabled();
  expect(media).toEqual([]);
});

test("latest resume facts, dates and ongoing activities remain accurate", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('[data-i18n="availability"]')).toHaveText(
    "Compulsory 10-week internship · 25 Jan–2 Apr 2027",
  );
  await expect(
    page.locator('#experience [data-i18n="educationDesc"]'),
  ).toContainText("3.5 / 4.00");
  await expect(
    page.locator('#experience [data-i18n="educationDesc"]'),
  ).toContainText("Dean’s List Award in multiple semesters.");
  await expect(page.locator('#experience h3[data-i18n="exp2Role"]')).toHaveText(
    "Account Assistant (Part-time)",
  );
  await expect(page.locator('[data-i18n="exp2Desc"]')).toContainText(
    "tracked expenses against budgets",
  );
  await expect(
    page.locator('[data-description-key="educationDesc"] time'),
  ).toHaveAttribute("data-date-start", "2024-09");
  await expect(
    page.locator('[data-description-key="educationDesc"] time'),
  ).toContainText("Sep");
  await expect(page.locator("#research")).toContainText("YTL and IJM");
  await expect(page.locator(".hero-statement")).toContainText(
    "payment records",
  );
  await expect(page.locator(".toolkit-strip")).toContainText("Tableau");
  await expect(page.locator(".resume-leadership .timeline-item")).toHaveCount(
    3,
  );
  await expect(page.locator(".resume-leadership time").first()).toContainText(
    "Sep",
  );
  await expect(page.locator(".credential-list li")).toHaveCount(10);
  await expect(page.locator(".credential-list")).toContainText(
    "Bloomberg Spreadsheet Analysis",
  );
  await expect(page.locator(".credential-list")).toContainText(
    "Gemini Certified University Student",
  );
  await expect(page.locator(".highlight-card")).toHaveCount(7);
  await expect(page.locator('[data-i18n="highlight6Label"]')).toHaveText(
    "Ongoing · Virtual portfolio",
  );
  await expect(page.locator('[data-i18n="highlight7Label"]')).toHaveText(
    "Ongoing · Student team",
  );
  await page.locator("[data-highlight-learn]").first().click();
  await expect(page.locator("#highlightDialogTitle")).toHaveText(
    "Deloitte Tax Challenge",
  );
  await expect(page.locator("#highlightDialogMeta")).toContainText("2026");
  await expect(page.locator("#highlightDialogLabel")).toHaveText(
    "Individual semi-finalist",
  );
});

test("evidence filters update the selected detail and carousel works in RTL", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem("jmying-language", "ar"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.locator('[data-evidence-filter="education"]').click();
  await expect(page.locator("[data-evidence-item]:visible")).toHaveCount(1);
  await expect(page.locator("[data-evidence-item]:visible")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("#highlightTrack").scrollIntoViewIfNeeded();
  await page.locator("[data-highlight-next]").click();
  await expect
    .poll(() =>
      page.locator("#highlightTrack").evaluate((node) => node.scrollLeft),
    )
    .toBeLessThan(-10);
  await page.locator("[data-highlight-previous]").click();
  await expect
    .poll(() =>
      page
        .locator("#highlightTrack")
        .evaluate((node) => Math.abs(node.scrollLeft)),
    )
    .toBeLessThan(2);
});
