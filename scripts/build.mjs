import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as minifyJavaScript } from "terser";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");
const distDir = join(root, "dist");
const distRoot = resolve(distDir);
const sourceHtmlPath = join(publicDir, "index.html");
const outputHtmlPath = join(distDir, "index.html");
const sourceStylesPath = join(publicDir, "styles.css");
const outputStylesPath = join(distDir, "styles.css");
const sourceScriptPath = join(publicDir, "app.js");
const outputScriptPath = join(distDir, "app.js");
const outputHeadersPath = join(distDir, "_headers");
const fontDir = join(distDir, "fonts");
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8"),
);
const fontAssets = [
  [
    "@fontsource-variable/inter",
    "inter-vietnamese-wght-normal.woff2",
    "inter-vietnamese-wght-normal-5.3.0.woff2",
  ],
  [
    "@fontsource-variable/inter",
    "inter-latin-ext-wght-normal.woff2",
    "inter-latin-ext-wght-normal-5.3.0.woff2",
  ],
  [
    "@fontsource-variable/inter",
    "inter-latin-wght-normal.woff2",
    "inter-latin-wght-normal-5.3.0.woff2",
  ],
  [
    "@fontsource-variable/source-serif-4",
    "source-serif-4-vietnamese-wght-normal.woff2",
    "source-serif-4-vietnamese-wght-normal-5.3.0.woff2",
  ],
  [
    "@fontsource-variable/source-serif-4",
    "source-serif-4-latin-ext-wght-normal.woff2",
    "source-serif-4-latin-ext-wght-normal-5.3.0.woff2",
  ],
  [
    "@fontsource-variable/source-serif-4",
    "source-serif-4-latin-wght-normal.woff2",
    "source-serif-4-latin-wght-normal-5.3.0.woff2",
  ],
];
const localeNames = [
  "en",
  "zh-CN",
  "zh-TW",
  "ms",
  "id",
  "th",
  "vi",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt-BR",
  "ar",
];

function sha256Base64(value) {
  return createHash("sha256").update(value).digest("base64");
}

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

function localReferencePath(reference) {
  const value = reference.trim();
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("data:") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("javascript:") ||
    /^[a-z][a-z\d+.-]*:/i.test(value) ||
    value.startsWith("//")
  ) {
    return null;
  }

  const parsed = new URL(value, "https://jmying.com/");
  const pathname = decodeURIComponent(parsed.pathname);
  const relativePath = pathname.replace(/^\/+/, "");
  const outputPath = resolve(distRoot, relativePath || "index.html");
  if (outputPath !== distRoot && !outputPath.startsWith(distRoot + sep)) {
    throw new Error("Production asset reference escapes dist/: " + reference);
  }
  return outputPath;
}

const contentHashCache = new Map();

async function contentHashForPath(path) {
  if (!contentHashCache.has(path)) {
    contentHashCache.set(path, sha256Hex(await readFile(path)));
  }
  return contentHashCache.get(path);
}

async function hashedAssetUrl(reference) {
  const path = localReferencePath(reference);
  if (!path) return reference;
  const parsed = new URL(reference, "https://jmying.com/");
  if (
    parsed.pathname === "/" ||
    /^\/(?:app\.js|styles\.css)$/.test(parsed.pathname)
  ) {
    return reference;
  }
  return (
    parsed.pathname +
    "?h=" +
    (await contentHashForPath(path)) +
    (parsed.hash || "")
  );
}

async function rewriteCssAssetUrls(cssText) {
  const urlPattern = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
  const replacements = new Map();
  for (const match of cssText.matchAll(urlPattern)) {
    replacements.set(match[2], await hashedAssetUrl(match[2]));
  }
  return cssText.replace(
    urlPattern,
    (whole, quote, value) =>
      "url(" + quote + (replacements.get(value) || value) + quote + ")",
  );
}

