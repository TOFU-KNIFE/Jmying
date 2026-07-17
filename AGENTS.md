# JMYING project guidance

## Project nature

JMYING is a lightweight, multilingual professional profile. It is a static site deployed with Cloudflare Workers Static Assets, not a web application. Its primary job is to help a recruiter or professional contact quickly understand Jeremy Ying's background, experience and selected achievements.

## Non-negotiable constraints

- Keep LinkedIn as the only public contact route.
- Never add private email addresses, phone numbers, home addresses, résumé source files, credentials, analytics, advertising or third-party runtime scripts to `public/`.
- Keep claims factual and restrained. Prefer direct descriptions of work performed over promotional language or unsupported proficiency claims.
- Preserve all nine supported languages. Update every translation when adding a `data-i18n` key.
- Preserve keyboard access, visible focus, semantic headings and system preferences for reduced motion, reduced transparency, increased contrast and forced colors.
- Use motion to explain hierarchy or provide feedback. Animate only `transform` and `opacity` for larger elements, with brief nonlinear easing and a reduced-motion fallback.
- Keep the existing content-first visual system: dark photographic hero, opaque content surfaces, restrained translucent controls, bold left-aligned type and concentric radii. Do not copy Apple branding or proprietary assets.

## Working agreement

1. Run `npm ci` after pulling dependency changes.
2. Use `npm run dev` for local preview.
3. Run `npm run format` before committing.
4. Run `npm test` before opening or updating a pull request.
5. Use Conventional Commit messages and the workflow in `docs/VERSIONING.md`.

All deployable files live in `public/`. Security and language checks live in `scripts/`.
