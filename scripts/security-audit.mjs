import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");
const textExtensions = new Set([
  ".html",
  ".js",
  ".css",
  ".json",
  ".xml",
  ".txt",
  ".svg",
  ".webmanifest",
]);
const allowedExternalOrigins = new Set(["https://www.linkedin.com"]);
const findings = [];

async function walk(dir) {
  const output = [];
  for (const entry of await readdir(dir)) {
    const path = join(dir, entry);
    const info = await stat(path);
    if (info.isDirectory()) output.push(...(await walk(path)));
    else output.push(path);
  }
  return output;
}

function fail(file, message) {
  findings.push(`${relative(root, file)}: ${message}`);
}

const files = await walk(publicDir);
for (const file of files) {
  const rel = relative(publicDir, file);
  const lower = rel.toLowerCase();
  if (
    /\.(map|pem|key|p12|pfx|crt|cer|der|env|sqlite|db|pdf|docx?)$/.test(lower)
  ) {
    fail(file, "forbidden deployable file type");
  }

  const buffer = await readFile(file);
  if (
    /\.(jpe?g)$/i.test(file) &&
    (buffer.includes(Buffer.from("Exif\0\0")) ||
      buffer.includes(Buffer.from("http://ns.adobe.com/xap/1.0/")))
  ) {
    fail(file, "JPEG contains EXIF/XMP metadata");
  }
  if (
    /\.webp$/i.test(file) &&
    (buffer.includes(Buffer.from("EXIF")) ||
      buffer.includes(Buffer.from("XMP ")))
  ) {
    fail(file, "WebP contains EXIF/XMP metadata");
  }

  if (!textExtensions.has(extname(file)) && !lower.endsWith(".webmanifest"))
    continue;
  const text = buffer.toString("utf8");

  const forbiddenPatterns = [
    [
      /\b[A-Z0-9._%+-]+@(?!example\.com\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
      "email address",
    ],
    [
      /(?:\+?60[\s-]?)?0?1[0-9][\s-]?\d{3,4}[\s-]?\d{4}/,
      "Malaysian phone number",
    ],
    [/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/, "private key"],
    [
      /(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*['\"][^'\"]{8,}/i,
      "embedded secret-like value",
    ],
    [/linkedin\.com\/in\/ying-lei-a8520b350/i, "obsolete LinkedIn profile URL"],
    [/github\.com\/TOFU-KNIFE/i, "GitHub profile exposed as a contact path"],
    [/contact\.vcf/i, "public vCard reference"],
  ];
  for (const [pattern, label] of forbiddenPatterns) {
    if (pattern.test(text)) fail(file, `contains ${label}`);
  }

  for (const match of text.matchAll(/https:\/\/[^\s"'<>)}]+/g)) {
    let url;
    try {
      url = new URL(match[0].replace(/[.,;:]$/, ""));
    } catch {
      continue;
    }
    if (url.hostname === "jmying.com") continue;
    if (!allowedExternalOrigins.has(url.origin))
      fail(file, `unexpected external URL ${url.origin}`);
  }
}

const html = await readFile(join(publicDir, "index.html"), "utf8");
if (/<form\b|<input\b|<textarea\b/i.test(html))
  fail(
    join(publicDir, "index.html"),
    "contains a data-collection form or input",
  );
if (/\son[a-z]+\s*=|<script(?![^>]+src=)|<style\b/i.test(html))
  fail(
    join(publicDir, "index.html"),
    "contains inline executable code or event handlers",
  );

const clientJs = await readFile(join(publicDir, "app.js"), "utf8");
for (const [pattern, label] of [
  [/\b(?:eval|Function)\s*\(/, "dynamic code execution"],
  [
    /\.(?:innerHTML|outerHTML)\s*=|insertAdjacentHTML\s*\(/,
    "unsafe HTML injection sink",
  ],
  [/sourceMappingURL/i, "source map reference"],
]) {
  if (pattern.test(clientJs))
    fail(join(publicDir, "app.js"), `contains ${label}`);
}
const linkedinCount = (
  html.match(/https:\/\/www\.linkedin\.com\/in\/jeremy-ying-a8520b350\//g) || []
).length;
if (linkedinCount < 2)
  fail(
    join(publicDir, "index.html"),
    "expected LinkedIn-only contact links are missing",
  );

const headers = await readFile(join(publicDir, "_headers"), "utf8");
for (const required of [
  "default-src 'none'",
  "connect-src 'none'",
  "frame-ancestors 'none'",
  "require-trusted-types-for 'script'",
  "Strict-Transport-Security",
  "Referrer-Policy: no-referrer",
]) {
  if (!headers.includes(required))
    fail(join(publicDir, "_headers"), `missing security control: ${required}`);
}

if (findings.length) {
  console.error("Security audit failed:\n- " + findings.join("\n- "));
  process.exit(1);
}

console.log(`Security audit passed (${files.length} public files checked).`);