async function rewriteHtmlAssetUrls(htmlText) {
  const attributePattern =
    /(\s(?:src|href|srcset|imagesrcset|data-src)=")([^"]+)(")/gi;
  const replacements = new Map();
  for (const match of htmlText.matchAll(attributePattern)) {
    const attribute = match[0].match(
      /\s(src|href|srcset|imagesrcset|data-src)=/i,
    )?.[1];
    if (!attribute) continue;
    for (const candidate of referenceCandidates(match[2], attribute)) {
      const path = localReferencePath(candidate);
      if (path) replacements.set(candidate, await hashedAssetUrl(candidate));
    }
  }
  return htmlText.replace(attributePattern, (whole, prefix, value, suffix) => {
    const attribute = prefix.match(
      /\s(src|href|srcset|imagesrcset|data-src)=/i,
    )?.[1];
    if (!attribute) return whole;
    if (attribute === "srcset" || attribute === "imagesrcset") {
      return (
        prefix +
        value
          .split(",")
          .map((candidate) => {
            const parts = candidate.trim().split(/\s+/);
            const replacement = replacements.get(parts[0]) || parts[0];
            return [replacement, ...parts.slice(1)].join(" ");
          })
          .join(", ") +
        suffix
      );
    }
    return prefix + (replacements.get(value) || value) + suffix;
  });
}

async function rewriteManifestAssetUrls(manifestPath) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  for (const icon of manifest.icons || []) {
    if (icon.src) icon.src = await hashedAssetUrl(icon.src);
  }
  await writeFile(manifestPath, JSON.stringify(manifest) + "\n", "utf8");
}

function referenceCandidates(value, attribute) {
  if (attribute === "srcset" || attribute === "imagesrcset") {
    return value
      .split(",")
      .map((candidate) => candidate.trim().split(/\s+/)[0])
      .filter(Boolean);
  }
  return [value];
}

async function assertLocalReferences(htmlText, cssText) {
  const references = [];
  const attributePattern =
    /\s(?:src|href|srcset|imagesrcset|data-src)="([^"]+)"/gi;
  for (const match of htmlText.matchAll(attributePattern)) {
    const attribute = match[0].match(
      /\s(src|href|srcset|imagesrcset|data-src)=/i,
    )?.[1];
    if (!attribute) continue;
    for (const candidate of referenceCandidates(match[1], attribute)) {
      const path = localReferencePath(candidate);
      if (path) references.push([candidate, path, "HTML " + attribute]);
    }
  }

  const cssUrlPattern = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
  for (const match of cssText.matchAll(cssUrlPattern)) {
    const path = localReferencePath(match[2]);
    if (path) references.push([match[2], path, "CSS url()"]);
  }

  const missing = [];
  for (const [reference, path, context] of references) {
    try {
      const info = await stat(path);
      if (!info.isFile()) missing.push(context + " " + reference);
    } catch {
      missing.push(context + " " + reference);
    }
  }
  if (missing.length) {
    throw new Error(
      "Production asset reference validation failed:\n- " +
        missing.join("\n- "),
    );
  }
}

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });
await mkdir(fontDir, { recursive: true });

// Keep translator-friendly sources while shipping compact same-origin bundles.
const localeDir = join(distDir, "locales");
await Promise.all(
  (await readdir(localeDir))
    .filter((name) => name.endsWith(".json"))
    .map(async (name) => {
      const path = join(localeDir, name);
      const messages = JSON.parse(await readFile(path, "utf8"));
      await writeFile(path, `${JSON.stringify(messages)}\n`, "utf8");
    }),
);
await Promise.all(
  fontAssets.map(([packageName, sourceName, outputName]) =>
    cp(
      join(root, "node_modules", packageName, "files", sourceName),
      join(fontDir, outputName),
    ),
  ),
);
await Promise.all([
  cp(
    join(root, "node_modules", "@fontsource-variable", "inter", "LICENSE"),
    join(fontDir, "INTER-LICENSE.txt"),
  ),
  cp(
    join(
      root,
      "node_modules",
      "@fontsource-variable",
      "source-serif-4",
      "LICENSE",
    ),
    join(fontDir, "SOURCE-SERIF-4-LICENSE.txt"),
  ),
]);

await rewriteManifestAssetUrls(join(distDir, "site.webmanifest"));

