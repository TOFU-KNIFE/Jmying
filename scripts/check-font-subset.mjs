import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  fontCodePoints,
  readFontCorpus,
  selectFontCSS,
} from "./font-subset.mjs";

test("font coverage retains every authored glyph in every supplied weight", async () => {
  const original = await readFile("src/fonts.css", "utf8");
  const corpus = await readFontCorpus();
  const compact = selectFontCSS(original, corpus);
  const parse = (css) =>
    [...css.matchAll(/@font-face\s*\{[^}]+\}/g)].map(([face]) => ({
      weight: Number(face.match(/font-weight:(\d+)/)[1]),
      ranges: face
        .match(/unicode-range:([^;}]+)/)[1]
        .split(",")
        .map((range) => {
          const [a, b = a] = range
            .trim()
            .slice(2)
            .split("-")
            .map((value) => parseInt(value, 16));
          return [a, b];
        }),
    }));
  const before = parse(original),
    after = parse(compact);
  const coverage = (faces, weight, point) =>
    faces.some(
      (face) =>
        face.weight === weight &&
        face.ranges.some(([a, b]) => point >= a && point <= b),
    );
  for (const weight of [300, 400, 600, 700]) {
    for (const point of fontCodePoints(corpus)) {
      assert.equal(
        coverage(after, weight, point),
        coverage(before, weight, point),
        `weight ${weight}, U+${point.toString(16)}`,
      );
    }
  }
  assert(compact.length < original.length / 5, "Remove unused Unicode tables");
  assert(compact.includes("font-display:swap"));
});

test("new content and escaped Unicode automatically gain their font coverage", () => {
  const css =
    '@font-face{font-weight:400;unicode-range:U+4E00-4E05;src:url("/original.woff2")}';
  assert.equal(selectFontCSS(css, ""), "");
  const next = selectFontCSS(css, "一\\u4E01\\u{4E05}");
  assert(next.includes("U+4E00-4E01,U+4E05"));
  assert(next.includes("/original.woff2"), "Keep the unmodified source font");
});

test("offline release contains exactly the font files referenced by its styles", async () => {
  const metadata = JSON.parse(await readFile("dist/pwa-build.json", "utf8"));
  const referenced = new Set();
  for (const file of metadata.files.filter((file) => file.endsWith(".css"))) {
    const css = await readFile(`dist/${file}`, "utf8");
    for (const [, url] of css.matchAll(/url\(["']?\/?(fonts\/[^"')]+)["']?\)/g))
      referenced.add(url);
  }
  assert(referenced.size > 0);
  assert.deepEqual(
    new Set(metadata.files.filter((file) => file.endsWith(".woff2"))),
    referenced,
  );
  assert(!metadata.files.some((file) => file.endsWith("upstream.css.txt")));
  assert(metadata.files.includes("credits.html"));
  assert(
    metadata.bytes < 16 * 1024 * 1024,
    "Keep complete offline archive below 16 MiB",
  );
});
