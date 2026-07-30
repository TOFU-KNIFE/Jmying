# JMYING Codex operating guide

This is the complete working guide for Codex and other coding assistants that
maintain JMYING. Read `AGENTS.md` first, then this file. Use the focused documents
in `docs/` when a task touches design, localisation, release management or visual
quality.

## Current release

- Version: `1.13.4`
- Product: privacy-first multilingual professional profile
- Runtime: static HTML, CSS, JavaScript and locale JSON
- Hosting: Cloudflare Workers Static Assets
- Production: <https://jmying.com>
- Repository: <https://github.com/TOFU-KNIFE/Jmying>
- Production branch: `main`
- Public contact route: LinkedIn only

`main` must remain releasable. A change is not complete merely because it works
locally; it is complete after review, CI, merge, production deployment and
production verification.

## Project nature and purpose

JMYING is not a general web application, social profile or marketing funnel. It is
a focused recruiting and professional-reference website. A visitor should be able
to understand Jeremy Ying's identity, Accounting (FinTech) direction, verified
experience, selected projects, credentials and availability without encountering
unsupported claims or unnecessary interaction.

The site deliberately avoids a large framework. Its small static architecture is a
performance, privacy and maintenance choice. Add a framework only when a measured
requirement cannot be met clearly with the current platform.

## Source of truth

| Area                               | Canonical source                         |
| ---------------------------------- | ---------------------------------------- |
| Assistant constraints              | `AGENTS.md`                              |
| Complete Codex runbook             | `CODEX.md`                               |
| Claude-specific orientation        | `CLAUDE.md`                              |
| Public source                      | `public/`                                |
| App behaviour                      | `public/app.js`                          |
| Visual tokens and layout           | `public/styles.css`                      |
| Base English content               | `public/index.html`                      |
| Translations                       | `public/locales/*.json`                  |
| Design rules and references        | `docs/DESIGN_SYSTEM.md`                  |
| Translation intent and terminology | `docs/LOCALIZATION_GUIDE.md`             |
| Visual evaluation loop             | `docs/WEB_QUALITY_WORKFLOW.md`           |
| Branches, versions and releases    | `docs/VERSIONING.md`                     |
| Release history                    | `CHANGELOG.md`                           |
| Deployment configuration           | `wrangler.jsonc` and `public/_headers`   |
| Automated gates                    | `scripts/*.mjs` and `.github/workflows/` |

Generated production output belongs in `dist/` and must not be edited by hand.

## Non-negotiable product contract

1. LinkedIn is the only public contact route.
2. Never deploy a private email address, telephone number, detailed address,
   reference contact, credential identifier, résumé source file, secret, analytics
   identifier or advertising script.
3. Keep every claim factual, specific and proportionate to the source material.
4. Preserve all 14 locales whenever content keys change.
5. Preserve semantic headings, keyboard access, visible focus, 44-pixel targets,
   reduced motion, increased contrast, forced colours and right-to-left support.
6. Keep runtime resources same-origin and compatible with the default-deny Content
   Security Policy.
7. Keep the current independent identity. References are quality benchmarks, not
   templates or evidence of affiliation.
8. Use responsive assets, explicit dimensions and correct loading priority.
9. Revision every immutable asset URL when its contents change.
10. Never merge a visual change without desktop, mobile and representative-locale
    review.

## Current experience and design state

### Information architecture

1. Hero: identity, professional direction, availability and the user-provided
   market-desk photograph.
2. Professional profile: restrained yearbook portrait on the left, start-aligned
   copy on the right and evidence rows below.
3. Experience: factual editorial rows and an accessible evidence timeline.
4. Working approach: source, structure and review workflow without the old
   oversized abstract visual.
5. Selected projects and challenges: touch-friendly horizontal cards with partial
   next-card visibility, keyboard navigation and same-page “Learn more” details.
6. Credentials and contact: verified education/credentials followed by a
   LinkedIn-only close.

### Visual language

