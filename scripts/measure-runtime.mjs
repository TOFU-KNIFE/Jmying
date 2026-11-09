// Run against a production preview with a native GPU; this is not a CI score.
// npm run preview, then: node scripts/measure-runtime.mjs /tmp/measurement.json
import { chromium, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const browser = await chromium.launch({
  channel: "chromium",
  args:
    process.platform === "darwin"
      ? ["--use-angle=metal"]
      : [
          "--use-gl=angle",
          "--use-angle=swiftshader",
          "--enable-unsafe-swiftshader",
        ],
});
const report = {
  runtime: process.version,
  platform: process.platform,
  scenarios: [],
};
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      serviceWorkers: "block",
      reducedMotion: "reduce",
    });
    await page.addInitScript(() =>
      localStorage.setItem(
        "rhine-settings",
        JSON.stringify({
          reduced: true,
          sound: false,
          music: false,
          superPerformance: true,
        }),
      ),
    );
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Performance.enable");
    const sample = async () => {
      const samples = [];
      for (let i = 0; i < 3; i++) {
        const before = await cdp.send("Performance.getMetrics");
        await page.waitForTimeout(2000);
        const after = await cdp.send("Performance.getMetrics");
        samples.push(
          (after.metrics.find((m) => m.name === "TaskDuration").value -
            before.metrics.find((m) => m.name === "TaskDuration").value) *
            1000,
        );
      }
      return {
        taskMsPer2s: samples,
        median: [...samples].sort((a, b) => a - b)[1],
      };
    };
    await page.goto("http://127.0.0.1:4173/?scene=archive");
    await expect(page.locator("#loading")).toHaveCount(0, { timeout: 90000 });
    await page.waitForTimeout(5000);
    const archive = await sample();
    await page.locator(".read-file").click();
    await expect(page.locator("#detail-content h2")).toContainText("JEREMY");
    await page.locator('[data-action="model-viewer"]').click();
    await expect(page.locator(".viewer-loading")).toBeHidden({
      timeout: 90000,
    });
    await page.waitForTimeout(2500);
    const viewer = await sample();
    report.scenarios.push({
      width,
      archive,
      viewer,
      viewerStats: await page
        .locator(".model-viewer")
        .evaluate((node) => JSON.parse(node.dataset.stats)),
    });
    await page.close();
  }
  const metadata = JSON.parse(await readFile("dist/pwa-build.json", "utf8"));
  report.offline = {
    bytes: metadata.bytes,
    requests: metadata.files.length,
    fontRequests: metadata.files.filter((file) => file.endsWith(".woff2"))
      .length,
  };
  report.styles = [];
  for (const file of metadata.files.filter((file) =>
    /^assets\/.*\.css$/.test(file),
  )) {
    const css = await readFile(`dist/${file}`);
    report.styles.push({
      file,
      bytes: css.length,
      gzipBytes: gzipSync(css).length,
    });
  }
  await writeFile(
    process.argv[2] ?? "/tmp/jmying-performance.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
