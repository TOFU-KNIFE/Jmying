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
const headers = await readFile(join(publicDir, "_headers"), "utf8");
const manifest = JSON.parse(
  await readFile(join(publicDir, "site.webmanifest"), "utf8"),
);
const findings = [];
const stickerMediaFiles = [
  "sticker-motion-v1.mp4",
  "sticker-start-v1.webp",
  "sticker-static-v1.webp",
];

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
  if (/\/portrait\./.test(src) && !/\bloading="lazy"/.test(tag)) {
    findings.push(`${src} must lazy-load below the hero`);
  }
}

if (!/hero-photo-1600\.avif[\s\S]*rel="preload"/.test(html)) {
  findings.push("the primary hero photo preload is missing");
}

const responsiveImageFamilies = new Map([
  ["portrait", null],
  ["approach", "1400"],
  ["lake", "1400"],
  ["hero-photo", "1600"],
]);
for (const [family, largestWidth] of responsiveImageFamilies) {
  if (!html.includes(`/${family}-800`) && family !== "portrait") {
    findings.push(`${family} has no responsive 800-pixel source`);
  }
  if (largestWidth && !html.includes(`/${family}-${largestWidth}`)) {
    findings.push(`${family} has no responsive ${largestWidth}-pixel source`);
  }
}