- Institutional blue `#AFC7E5`, authority navy `#071A33`, warm neutrals and a
  single functional information blue.
- Helvetica Neue and Helvetica remain the preferred Latin faces. Self-hosted,
  Unicode-ranged Inter and Source Serif 4 provide deterministic same-origin
  fallbacks when the preferred system faces are absent.
- Chinese, Japanese, Korean, Thai and Arabic use script-appropriate system stacks.
- Four deliberate smooth-corner levels are used, with `corner-shape: squircle` as
  progressive enhancement and ordinary `border-radius` as the complete fallback.
- Motion uses nonlinear easing, transform and opacity, and always honours
  `prefers-reduced-motion`.
- Layouts reflow from 320-pixel mobile widths through large desktop screens.

### Brand symbol

Release `1.13.4` introduces an original pure graphic symbol. It contains no
letters, monogram or typographic glyph. Three connected geometric planes surround
one clear aperture, representing evidence moving through structured review into
clarity. The symbol uses the existing navy, warm-white and pale-blue palette.

The design draws only on broad professional-identity principles: one recognisable
anchor, restrained geometry, forward movement and consistent cross-device use. It
must not be altered to resemble Deloitte's green dot, EY's yellow beam, PwC's
stacked warm-colour blocks or KPMG's boxed wordmark.

Asset inventory:

- `assets/brand/jmying-symbol-master.png`: transparent high-resolution source
- `assets/brand/README.md`: provenance, regeneration prompt and export rules
- `public/brand/jmying-symbol-192.png`: manifest icon
- `public/brand/jmying-symbol-512.png`: high-resolution and maskable manifest icon
- `public/favicon-32.png`: browser favicon
- `public/apple-touch-icon.png`: Apple touch icon

The graphic symbol is reserved for browser chrome, saved-site and install contexts.
It does not appear inside the page layout. The navigation keeps the accessible
`JMYING` name as live HTML text; do not rasterise it.

## Localisation contract

Supported locales are English, Chinese (Simplified), Chinese (Traditional),
Bahasa Melayu, Indonesian, Thai, Vietnamese, Japanese, Korean, French, German,
Spanish, Brazilian Portuguese and Arabic.

- Understand the English source's background, audience and factual boundary before
  translating it.
- Localise meaning and professional register rather than copying English syntax.
- Use `zh-Hans` and `zh-Hant`; label the variants by script, never by political or
  regional shorthand.
- Keep protected facts, dates, organisation names and availability consistent
  across every locale.
- Expect text expansion. Never shorten facts just to make a layout fit.
- Use logical CSS properties and verify Arabic as a complete mirrored experience.
- Update `docs/LOCALIZATION_GUIDE.md` when a new term or editorial decision becomes
  reusable.
- Run the internationalisation audit after every locale or key change.

## Performance, privacy and security baseline

- The Hero is the only high-priority photograph.
- The identity symbol is not requested by page-layout markup. Browser and install
  surfaces load their dedicated icon resources independently.
- Below-fold images lazy-load at low priority.
- AVIF is preferred for photographs, with WebP and JPEG fallbacks.
- Hidden language options, carousel measurements and offscreen sections are
  deferred.
- HTML is revalidated and marked `no-transform`; immutable versioned assets use a
  one-year cache.
- Fonts are same-origin, Unicode-ranged and loaded only when a device needs the
  fallback.
- The site has no analytics, advertising, form collection or third-party runtime
  dependency.
- The default-deny CSP, HSTS, frame blocking, restrictive Permissions Policy and
  cross-origin controls in `public/_headers` are release requirements.

The accepted `1.13.0` mobile Lighthouse baseline was performance 99, FCP 1.6
seconds, LCP 1.6 seconds, TBT 0 milliseconds, CLS 0 and a 92 KiB initial transfer.
A new feature may not trade away these fundamentals without documented evidence
and approval.

## Complete improvement loop

### 1. Orient and frame

