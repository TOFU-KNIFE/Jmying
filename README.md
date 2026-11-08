# JMYING Archive 2.0

Jeremy Ying’s interactive personal archive, built on the complete [LBEILC/RhineLabUI](https://github.com/LBEILC/RhineLabUI) web runtime (upstream snapshot recorded in `docs/RHINELAB_MIGRATION.md`). This is a major migration from the static 1.x homepage.

## Run

Use Node 22.16+ (24 LTS recommended).

```sh
npm ci
npm run dev
npm test
npm run test:browser
```

`npm run build` generates `dist/`. Cloudflare Workers Builds deploys main to https://jmying.com. Branch builds must use `wrangler versions upload`, never production deploy.

## Interface

The original 3D array, opening, extraction and decryption, archive reading tabs, search, saved items, UTF-8 export, 360° model viewer, quality, theme, sound and motion settings, and offline installation remain available. Sound is initially muted. Portrait phones start with the upstream performance mode; settings can restore full quality.

Five columns contain forty editorial topics taken from the former public profile. They do not represent additional qualifications. Chinese/English record text is included. The former fourteen-language profile remains at `/classic.html`; use it when WebGL is unavailable or when a simple reading view is preferable. LinkedIn remains the sole professional contact route. No analytics, advertising, form or backend authentication is added.

## Attribution

RhineLabUI source and author-created models are MIT licensed, copyright 2026 LBEILC. See `LICENSES/RhineLabUI-MIT.txt`, `/credits.html`, and `docs/RHINELAB_UPSTREAM.md`. Upstream Arknights/Rhine Lab references, sampled audio, marks, and third-party fonts retain their respective notices and rights; this project is unaffiliated. The licensed Novecento webfont is not downloaded or supplied; upstream’s artwork fallback remains in use.

The root application is now in `src/`, the public topics in `content/archives.json`, and the old static assets remain in `public/`. Earlier 1.x Playwright files are historical coverage; the active V2 suite is `tests/v2/`.