const sourceHtml = await readFile(sourceHtmlPath, "utf8");
const outputHtml = await minifyHtml(sourceHtml, {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  continueOnParseError: false,
  decodeEntities: false,
  keepClosingSlash: true,
  minifyCSS: false,
  minifyJS: false,
  removeAttributeQuotes: false,
  removeComments: true,
  removeEmptyAttributes: false,
  removeOptionalTags: false,
  removeRedundantAttributes: true,
  sortAttributes: false,
  sortClassName: false,
  useShortDoctype: true,
});

for (const contract of [
  "<!doctype html>",
  "<main>",
  `src="/app.js?v=${packageJson.version}"`,
  'type="image/avif"',
]) {
  if (!outputHtml.toLowerCase().includes(contract.toLowerCase())) {
    throw new Error(
      `Production HTML is missing required contract: ${contract}`,
    );
  }
}

const sourceStyles = await readFile(sourceStylesPath, "utf8");
const stylesResult = new CleanCSS({
  level: 2,
  rebase: false,
  returnPromise: false,
}).minify(sourceStyles);
if (stylesResult.errors.length) {
  throw new Error(`CSS minification failed: ${stylesResult.errors.join("; ")}`);
}

const sourceScript = await readFile(sourceScriptPath, "utf8");
const localeBuffers = await Promise.all(
  localeNames.map((locale) => readFile(join(localeDir, locale + ".json"))),
);
const localeContentHash = sha256Hex(Buffer.concat(localeBuffers));
const productionScriptSource = sourceScript.replace(
  /const localeVersion = "[^"]+";/,
  'const localeVersion = "' + localeContentHash + '";',
);
if (productionScriptSource === sourceScript) {
  throw new Error("Production JavaScript is missing its locale version marker");
}
const scriptResult = await minifyJavaScript(productionScriptSource, {
  compress: { passes: 2 },
  format: { comments: false },
  mangle: true,
});
if (!scriptResult.code) {
  throw new Error("JavaScript minification produced no output");
}

const inlineStyle = await rewriteCssAssetUrls(stylesResult.styles);
await writeFile(outputStylesPath, inlineStyle + "\n", "utf8");
const scriptBody = scriptResult.code + "\n";
if (!scriptBody.includes(localeContentHash)) {
  throw new Error("Production JavaScript is missing its locale content hash");
}
const scriptHash = sha256Hex(scriptBody);
const hashedScriptName = "app." + scriptHash + ".js";
await writeFile(outputScriptPath, scriptBody, "utf8");
await writeFile(join(distDir, hashedScriptName), scriptBody, "utf8");

let productionHtml = outputHtml + "\n";
productionHtml = await rewriteHtmlAssetUrls(productionHtml);
const stylesheetLinkPattern =
  /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="\/styles\.css(?:\?[^"]*)?")[^>]*>/gi;
const stylesheetLinks = productionHtml.match(stylesheetLinkPattern) || [];
if (stylesheetLinks.length !== 1) {
  throw new Error(
    "Production HTML must contain exactly one source stylesheet link; found " +
      stylesheetLinks.length,
  );
}
productionHtml = productionHtml.replace(
  stylesheetLinkPattern,
  "<style>" + inlineStyle + "</style>",
);

