# RhineLabUI migration

- Date: 2026-11-09
- Upstream: https://github.com/LBEILC/RhineLabUI
- Snapshot: `12cc5e4013acb9408f753ff71de6b8492299b7c8`
- Runtime: all `src/` modules, runtime assets, export/build/PWA scripts and supporting motion references.
- Authoring-only Blender projects, reference recordings, large verification media and wallpaper packaging are not needed for this website deployment. They remain available upstream.
- Preserved functionality: 3D array, opening, reading/decryption, search, bookmarks, export, model viewer/disassembly, settings and PWA. The original sample dataset is replaced by forty public-profile topics.
- New branding and contact links; sound muted initially; mobile uses upstream super-performance defaults. No extra WebGL framework or remote runtime is introduced.
- Rollback: revert this release merge; never rewrite main. Legacy HTML/assets and all fourteen locale files remain at `/classic.html`.
- Security: CSP permits same-origin scripts and workers, same-origin/data/blob images, fonts and media, and inline styles for Three.js DOM transforms. The bundled lossless-model decoder may compile WebAssembly (`wasm-unsafe-eval`); JavaScript eval and external executable origins remain blocked.
- Validation: build, content tests, baseline-motion tests, 20,000 loop navigation checks, Cloudflare asset-size and license checks; browser flow results are recorded in design-qa.md.

## Toolchain advisory limitation

The available upstream Vite 7 toolchain reports development-only npm advisories in Vite, PostCSS, nanoid and source-map-js. npm audit suggests versions not currently installable from the configured official registry (Vite 8.2.0; attempts at available Vite 8.1.3/8.0.0 also encounter unavailable transitive versions). No forced/invalid lockfile or security-audit suppression is used. Keep the development server loopback-only, process only repository-owned source, and deploy the generated static output. `npm audit --omit=dev` reports zero runtime advisories. Re-evaluate the toolchain once patched packages are installable.
