import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const localeDir = join(root, "public/locales");
const html = await readFile(join(root, "public/index.html"), "utf8");
const app = await readFile(join(root, "public/app.js"), "utf8");
const findings = [];
const expectedLocales = [
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

const htmlKeys = new Set(
  [...html.matchAll(/data-i18n="([A-Za-z][A-Za-z0-9]*)"/g)].map(
    ([, key]) => key,
  ),
);
const manifestSource = app.match(
  /const localeManifest = \[([\s\S]*?)\n  \];/,
)?.[1];
const manifestLocales = [...(manifestSource || "").matchAll(/\{([\s\S]*?)\}/g)]
  .map(([, block]) => ({
    id: block.match(/\bid: "([^"]+)"/)?.[1],
    htmlLang: block.match(/\bhtmlLang: "([^"]+)"/)?.[1],
  }))
  .filter(({ id, htmlLang }) => id && htmlLang);
const localeFiles = (await readdir(localeDir))
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(/\.json$/, ""))
  .sort();

const expectedSorted = [...expectedLocales].sort();
const manifestIds = manifestLocales.map(({ id }) => id);
if (
  JSON.stringify([...manifestIds].sort()) !== JSON.stringify(expectedSorted)
) {
  findings.push(
    `locale manifest differs from expected locales: ${manifestIds.join(", ")}`,
  );
}
if (JSON.stringify(localeFiles) !== JSON.stringify(expectedSorted)) {
  findings.push(
    `locale files differ from expected locales: ${localeFiles.join(", ")}`,
  );
}

for (const { id, htmlLang } of manifestLocales) {
  try {
    const [canonical] = Intl.getCanonicalLocales(htmlLang);
    if (canonical !== htmlLang)
      findings.push(`${id} uses non-canonical BCP 47 tag: ${htmlLang}`);
  } catch {
    findings.push(`${id} uses invalid BCP 47 tag: ${htmlLang}`);
  }
}

const fallback = JSON.parse(await readFile(join(localeDir, "en.json"), "utf8"));
const requiredKeys = new Set([...htmlKeys, "copied", "present"]);
const fallbackKeys = Object.keys(fallback).sort();

for (const locale of expectedLocales) {
  let translations;
  try {
    translations = JSON.parse(
      await readFile(join(localeDir, `${locale}.json`), "utf8"),
    );
  } catch (error) {
    findings.push(`${locale}.json cannot be parsed: ${error.message}`);
    continue;
  }

  const keys = Object.keys(translations).sort();
  if (JSON.stringify(keys) !== JSON.stringify(fallbackKeys))
    findings.push(`${locale}.json keys do not match en.json`);

  for (const key of requiredKeys) {
    if (typeof translations[key] !== "string" || !translations[key].trim())
      findings.push(`${locale}.json has no usable translation for ${key}`);
  }
}

if (!/<html lang="en">/.test(html)) {
  findings.push('index.html must provide the English fallback with lang="en"');
}

if (findings.length) {
  console.error(
    `Internationalisation audit failed:\n- ${findings.join("\n- ")}`,
  );
  process.exit(1);
}

console.log(
  `Internationalisation audit passed (${expectedLocales.length} locales, ${requiredKeys.size} translated keys).`,
);
