import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8"),
);
const packageLock = JSON.parse(
  await readFile(join(root, "package-lock.json"), "utf8"),
);
const html = await readFile(join(publicDir, "index.html"), "utf8");
const app = await readFile(join(publicDir, "app.js"), "utf8");
const styles = await readFile(join(publicDir, "styles.css"), "utf8");
const findings = [];

const releaseVersions = new Map([
  ["package.json", packageJson.version],
  ["package-lock.json", packageLock.version],
  [
    "CSS asset revision",
    html.match(/styles\.css\?v=([0-9]+\.[0-9]+\.[0-9]+)/)?.[1],
  ],
  [
    "JavaScript asset revision",
    html.match(/app\.js\?v=([0-9]+\.[0-9]+\.[0-9]+)/)?.[1],
  ],
  [
    "locale asset revision",
    app.match(/localeVersion = "([0-9]+\.[0-9]+\.[0-9]+)"/)?.[1],
  ],
]);

for (const [source, version] of releaseVersions) {
  if (version !== packageJson.version) {
    findings.push(
      `${source} is ${version || "missing"}; expected ${packageJson.version}`,
    );
  }
}

const imageTags = [...html.matchAll(/<img\b[\s\S]*?>/g)].map(([tag]) => tag);
for (const tag of imageTags) {
  const src = tag.match(/\bsrc="([^"]+)"/)?.[1] || "unknown image";
  for (const attribute of ["alt", "width", "height", "decoding"]) {
    if (!new RegExp(`\\b${attribute}="[^"]*"`).test(tag)) {
      findings.push(`${src} is missing ${attribute}`);
    }
  }
  if (/\/(?:approach|lake)-/.test(src) && !/\bloading="lazy"/.test(tag)) {
    findings.push(`${src} must lazy-load below the fold`);
  }
}

if (!/portrait-760\.webp[\s\S]*rel="preload"/.test(html)) {
  findings.push("the primary portrait preload is missing");
}

const responsiveImageFamilies = ["portrait", "sonoma", "approach", "lake"];
for (const family of responsiveImageFamilies) {
  if (!html.includes(`/${family}-800`) && family !== "portrait") {
    findings.push(`${family} has no responsive 800-pixel source`);
  }
  if (!html.includes(`/${family}-1400`) && family !== "portrait") {
    findings.push(`${family} has no responsive 1400-pixel source`);
  }
}

const publicImages = [
  "portrait.jpg",
  "portrait.webp",
  "sonoma.jpg",
  "sonoma.webp",
  "approach-1400.jpg",
  "approach-1400.webp",
  "lake-1400.jpg",
  "lake-1400.webp",
];
const imageBudgetBytes = 350 * 1024;
for (const filename of publicImages) {
  try {
    const info = await stat(join(publicDir, filename));
    if (info.size > imageBudgetBytes) {
      findings.push(
        `${filename} is ${Math.ceil(info.size / 1024)} KiB; limit is 350 KiB`,
      );
    }
  } catch {
    findings.push(`${filename} is missing`);
  }
}

const navTargets = [...html.matchAll(/data-nav-link="" href="#([^"]+)"/g)].map(
  ([, target]) => target,
);
for (const target of navTargets) {
  if (!new RegExp(`\\bid="${target}"`).test(html)) {
    findings.push(`navigation target #${target} is missing`);
  }
}

const highlightCards = html.match(/class="highlight-card(?:\s|")/g) || [];
if (highlightCards.length !== 4) {
  findings.push(
    `expected 4 selected-project cards; found ${highlightCards.length}`,
  );
}
for (const requiredCarouselContract of [
  'id="highlightTrack"',
  'data-highlight-previous=""',
  'data-highlight-next=""',
  'id="highlightDialog"',
]) {
  if (!html.includes(requiredCarouselContract)) {
    findings.push(`carousel contract is missing ${requiredCarouselContract}`);
  }
}
if (!styles.includes("scroll-snap-type: inline mandatory")) {
  findings.push("project carousel is missing inline scroll snapping");
}

if (findings.length) {
  console.error(`Quality audit failed:\n- ${findings.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Quality audit passed (${packageJson.version}, ${imageTags.length} responsive images, ${navTargets.length} navigation targets).`,
);
