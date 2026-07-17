# Contributing

Thanks for improving JMYING. Keep changes small, reviewable and aligned with the site's purpose: a clear, fast and privacy-first professional profile.

## Local setup

```bash
npm ci
npm run dev
```

## Before making a change

1. Read `AGENTS.md` and `docs/VERSIONING.md`.
2. Create a focused branch from an up-to-date `main`.
3. Avoid combining content, visual and infrastructure changes unless they depend on each other.

## Quality checks

```bash
npm run format
npm test
```

For visual changes, check at least 1440 × 1000 and 390 × 844, including the language dialog and one non-English locale. Also test keyboard focus and reduced-motion mode.

## Pull requests

Explain the user-visible outcome, the reason for the change and how it was verified. Include before/after screenshots for visual changes. Never put private contact data or secrets in issues, commits, screenshots or deployable files.
