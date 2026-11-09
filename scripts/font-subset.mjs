import { readFile, readdir } from "node:fs/promises";

// Keep the original, unmodified font shards. Only their CSS coverage is narrowed
// to authored app text; content edits automatically rebuild the required faces.
export async function readFontCorpus(root = process.cwd()) {
  const files = (await readdir(`${root}/src`, { recursive: true })).filter(
    (file) => /\.(ts|css|json)$/.test(file) && file !== "fonts.css",
  );
  return (
    await Promise.all([
      ...files.map((file) => readFile(`${root}/src/${file}`, "utf8")),
      readFile(`${root}/content/archives.json`, "utf8"),
    ])
  ).join("\n");
}

export function fontCodePoints(corpus) {
  const decoded = corpus.replace(
    /\\u(?:\{([a-f\d]+)\}|([a-f\d]{4}))/gi,
    (_, wide, short) => String.fromCodePoint(parseInt(wide ?? short, 16)),
  );
  // Allow arbitrary Latin names/search text in addition to the authored corpus.
  return [
    ...new Set([
      ...Array.from({ length: 0x250 - 0x20 }, (_, i) => i + 0x20),
      ...Array.from(decoded, (char) => char.codePointAt(0)),
    ]),
  ].sort((a, b) => a - b);
}

function ranges(points) {
  const spans = [];
  for (const point of points) {
    const previous = spans.at(-1);
    if (previous && point === previous[1] + 1) previous[1] = point;
    else spans.push([point, point]);
  }
  const hex = (point) => point.toString(16).toUpperCase();
  return spans
    .map(([a, b]) => `U+${hex(a)}${b === a ? "" : `-${hex(b)}`}`)
    .join(",");
}

export function selectFontCSS(css, corpus) {
  const points = fontCodePoints(corpus);
  const faces = [...css.matchAll(/@font-face\s*\{[^}]+\}/g)];
  if (!faces.length) throw new Error("Missing vendored MiSans font faces");
  return faces
    .flatMap(([face]) => {
      const match = face.match(/unicode-range:([^;}]+)/i);
      if (!match) throw new Error("Font face has no Unicode coverage");
      const coverage = match[1].split(",").map((token) => {
        const values = token.trim().match(/^U\+([a-f\d]+)(?:-([a-f\d]+))?$/i);
        if (!values) throw new Error(`Unsupported font range: ${token}`);
        return [parseInt(values[1], 16), parseInt(values[2] ?? values[1], 16)];
      });
      const used = points.filter((point) =>
        coverage.some(([a, b]) => point >= a && point <= b),
      );
      return used.length
        ? face.replace(match[0], `unicode-range:${ranges(used)}`)
        : [];
    })
    .join("\n");
}
