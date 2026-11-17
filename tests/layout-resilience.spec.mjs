import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  for (const javaScriptEnabled of [true, false]) {
    test(`home links return to the page start at ${width}px with scripts ${javaScriptEnabled ? "on" : "off"}`, async ({
      browser,
      baseURL,
    }, testInfo) => {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        javaScriptEnabled,
        reducedMotion: "reduce",
        ignoreHTTPSErrors: true,
      });
      try {
        const page = await context.newPage();
        await page.goto(baseURL);
        await page.locator("#research").scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
        await page
          .getByRole("link", { name: "JMYING home", exact: true })
          .click();
        await expect
          .poll(() => page.evaluate(() => scrollY))
          .toBeLessThanOrEqual(1);
        await page.locator(".site-footer").scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
        await page.locator('.site-footer a[href="#top"]').click();
        await expect
          .poll(() => page.evaluate(() => scrollY))
          .toBeLessThanOrEqual(1);
        if (javaScriptEnabled && width === 390) {
          await page.screenshot({
            path: testInfo.outputPath("mobile-home.png"),
            scale: "css",
          });
          await page.locator("#menuTrigger").click();
          await page
            .getByRole("link", { name: "Profile", exact: true })
            .click();
          await page.evaluate(() => document.fonts.ready);
          await page.screenshot({
            path: testInfo.outputPath("mobile-profile.png"),
            scale: "css",
          });
        }
      } finally {
        await context.close();
      }
    });
  }
}
