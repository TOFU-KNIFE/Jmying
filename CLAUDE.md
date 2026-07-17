# Claude working notes for JMYING

Read `AGENTS.md` first. It contains the durable product, design, privacy and accessibility constraints for this repository.

## What this project is

This is a static, multilingual professional profile for Jeremy Ying. Optimise for clarity, trust, speed and maintainability. It is intentionally not a feature-heavy portfolio app.

## Useful commands

```bash
npm ci
npm run dev
npm run format
npm test
```

## Main files

- `public/index.html`: semantic structure and English fallback content
- `public/styles.css`: design tokens, responsive layout, accessibility modes and motion
- `public/app.js`: locale manifest, language loading and preference, dialog behaviour and navigation state
- `public/locales/*.json`: complete translation bundles for each supported locale
- `public/_headers`: cache, privacy and security policy
- `scripts/security-audit.mjs`: deployable-file and security checks
- `scripts/i18n-audit.mjs`: translation-key and language-tag checks

When changing visible copy, update the English fallback in `index.html`, then update the matching key in every `public/locales/*.json` file. Do not add public contact channels other than the existing LinkedIn profile.