1. Read `AGENTS.md`, `CODEX.md` and the relevant focused document.
2. Inspect the current branch, working tree and latest `main`.
3. Preserve unrelated user changes; never discard a dirty working tree.
4. State the visitor outcome and identify factual, privacy, locale and deployment
   risks.
5. Ask the user only when a genuine style fork would materially change identity or
   meaning. Resolve routine spacing, responsiveness and accessibility directly.

### 2. Research

1. Prefer current official primary sources.
2. Record the source and review date in the relevant design/workflow document.
3. Extract principles such as hierarchy, scan path, geometry, accessibility and
   release practice.
4. Never copy proprietary fonts, logos, layouts, photography or protected visual
   devices.
5. Mark conclusions that combine several references as an inference.

### 3. Specify

Define before editing:

- affected files and locale keys
- content truth boundary
- desktop, tablet, 390-pixel and 320-pixel behaviour
- keyboard, pointer and touch states
- light, dark, reduced-motion, increased-contrast and forced-colour states
- asset dimensions, formats, loading priority and byte budget
- acceptance tests and production verification route

### 4. Branch and build

Start from an up-to-date `main`:

```bash
git switch main
git pull --ff-only
git switch -c feat/short-purpose
npm ci
```

Use `feat/`, `fix/`, `perf/`, `content/` or `chore/` as documented in
`docs/VERSIONING.md`. Keep commits reviewable and avoid mixing unrelated
maintenance with a visual change.

Implementation rules:

- edit readable sources, never `dist/`
- reuse design tokens and semantic HTML
- update all locales together when keys change
- strip image metadata and preserve aspect ratio
- keep explicit image width/height and correct loading attributes
- keep the Hero as the only `fetchpriority="high"` image
- keep large motion compositor-only
- add a reusable audit whenever a defect class can recur

### 5. Review and correct

Run the implementation and evaluation passes separately.

```bash
npm run dev
npm run format
npm run format:check
npm test
```

Visual review must cover:

- 1440-pixel desktop
- 390-pixel mobile
- 320-pixel minimum width
- English
- German or another long-text locale
- Japanese or Chinese
- Thai or Vietnamese
- Arabic right-to-left
- keyboard-only navigation
- dark mode
- reduced motion
- increased contrast and forced colours
- console errors, broken anchors, language switching and LinkedIn destination

Record findings in `design-qa.md` using:

- P0: blocks release, privacy, security or core task
- P1: major factual, accessibility, responsive or visual failure
- P2: actionable quality defect
- P3: optional refinement

Correct P0–P2 items and repeat the same viewports and states until the file ends
with `final result: passed`.

### 6. Version and document

Use Semantic Versioning:

- patch: compatible fix, copy correction, identity asset or maintenance
- minor: compatible new section, locale or interaction
- major: incompatible URL, deployment or content-model change

Keep these values aligned:

- `package.json`
- `package-lock.json`
- CSS, JavaScript, image and icon `?v=` revisions
- `public/app.js` locale version
- `CHANGELOG.md`
- the current-release line in this file

Update any affected operating rule, design rule or localisation decision in the
same pull request.

### 7. Commit and publish a pull request

Review scope before staging:

```bash
git status --short
git diff --check
git diff
git add <explicit paths>
git diff --cached
git commit -m "feat(brand): add pure graphic identity symbol"
git push -u origin feat/short-purpose
```

Use Conventional Commits. Prefer one clear subject under 72 characters. Useful
types include `feat`, `fix`, `perf`, `content`, `docs`, `test`, `build` and
`chore`.

The pull request must state:

- visitor-facing outcome
- factual or privacy impact
- responsive and locale evidence
- automated checks run
- asset/performance effect
- screenshots for visual changes
- rollback path

Wait for the required `quality` check. Do not merge a red or pending release.

### 8. Merge and deploy

Merge the approved pull request into `main`. Cloudflare Workers Builds listens only
to `main` and deploys automatically. Pull-request branches are validated by GitHub
Actions without production deployment.

