# Versioning and release workflow

## Branches

`main` is always releasable. Create short-lived branches with one of these prefixes:

- `feat/` for user-visible capability
- `fix/` for defects
- `perf/` for measurable performance work
- `content/` for copy or translation changes
- `chore/` for tooling, dependencies and repository maintenance

Open a pull request and let CI pass before merging into `main`. Preserve useful atomic commits when they document distinct stages of a larger release. Protect `main` on GitHub by requiring a pull request and the `quality` status check.

## Commits

Use Conventional Commits, for example:

```text
feat(i18n): localise language names
perf(motion): animate compositor-only properties
fix(audit): decode repository paths with spaces
docs: explain the release workflow
```

Use `!` or a `BREAKING CHANGE:` footer only when deployment or public behaviour requires manual migration.

## Versions

Use Semantic Versioning:

- Patch (`1.1.1`): fixes, copy corrections and compatible maintenance
- Minor (`1.2.0`): new compatible sections, locales or interactions
- Major (`2.0.0`): incompatible deployment, content-model or URL changes

Keep the version in `package.json`, `package-lock.json`, the `?v=` CSS,
JavaScript, locale, image and icon revisions in `public/index.html`,
`public/app.js` and `public/site.webmanifest`, and `CHANGELOG.md` aligned.

## Release checklist

1. Pull the latest `main` and run `npm ci`.
2. Run `npm run format` and `npm test`.
3. Check desktop, mobile, reduced motion, a long-text locale, a complex-script locale and Arabic right-to-left layout.
4. Move the release notes from `Unreleased` into a dated version section.
5. Update the package version and every changed CSS, JavaScript, locale, image and
   identity-asset revision.
6. Merge the release pull request; Cloudflare Workers Builds deploys the new `main` commit automatically.
7. Verify `https://jmying.com`, security headers and the LinkedIn link.
8. Tag the verified merge commit as `vX.Y.Z` and create a GitHub release from the changelog.

Cloudflare deploys production only from `main` with `npx wrangler deploy`. Non-production branches use `npx wrangler versions upload` to create preview versions without changing production traffic. Wrangler runs `npm run build` and serves the generated `dist/` directory. Production asset URLs use content hashes; readable source revisions remain aligned with the release. Use `npm run deploy` only for an authorised recovery deployment.
