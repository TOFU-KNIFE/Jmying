import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
assert.equal(pkg.version, "2.0.1");
const html = await readFile("dist/index.html", "utf8");
assert.match(html, /JMYING Archive 2.0/);
assert.match(html, /assets\/index-.*\.js/);
assert.match(html, /classic.html/);
for (const name of ["archive-cassette", "archive-assembly"])
  assert(
    (await readdir("dist/assets")).some(
      (p) => p.startsWith(name + ".") && p.endsWith(".glb"),
    ),
  );
for (const path of await readdir("dist", { recursive: true })) {
  const s = await stat("dist/" + path);
  if (s.isFile())
    assert(s.size <= 25 * 1024 * 1024, "Cloudflare asset limit: " + path);
}
assert.match(
  await readFile("dist/licenses/RhineLabUI-MIT.txt", "utf8"),
  /Copyright.*LBEILC/,
);
assert.equal(
  (await readdir("dist/locales")).filter((n) => n.endsWith(".json")).length,
  14,
);
assert.match(await readFile("dist/classic.html", "utf8"), /Jeremy/);
console.log(
  "V2 release passed: bundled 3D models, license, 14-locale classic fallback, Cloudflare asset limits.",
);
