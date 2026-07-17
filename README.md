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
- simple rules and whitespace separate evidence instead of card-heavy modules
- warm neutral surfaces are paired with restrained institutional blue
- Helvetica-first typography uses a compact, consistent hierarchy
- adaptive layouts reflow from 320-pixel mobile widths to large desktops
- all interactive targets are at least 44 × 44 pixels
- purposeful nonlinear motion using compositor-friendly properties
- light/dark, reduced-motion, increased-contrast, and forced-colors support

The source-backed foundations and implementation rules are documented in
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Languages

- English
- Simplified Chinese
- Traditional Chinese
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

Latin text prefers Helvetica Neue and Helvetica. Chinese, Japanese, Korean, Thai and Arabic use script-appropriate system fallbacks so every language keeps legible, natural letterforms without downloading third-party fonts.

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

Versioned CSS, JavaScript and locale URLs use long-lived immutable caching. Update the `?v=` revision in `public/index.html` and `public/app.js` with every release that changes those assets.

For stronger source-code privacy, make the GitHub repository private. Cloudflare’s GitHub integration can deploy from a private repository after authorization.

## Local preview

```bash
npm install
npm run dev
```

## Test and audit

```bash
npm test
```

This runs JavaScript syntax validation, translation consistency checks, a privacy/security scan, image-metadata checks, external-link validation, header validation, and a Wrangler deployment dry run.

## Collaboration and releases

Repository rules for contributors and coding assistants live in `AGENTS.md`. Claude-specific orientation lives in `CLAUDE.md`. Branching, commits, Semantic Versioning and the release checklist are documented in `docs/VERSIONING.md`.

Pull requests run the same formatting and test checks in GitHub Actions. Dependabot groups routine development-dependency updates.

## Deploy

Merges to `main` are deployed automatically by Cloudflare Workers Builds. The Cloudflare project listens only to `main`; pull requests are validated by GitHub Actions without creating Cloudflare preview builds.

For an authorised manual recovery deployment:

```bash
npm run deploy
```

Cloudflare serves the contents of `public/` according to `wrangler.jsonc`. Keep the Cloudflare build command empty and use `npx wrangler deploy` as the deploy command.
