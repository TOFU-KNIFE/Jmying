# JMYING

A responsive, privacy-first multilingual professional profile deployed with Cloudflare Workers Static Assets.

## Contact policy

LinkedIn is the **only** public contact channel:

- https://www.linkedin.com/in/jeremy-ying-a8520b350/

The site has no phone link, email link, contact form, public vCard, GitHub-profile contact button, analytics identifier, or advertising script.

## Design direction

The interface follows an original institutional design system informed by
public Claude/Anthropic and Goldman Sachs guidance without copying their
branding, proprietary assets or layouts:

- content remains visually dominant
- simple rules and whitespace separate evidence, with one touch-optimised carousel for selected projects
- warm neutral surfaces are paired with restrained institutional blue
- an original pure graphic symbol provides a compact cross-device identity without
  using a letterform or imitating a referenced organisation's mark
- Helvetica-first typography uses a compact, consistent hierarchy
- adaptive layouts reflow from 320-pixel mobile widths to large desktops
- all interactive targets are at least 44 × 44 pixels
- purposeful nonlinear motion using compositor-friendly properties
- smooth rounded rectangles with a restrained four-step radius scale and progressive squircle enhancement
- light/dark, reduced-motion, increased-contrast, and forced-colors support

The source-backed foundations and implementation rules are documented in
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Languages

- English
- Chinese (Simplified)
- Chinese (Traditional)
- Bahasa Melayu
- Indonesian
- Thai
- Vietnamese
- Japanese
- Korean
- French
- German
- Spanish
- Brazilian Portuguese
- Arabic

The browser language and region are detected locally. A visitor’s explicit selection is stored only in local browser storage and is never transmitted by this site. English remains in the HTML as a resilient fallback; other locale bundles load from this site only when needed.

Language names are displayed in the current interface language when the browser supports `Intl.DisplayNames`. Dates use locale-aware `Intl.DateTimeFormat`, Arabic uses a mirrored right-to-left layout, and every release checks all translated keys and BCP 47 language tags.

Latin text prefers Helvetica Neue and Helvetica, with same-origin, Unicode-ranged
Inter and Source Serif 4 fallbacks for systems that lack the preferred faces.
Chinese, Japanese, Korean, Thai and Arabic use script-appropriate system fallbacks
so every language keeps legible, natural letterforms without third-party runtime
font requests.

Translation intent, protected facts, language-specific editorial choices and the review loop for future copy changes are documented in [`docs/LOCALIZATION_GUIDE.md`](docs/LOCALIZATION_GUIDE.md).

## Privacy and security

The deployable files intentionally exclude:

- phone numbers
- private email addresses
- detailed home addresses
- references and their contact details
- credential identifiers
- the source résumé PDF
- image EXIF/GPS metadata
- API keys, tokens, passwords, certificates, and private keys
- source maps

Security controls include a default-deny Content Security Policy, Trusted Types enforcement, HSTS, frame blocking, no-referrer navigation, a restrictive Permissions Policy, cross-origin isolation headers, no third-party runtime resources, and an automated public-file audit.

Browser-delivered files cannot be genuinely hidden or encrypted from visitors. The security model is therefore to keep every secret out of `public/`. Source remains readable for maintainers, while Cloudflare can apply transport compression. For future server-side credentials, use Cloudflare Secrets.

Production builds inline the minified stylesheet into `dist/index.html` and add
the exact style-body SHA-256 to the generated CSP. The source HTML keeps its
external `/styles.css` link so local development and source audits remain
readable. Builds emit a content-hashed `app.<sha256>.js` path, while mutable
`app.js` and `styles.css` compatibility paths are revalidated.

Production image, icon, media, manifest and font URLs receive deterministic
content-hash queries, and locale requests use a hash of the compact locale set.
Those URLs move when bytes change, so a visitor cannot retain an old immutable
object under the previous release query. Fonts remain eligible for one-year
immutable caching; mutable HTML, image, media and locale paths use
`max-age=0, must-revalidate`.

For stronger source-code privacy, make the GitHub repository private. Cloudflare’s GitHub integration can deploy from a private repository after authorization.

## Local preview

```bash
npm ci
npm run dev
```

## Test and audit

```bash
npm test
npx playwright install chromium
npm run test:browser
```

This runs JavaScript syntax validation, translation consistency checks, a privacy/security scan, image-metadata checks, external-link validation, header validation, and a Wrangler deployment dry run.
The build also verifies the generated inline-CSS CSP hash, content-hashed script
and locale token, and every local HTML/CSS/font/image reference before `dist/` is
eligible for deployment.

Browser tests run against the built site in the local Cloudflare runtime, covering
320/390/820/1440-pixel layouts, representative scripts, all 14 language switches,
request failures/cancellation/timeouts, keyboard dialogs, RTL carousel controls,
system color preferences and motion-resource restrictions. Run build/audit and
browser commands sequentially because each builds `dist/`.

`npm run dev` watches `public/` and `scripts/` so source edits rebuild the preview.
Unknown URLs return HTTP 404; this static profile has no client-side routes.
Only `public/robots.txt` and `public/sitemap.xml` are deployable SEO sources.
Translation JSON is compacted during the build and checked against the source.

## Collaboration and releases

Repository rules for contributors and coding assistants live in `AGENTS.md`. The
complete project state and end-to-end Codex operating workflow live in `CODEX.md`.
Claude-specific orientation lives in `CLAUDE.md`. Branching, commits, Semantic
Versioning and the release checklist are documented in `docs/VERSIONING.md`.

Pull requests run formatting, static audits and Chromium interaction/accessibility tests in GitHub Actions. Browser reports, screenshots and failure traces are retained for 14 days. Dependabot groups routine development-dependency updates.

## Deploy

Merges to `main` are deployed automatically by Cloudflare Workers Builds. The Cloudflare project listens only to `main`; pull requests are validated by GitHub Actions without creating Cloudflare preview builds.

For an authorised manual recovery deployment:

```bash
npm run deploy
```

Cloudflare deploys the generated `dist/` directory configured in
`wrangler.jsonc`. Its `build.command` runs `npm run build` before the deploy, so
do not deploy `public/` directly or edit generated `dist/` files by hand.
The production `main` environment is the only environment that uses
`wrangler deploy`. Non-production and preview environments must upload a
version with `npx wrangler versions upload` and must not use the production
deploy command.
