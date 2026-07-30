import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");
const distDir = join(root, "dist");
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8"),
);
const html = await readFile(join(publicDir, "index.html"), "utf8");
const app = await readFile(join(publicDir, "app.js"), "utf8");
const styles = await readFile(join(publicDir, "styles.css"), "utf8");
const headers = await readFile(join(publicDir, "_headers"), "utf8");
const llms = await readFile(join(publicDir, "llms.txt"), "utf8");
const findings = [];

const sourceBudgets = new Map([
  ["index.html", 40 * 1024],
  ["styles.css", 64 * 1024],
  ["app.js", 32 * 1024],
]);

for (const [filename, limit] of sourceBudgets) {
  const info = await stat(join(publicDir, filename));
  if (info.size > limit) {
    findings.push(
      `${filename} is ${Math.ceil(info.size / 1024)} KiB; source budget is ${Math.ceil(limit / 1024)} KiB`,
    );
  }
}

const productionBudgets = new Map([
  ["index.html", 30 * 1024],
  ["styles.css", 50 * 1024],
  ["app.js", 20 * 1024],
]);

for (const [filename, limit] of productionBudgets) {
  const info = await stat(join(distDir, filename));
  if (info.size > limit) {
    findings.push(
      `production ${filename} is ${Math.ceil(info.size / 1024)} KiB; delivery budget is ${Math.ceil(limit / 1024)} KiB`,
    );
  }
}

const productionHtml = await readFile(join(distDir, "index.html"), "utf8");
if (!productionHtml.includes(`src="/app.js?v=${packageJson.version}"`)) {
  findings.push("production HTML is missing its versioned application script");
}

const imageBudgets = new Map([
  ["hero-photo-800.avif", 25 * 1024],
  ["hero-photo-1200.avif", 45 * 1024],
  ["hero-photo-1400.avif", 55 * 1024],
  ["hero-photo-1600.avif", 70 * 1024],
  ["portrait-320.avif", 10 * 1024],
  ["portrait-480.avif", 16 * 1024],
  ["approach-800.avif", 10 * 1024],
  ["lake-800.avif", 30 * 1024],
]);

for (const [filename, limit] of imageBudgets) {
  const info = await stat(join(publicDir, filename));
  if (info.size > limit) {
    findings.push(
      `${filename} is ${Math.ceil(info.size / 1024)} KiB; delivery budget is ${Math.ceil(limit / 1024)} KiB`,
    );
  }
}

const imageUrls = [
  ...html.matchAll(
    /(?:https:\/\/jmying\.com)?\/[^"'\s,]+\.(?:avif|webp|jpe?g)(?:\?v=[^"'\s,]+)?/g,
  ),
].map(([url]) => url);
for (const url of imageUrls) {
  if (!url.includes(`?v=${packageJson.version}`)) {
    findings.push(`${url} is not revisioned for immutable caching`);
  }
}

const imageTags = [...html.matchAll(/<img\b[\s\S]*?>/g)].map(([tag]) => tag);
for (const tag of imageTags) {
  const src = tag.match(/\bsrc="([^"]+)"/)?.[1] || "unknown image";
  if (src.includes("hero-photo")) {
    if (!/\bloading="eager"/.test(tag) || !/\bfetchpriority="high"/.test(tag)) {
      findings.push("the hero image must load eagerly at high priority");
    }
    continue;
  }
  if (!/\bloading="lazy"/.test(tag) || !/\bfetchpriority="low"/.test(tag)) {
    findings.push(`${src} must lazy-load at low priority`);
  }
}

for (const requirement of [
  [html.includes('type="image/avif"'), "AVIF picture sources are missing"],
  [
    html.includes("(max-width: 820px) min(38vw, 280px), 270px"),
    "the portrait sizes hint does not match its responsive grid",
  ],
  [
    styles.includes("content-visibility: auto") &&
      styles.includes("contain-intrinsic-size: auto 900px"),
    "offscreen section rendering is not deferred",
  ],
  [
    app.includes('{ rootMargin: "480px 0px", threshold: 0 }'),
    "carousel geometry is not deferred until near the viewport",
  ],
  [
    headers.includes(
      "Cache-Control: public, max-age=0, must-revalidate, no-transform",
    ),
    "HTML responses do not prevent edge script injection",
  ],
  [headers.includes("unload=()"), "bfcache protection is missing unload=()"],
  [
    llms.startsWith("# JMYING") &&
      llms.includes("https://jmying.com/#profile") &&
      llms.includes("https://jmying.com/#highlights"),
    "llms.txt does not expose the canonical profile structure",
  ],
]) {
  if (!requirement[0]) findings.push(requirement[1]);
}

if (/\n  renderLanguageOptions\(\);\n  setupEvidenceExplorer\(\);/.test(app)) {
  findings.push("the hidden language option list is still built at startup");
}

if (findings.length) {
  console.error(`Performance audit failed:\n- ${findings.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Performance audit passed (${packageJson.version}, ${imageUrls.length} revisioned image references, AVIF/WebP/JPEG fallbacks).`,
);