const appScriptPattern =
  /(<script\b[^>]*\bsrc=")\/app\.js(?:\?[^"]*)?("[^>]*>)/gi;
const appScriptLinks = productionHtml.match(appScriptPattern) || [];
if (appScriptLinks.length !== 1) {
  throw new Error(
    "Production HTML must contain exactly one source application script; found " +
      appScriptLinks.length,
  );
}
productionHtml = productionHtml.replace(
  appScriptPattern,
  "$1/" + hashedScriptName + "$2",
);

const inlineStyleMatch = productionHtml.match(/<style>([\s\S]*?)<\/style>/i);
if (!inlineStyleMatch || inlineStyleMatch[1] !== inlineStyle) {
  throw new Error(
    "Production HTML inline CSS does not match the minified stylesheet bytes",
  );
}
if (productionHtml.match(/<style\b/gi)?.length !== 1) {
  throw new Error(
    "Production HTML must contain exactly one inline style block",
  );
}
if (productionHtml.match(stylesheetLinkPattern)?.length) {
  throw new Error("Production HTML still contains an external stylesheet link");
}
if (/\sstyle\s*=/i.test(productionHtml)) {
  throw new Error("Production HTML must not contain style attributes");
}

const styleHash = sha256Base64(inlineStyleMatch[1]);
const sourceHeaders = await readFile(outputHeadersPath, "utf8");
const cspMatch = sourceHeaders.match(/^  Content-Security-Policy: ([^\n]+)$/m);
if (!cspMatch) {
  throw new Error(
    "Production headers are missing their Content-Security-Policy",
  );
}
if (/\bunsafe-inline\b/.test(cspMatch[1])) {
  throw new Error("Production CSP must not allow unsafe inline code");
}
const styleDirectivePattern = /style-src ([^;]+)/;
if (!styleDirectivePattern.test(cspMatch[1])) {
  throw new Error("Production CSP is missing style-src");
}
const styleHashToken = "'sha256-" + styleHash + "'";
const generatedCsp = cspMatch[1].replace(
  styleDirectivePattern,
  (_, sources) => {
    const tokens = sources
      .split(/\s+/)
      .filter(Boolean)
      .filter((token) => !/^'sha256-[^']+'$/.test(token));
    tokens.push(styleHashToken);
    return "style-src " + tokens.join(" ");
  },
);
const generatedHeaders = sourceHeaders.replace(
  cspMatch[0],
  "  Content-Security-Policy: " + generatedCsp,
);
if (!generatedHeaders.includes(styleHashToken)) {
  throw new Error("Production CSP does not contain the exact inline CSS hash");
}
await writeFile(outputHeadersPath, generatedHeaders, "utf8");

const hashedScriptReference = 'src="/' + hashedScriptName + '"';
if (!productionHtml.includes(hashedScriptReference)) {
  throw new Error(
    "Production HTML is missing its content-hashed application script",
  );
}
if (productionHtml.includes('src="/app.js')) {
  throw new Error(
    "Production HTML still references the mutable application script",
  );
}
if (!productionHtml.toLowerCase().includes("<!doctype html>")) {
  throw new Error("Production HTML is missing its doctype");
}

await writeFile(outputHtmlPath, productionHtml, "utf8");
for (const locale of localeNames) {
  const localePath = join(localeDir, locale + ".json");
  const localeInfo = await stat(localePath);
  if (!localeInfo.isFile()) {
    throw new Error("Production locale is not a regular file: " + locale);
  }
}
for (const [, , outputName] of fontAssets) {
  const fontInfo = await stat(join(fontDir, outputName));
  if (!fontInfo.isFile()) {
    throw new Error("Production font is not a regular file: " + outputName);
  }
}
await assertLocalReferences(productionHtml, inlineStyle);
console.log(
  "Gzip payloads: HTML " +
    gzipSync(Buffer.from(productionHtml)).byteLength +
    " bytes; CSS " +
    gzipSync(Buffer.from(inlineStyle)).byteLength +
    " bytes; JavaScript " +
    gzipSync(Buffer.from(scriptBody)).byteLength +
    " bytes.",
);

const buildSizes = await Promise.all(
  [
    ["HTML", sourceHtmlPath, outputHtmlPath],
    ["CSS", sourceStylesPath, outputStylesPath],
    ["JavaScript", sourceScriptPath, outputScriptPath],
  ].map(async ([label, sourcePath, outputPath]) => {
    const [sourceInfo, outputInfo] = await Promise.all([
      stat(sourcePath),
      stat(outputPath),
    ]);
    return {
      label,
      output: outputInfo.size,
      reduction: Math.round((1 - outputInfo.size / sourceInfo.size) * 100),
      source: sourceInfo.size,
    };
  }),
);

console.log(
  `Built dist/: ${buildSizes
    .map(
      ({ label, output, reduction, source }) =>
        `${label} ${source} → ${output} bytes (${reduction >= 0 ? reduction + "% smaller" : -reduction + "% larger"})`,
    )
    .join("; ")}.`,
);
