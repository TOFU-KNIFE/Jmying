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
- `public/app.js`: translations, language preference, dialog behaviour and navigation state
- `public/_headers`: cache, privacy and security policy
- `scripts/security-audit.mjs`: deployable-file and security checks
- `scripts/i18n-audit.mjs`: translation-key and language-tag checks

When changing copy, update the English fallback in both `index.html` and `app.js`, then update all other locale entries. Do not add public contact channels other than the existing LinkedIn profile.