Manual deployment is recovery-only and requires explicit authorisation:

```bash
npm run deploy
```

Do not create a second production path or edit deployed files from the Cloudflare
dashboard.

### 9. Verify production and release

After Cloudflare reports success:

1. Open <https://jmying.com> with a cache-busting query.
2. Confirm the expected versioned CSS, JavaScript, locale and identity assets.
3. Inspect desktop and mobile layout, the brand symbol, Hero, portrait, carousel,
   language selector and LinkedIn action.
4. Confirm no console errors or failed requests.
5. Confirm security and cache headers.
6. Test at least English, one CJK locale and Arabic.
7. Tag the verified merge commit as `vX.Y.Z`.
8. Create a GitHub release from the matching changelog section.

If production fails, stop the release, preserve evidence and revert the merge with
a new commit. Never rewrite public `main` history or use a destructive reset.

### 10. Feed learning back

Every defect should improve at least one durable layer: a test, token, checklist,
documentation rule or source-data rule. Review dependencies and broken links
monthly. Recheck source guidance, content accuracy, every locale, responsive
screenshots and Core Web Vitals quarterly.

## Codex and Claude collaboration

Claude can propose or implement code improvements, but the repository remains the
source of truth.

- Assign one owner per file or component during concurrent work.
- Do not let two assistants edit the same file at the same time.
- Exchange branch name, base commit, changed paths, commands run, unresolved
  findings and screenshots in every handoff.
- Require the receiving assistant to inspect the diff and rerun the full gates.
- Never paste private résumé material, secrets or non-public contact information
  into prompts.
- Treat generated copy as a draft until facts, tone and every locale are reviewed.
- Treat generated imagery as a managed asset: record provenance, keep an editable
  master, export deterministic sizes and visually inspect small-scale use.
- Merge through the same pull-request, CI and deployment flow regardless of which
  assistant wrote the code.

## Release evolution

`CHANGELOG.md` is canonical. This map helps an assistant understand why the current
system looks and behaves as it does:

- `1.0.0`: initial secure, responsive multilingual profile.
- `1.1.0`: nonlinear motion, stronger locale behaviour, CI and assistant guidance.
- `1.2.0`: 14 locales, RTL support and same-origin translation bundles.
- `1.3.1`: institutional editorial redesign, responsive hierarchy and design system.
- `1.4.0`: working approach, managed imagery, repeatable quality workflow and CI
  reliability.
- `1.5.0`: Apple-informed horizontal project carousel and accessible Learn more
  dialog.
- `1.6.0`: compact mobile header and translated navigation menu.
- `1.7.0`: compact 68-pixel desktop header and shared editorial grid.
- `1.8.0`: smaller portrait treatment, market context and evidence timeline.
- `1.9.0`: user-provided market-desk Hero and yearbook portrait separation.
- `1.10.0`: left-image/right-copy Professional profile and simplified approach
  section.
- `1.10.1`: native-quality localisation rewrite and script-based Chinese labels.
- `1.11.0`: four-level smooth-corner system and progressive squircles.
- `1.12.0`: script-specific Japanese, Chinese, Korean, Thai, Vietnamese and Arabic
  typography.
- `1.13.0`: AVIF, deferred work, image priority, cache and deterministic
  performance gates.
- `1.13.1`: minified deployment, `llms.txt` and default-English startup reduction.
- `1.13.2`: accessible-name and contrast corrections.
- `1.13.3`: deterministic self-hosted Latin/Vietnamese font fallbacks.
- `1.13.4`: original pure graphic symbol, complete identity asset set and expanded
  operating documentation.

## Definition of done

A task is complete only when its content is truthful, its layout works from 320
pixels upward, its interactions are keyboard accessible, all affected locales are
natural and complete, assets are within budget and metadata-free, automated gates
pass, visual P0–P2 findings are closed, documentation and versions agree, the pull
request is merged through green CI, Cloudflare has deployed the merged `main`, and
production has been verified.
