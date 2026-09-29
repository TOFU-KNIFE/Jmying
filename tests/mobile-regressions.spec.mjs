import { test, expect } from "@playwright/test";

const mobileViewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
];

async function sectionTops(page, ids) {
  return page.evaluate((sectionIds) => {
    const tops = {};
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      tops[id] = section.getBoundingClientRect().top + window.scrollY;
    });
    return tops;
  }, ids);
}

for (const viewport of mobileViewports) {
  test(`cold scrolling preserves later section anchors at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#experience")).toBeAttached();
    await page.evaluate(() => document.fonts.ready);

    const sectionIds = ["approach", "highlights", "credentials", "privacy"];
    const before = await sectionTops(page, sectionIds);
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    const after = await sectionTops(page, sectionIds);

    for (const id of sectionIds) {
      expect(
        Math.abs(after[id] - before[id]),
        `${id} moved by ${Math.abs(after[id] - before[id])}px while cold-scrolling`,
      ).toBeLessThanOrEqual(16);
    }
  });
}

for (const viewport of mobileViewports) {
  test(`RTL highlight dialog keeps long Latin words and close control readable at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(() =>
      localStorage.setItem("jmying-language", "ar"),
    );
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    const opener = page.locator("[data-highlight-learn]").first();
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    const dialog = page.locator("#highlightDialog");
    const title = page.locator("#highlightDialogTitle");
    const close = page.locator("#closeHighlight");
    await expect(dialog).toBeVisible();
    await expect(title).toContainText("Challenge");
    await expect(close).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    const geometry = await page.evaluate(() => {
      const title = document.querySelector("#highlightDialogTitle");
      const close = document.querySelector("#closeHighlight");
      const panel = document.querySelector(".highlight-dialog-panel");
      const titleText = title.firstChild;
      const fullRange = document.createRange();
      fullRange.selectNodeContents(title);
      const textRects = [...fullRange.getClientRects()];
      const challengeStart = titleText.textContent.indexOf("Challenge");
      const challengeRange = document.createRange();
      challengeRange.setStart(titleText, challengeStart);
      challengeRange.setEnd(titleText, challengeStart + "Challenge".length);
      const challengeRects = [...challengeRange.getClientRects()];
      const closeRect = close.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const overlapsClose = textRects.some(
        (textRect) =>
          textRect.bottom > closeRect.top &&
          textRect.top < closeRect.bottom &&
          textRect.right > closeRect.left &&
          textRect.left < closeRect.right,
      );

      return {
        challengeRects: challengeRects.length,
        closeInsidePanel:
          closeRect.left >= panelRect.left &&
          closeRect.right <= panelRect.right &&
          closeRect.top >= panelRect.top &&
          closeRect.bottom <= panelRect.bottom,
        overlapsClose,
        titleInsidePanel: textRects.every(
          (textRect) =>
            textRect.left >= panelRect.left &&
            textRect.right <= panelRect.right,
        ),
      };
    });

    expect(geometry.challengeRects).toBe(1);
    expect(geometry.overlapsClose).toBe(false);
    expect(geometry.titleInsidePanel).toBe(true);
    expect(geometry.closeInsidePanel).toBe(true);
  });
}

for (const viewport of mobileViewports) {
  test(`evidence chart keeps a readable year scale and overflow affordance at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const chartScroll = page.locator(".evidence-chart-scroll");
    await chartScroll.scrollIntoViewIfNeeded();
    await expect(chartScroll).toHaveAttribute("role", "region");
    await expect(chartScroll).toHaveAttribute("tabindex", "0");
    await expect(chartScroll).toHaveAccessibleName(
      "Interactive timeline from 2024 to 2026",
    );
    await chartScroll.focus();
    await expect(chartScroll).toBeFocused();

    const chartMetrics = await chartScroll.evaluate((scroll) => {
      const chart = scroll.querySelector(".evidence-chart");
      const yearLabels = [
        ...scroll.querySelectorAll(".evidence-year-scale span"),
      ].filter((label) => label.textContent.trim());
      const yearRects = yearLabels.map((label) => {
        const rect = label.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      });
      const rowRects = [...scroll.querySelectorAll("[data-evidence-item]")].map(
        (row) => {
          const track = row.querySelector(".evidence-track");
          const range = row.querySelector(".evidence-range");
          const trackRect = track.getBoundingClientRect();
          const rangeRect = range.getBoundingClientRect();
          return {
            rangeWidth: rangeRect.width,
            trackLeft: trackRect.left,
            trackRight: trackRect.right,
          };
        },
      );
      const scrollRect = scroll.getBoundingClientRect();
      const chartRect = chart.getBoundingClientRect();
      const contentRight = Math.max(
        chartRect.right,
        ...rowRects.map((row) => row.trackRight),
      );

      return {
        contentWidth: contentRight - scrollRect.left,
        overflowX: getComputedStyle(scroll).overflowX,
        scrollWidth: scroll.scrollWidth,
        clientWidth: scroll.clientWidth,
        yearTexts: yearLabels.map((label) => label.textContent.trim()),
        yearRects,
        rowRects,
      };
    });

    expect(chartMetrics.yearTexts).toEqual(["2024", "2025", "2026"]);
    expect(chartMetrics.yearRects.every((rect) => rect.width > 0)).toBe(true);
    expect(chartMetrics.rowRects).toHaveLength(3);
    expect(chartMetrics.rowRects.every((row) => row.rangeWidth >= 4)).toBe(
      true,
    );

    const sortedYearRects = [...chartMetrics.yearRects].sort(
      (first, second) => first.left - second.left,
    );
    expect(
      sortedYearRects.every(
        (rect, index) =>
          index === 0 || rect.left >= sortedYearRects[index - 1].right - 1,
      ),
    ).toBe(true);

    const visualOverflow =
      chartMetrics.contentWidth > chartMetrics.clientWidth + 1 ||
      chartMetrics.scrollWidth > chartMetrics.clientWidth + 1;
    if (visualOverflow) {
      expect(["auto", "scroll"]).toContain(chartMetrics.overflowX);
    }
  });
}
