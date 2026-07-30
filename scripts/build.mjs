import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as minifyJavaScript } from "terser";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");
const distDir = join(root, "dist");
const sourceHtmlPath = join(publicDir, "index.html");
const outputHtmlPath = join(distDir, "index.html");
const sourceStylesPath = join(publicDir, "styles.css");
const outputStylesPath = join(distDir, "styles.css");
const sourceScriptPath = join(publicDir, "app.js");
const outputScriptPath = join(distDir, "app.js");
const packageJson = JSON.parse(
  await readFile(join(root, "package.json"), "utf8"),
);

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });

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

await writeFile(outputHtmlPath, `${outputHtml}\n`, "utf8");

const sourceStyles = await readFile(sourceStylesPath, "utf8");
const stylesResult = new CleanCSS({
  level: 2,
  rebase: false,
  returnPromise: false,
}).minify(sourceStyles);
if (stylesResult.errors.length) {
  throw new Error(`CSS minification failed: ${stylesResult.errors.join("; ")}`);
}
await writeFile(outputStylesPath, `${stylesResult.styles}\n`, "utf8");

const sourceScript = await readFile(sourceScriptPath, "utf8");
const scriptResult = await minifyJavaScript(sourceScript, {
  compress: { passes: 2 },
  format: { comments: false },
  mangle: true,
});
if (!scriptResult.code) {
  throw new Error("JavaScript minification produced no output");
}
await writeFile(outputScriptPath, `${scriptResult.code}\n`, "utf8");

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
        `${label} ${source} → ${output} bytes (${reduction}% smaller)`,
    )
    .join("; ")}.`,
);