const publicImages = [
  "favicon-32.png",
  "apple-touch-icon.png",
  "brand/jmying-symbol-192.png",
  "brand/jmying-symbol-512.png",
  "portrait.jpg",
  "portrait.webp",
  "portrait.avif",
  "approach-1400.jpg",
  "approach-1400.webp",
  "approach-1400.avif",
  "lake-1400.jpg",
  "lake-1400.webp",
  "lake-1400.avif",
  "hero-photo-1600.jpg",
  "hero-photo-1600.webp",
  "hero-photo-1600.avif",
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

for (const extension of ["avif", "webp", "jpg"]) {
  const cacheRule = `/*.${extension}\n  Cache-Control: public, max-age=31536000, immutable`;
  if (!headers.includes(cacheRule)) {
    findings.push(`${extension} images are missing their immutable cache rule`);
  }
}

if (
  !html.includes(`/favicon-32.png?v=${packageJson.version}`) ||
  !html.includes(`/apple-touch-icon.png?v=${packageJson.version}`)
) {
  findings.push(
    "browser and device identity assets are missing or unrevisioned",
  );
}

if (
  html.includes("jmying-symbol") ||
  styles.includes(".brand-symbol") ||
  styles.includes(".wordmark-name")
) {
  findings.push("the graphic identity must not participate in page layout");
}

for (const size of ["192x192", "512x512"]) {
  const icon = manifest.icons?.find((candidate) => candidate.sizes === size);
  if (
    !icon ||
    icon.type !== "image/png" ||
    !icon.src.includes(`?v=${packageJson.version}`)
  ) {
    findings.push(`web manifest is missing its revisioned ${size} PNG icon`);
  }
}

if (!headers.includes("/*.png")) {
  findings.push("brand PNGs are missing their immutable cache rules");
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
  'class="highlight-card-backdrop"',
]) {
  if (!html.includes(requiredCarouselContract)) {
    findings.push(`carousel contract is missing ${requiredCarouselContract}`);
  }
}
for (const requiredStickerContract of [
  'data-sticker-module=""',
  'aria-labelledby="stickerTitle"',
  'data-sticker-play=""',
  'data-sticker-label=""',
  'data-sticker-status=""',
  'aria-live="polite"',
  'data-sticker-stage=""',
]) {
  if (!html.includes(requiredStickerContract)) {
    findings.push(
      `AI accounting sticker module is missing ${requiredStickerContract}`,
    );
  }
}
for (const [contract, finding] of [
  [
    "stickerAutoplayAttempted",
    "AI accounting motion is missing its single-attempt guard",
  ],
  [
    "requestStickerPlayback({ automatic: true })",
    "AI accounting motion is missing its near-viewport playback trigger",
  ],
  [
    'rootMargin: "0px 0px 15% 0px"',
    "AI accounting motion does not wait until the module is near the viewport",
  ],
  [
    "reducedMotionQuery.matches",
    "AI accounting motion is missing its reduced-motion runtime guard",
  ],
  [
    "stopStickerPlayback",
    "AI accounting motion is missing its user-controlled stop action",
  ],
  [
    "stickerStatusStopped",
    "AI accounting motion is missing its stopped status announcement",
  ],
  [
    "playing: [copy.stickerStop, copy.stickerStatusPlaying, false]",
    "AI accounting Stop control must remain enabled while motion is playing",
  ],
]) {
  if (!app.includes(contract)) findings.push(finding);
}
for (const filename of stickerMediaFiles) {
  try {
    const info = await stat(
      join(publicDir, "media", "ai-accounting", filename),
    );
    if (!info.isFile()) {
      findings.push(`AI accounting media ${filename} is not a regular file`);
    }
  } catch {
    findings.push(`AI accounting media ${filename} is missing`);
  }
  if (
    !html.includes(`/media/ai-accounting/${filename}?v=${packageJson.version}`)
  ) {
    findings.push(
      `AI accounting media ${filename} is missing its versioned HTML reference`,
    );
  }
}
if (
  !styles.includes(".sticker-showcase") ||
  !styles.includes(".sticker-stage") ||
  !styles.includes(".sticker-video") ||
  !styles.includes(".sticker-static")
) {
  findings.push("AI accounting sticker module styles are incomplete");
}
if (
  !/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.sticker-static\s*\{\s*opacity:\s*1;/.test(
    styles,
  )
) {
  findings.push(
    "AI accounting sticker module is missing its reduced-motion static fallback",
  );
}
if (html.includes('class="approach-visual"')) {
  findings.push(
    "the abstract artwork still occupies the working-approach lead",
  );
}
if (!styles.includes("scroll-snap-type: inline mandatory")) {
  findings.push("project carousel is missing inline scroll snapping");
}
if (
  (html.match(/aria-label="Contact on LinkedIn: Jeremy Ying"/g) || [])
    .length !== 2
) {
  findings.push(
    "default LinkedIn accessible names do not contain their visible labels",
  );
}
if (!styles.includes("--institutional-blue-dark: #3062a7;")) {
  findings.push("small institutional-blue labels can regress below 4.5:1");
}

for (const typographyContract of [
  '"Helvetica Neue", Helvetica, "JMYing Sans", Arial, sans-serif',
  '"Iowan Old Style", "JMYing Serif", Baskerville',
  'font-family: "JMYing Sans"',
  'font-family: "JMYing Serif"',
  "font-display: swap",
]) {
  if (!styles.includes(typographyContract)) {
    findings.push(`cross-platform typography is missing ${typographyContract}`);
  }
}

for (const [locale, requiredFamily] of [
  ["Japanese", '"Yu Gothic UI"'],
  ["Traditional Chinese", '"Microsoft JhengHei UI"'],
  ["Simplified Chinese", '"Microsoft YaHei UI"'],
  ["Korean", '"Apple SD Gothic Neo"'],
  ["Thai", '"Leelawadee UI"'],
  ["Vietnamese", '"JMYing Serif"'],
  ["Arabic", '"SF Arabic"'],
]) {
  if (!styles.includes(requiredFamily)) {
    findings.push(`${locale} typography is missing ${requiredFamily}`);
  }
}

if (!headers.includes("/fonts/*.woff2")) {
  findings.push("self-hosted fonts are missing their immutable cache rule");
}

for (const token of [
  "--leading-role",
  "--leading-display",
  "--leading-display-relaxed",
  "--leading-card",
]) {
  if (!styles.includes(token)) {
    findings.push(`script-aware typography is missing ${token}`);
  }
}

if (findings.length) {
  console.error(`Quality audit failed:\n- ${findings.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Quality audit passed (${packageJson.version}, ${imageTags.length} responsive images, ${navTargets.length} navigation targets).`,
);
