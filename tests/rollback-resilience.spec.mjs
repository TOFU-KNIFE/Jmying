import { test, expect } from "@playwright/test";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

test("the retired archive worker restores the profile without clearing unrelated data", async ({
  browser,
}) => {
  const retirement = await readFile("public/sw.js", "utf8");
  let restored = false;
  const oldWorker = `
    self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
    self.addEventListener('activate', event => event.waitUntil((async () => {
      const cache = await caches.open('rhine-lab:/:old-archive');
      await cache.put(new URL('/', self.location).href, new Response('<h1>Cached archive</h1>', {headers: {'Content-Type': 'text/html'}}));
      await self.clients.claim();
    })()));
    self.addEventListener('fetch', event => {
      if (event.request.mode === 'navigate') event.respondWith(caches.match(new URL('/', self.location).href));
    });`;
  const server = createServer((req, res) => {
    if (req.url.startsWith("/sw.js")) {
      res.writeHead(200, {
        "Content-Type": "text/javascript",
        "Cache-Control": "no-store",
        "Content-Security-Policy":
          "default-src 'none'; script-src 'self'; connect-src 'self'; worker-src 'none'",
      });
      res.end(restored ? retirement : oldWorker);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h1>${restored ? "Restored profile" : "Original visit"}</h1>`);
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    const origin = `http://127.0.0.1:${server.address().port}`;
    await page.goto(`${origin}/?scene=archive#profile`);
    await page.evaluate(() => navigator.serviceWorker.register("/sw.js"));
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    await page.evaluate(async () => {
      await caches.open("unrelated-data");
      localStorage.setItem("rhine-saved", '["X-001"]');
    });
    await page.reload();
    await expect(page.locator("h1")).toHaveText("Cached archive");
    restored = true;
    await page.evaluate(async () =>
      (await navigator.serviceWorker.getRegistration()).update(),
    );
    await expect(page.locator("h1")).toHaveText("Restored profile");
    await expect
      .poll(() =>
        page.evaluate(
          async () => (await navigator.serviceWorker.getRegistrations()).length,
        ),
      )
      .toBe(0);
    await page.reload();
    await expect(page.locator("h1")).toHaveText("Restored profile");
    expect(
      await page.evaluate(() => navigator.serviceWorker.controller),
    ).toBeNull();
    expect(await page.evaluate(() => caches.keys())).toEqual([
      "unrelated-data",
    ]);
    expect(await page.evaluate(() => localStorage.getItem("rhine-saved"))).toBe(
      '["X-001"]',
    );
    expect(page.url()).toBe(`${origin}/?scene=archive&v=1.15.5#profile`);
  } catch (error) {
    console.info(
      "Retirement state",
      await context.pages()[0].evaluate(async () => ({
        caches: await caches.keys(),
        registrations: await Promise.all(
          (await navigator.serviceWorker.getRegistrations()).map((r) => ({
            active: r.active?.state,
            waiting: r.waiting?.state,
            installing: r.installing?.state,
          })),
        ),
        controller: navigator.serviceWorker.controller?.state,
      })),
    );
    throw error;
  } finally {
    await context.close();
    await new Promise((resolve) => server.close(resolve));
  }
});
