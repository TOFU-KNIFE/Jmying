import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const html = await readFile(join(root, "public/index.html"), "utf8");
const app = await readFile(join(root, "public/app.js"), "utf8");
const findings = [];

const htmlKeys = new Set(
  [...html.matchAll(/data-i18n="([A-Za-z][A-Za-z0-9]*)"/g)].map(
    ([, key]) => key,
  ),
);
const languageTags = [...app.matchAll(/htmlLang:\s*"([^"]+)"/g)].map(
  ([, tag]) => tag,
);
const localeCount = languageTags.length;

if (localeCount !== 9) {
  findings.push(`expected 9 locales, found ${localeCount}`);
}

for (const tag of languageTags) {
  try {
    Intl.getCanonicalLocales(tag);
  } catch {
    findings.push(`invalid BCP 47 language tag: ${tag}`);
  }
}

for (const key of htmlKeys) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const translatedCount = (
    app.match(new RegExp(`\\b${escapedKey}\\s*:`, "g")) || []
  ).length;
  if (translatedCount !== localeCount) {
    findings.push(
      `${key} appears in ${translatedCount} locale objects; expected ${localeCount}`,
    );
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
  `Internationalisation audit passed (${localeCount} locales, ${htmlKeys.size} translated keys).`,
);
