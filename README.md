# JMYING

A responsive, privacy-first multilingual professional profile deployed with Cloudflare Workers Static Assets.

## Contact policy

LinkedIn is the **only** public contact channel:

- https://www.linkedin.com/in/jeremy-ying-a8520b350/

The site has no phone link, email link, contact form, public vCard, GitHub-profile contact button, analytics identifier, or advertising script.

## Design direction

The interface follows current Apple platform-design principles without copying Apple branding or proprietary assets:

- content remains visually dominant
- translucent material is reserved for navigation and controls
- opaque content surfaces preserve hierarchy and legibility
- bold, left-aligned typography and consistent concentric radii
- adaptive layouts across desktop and mobile
- reduced-motion, reduced-transparency, increased-contrast, and forced-colors support

## Languages

- English
- Simplified Chinese
- Traditional Chinese
- Bahasa Melayu
- Japanese
- Korean
- French
- German
- Spanish

The browser language is detected locally. A visitor’s explicit selection is stored only in local browser storage and is never transmitted by this site.

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

Browser-delivered files cannot be genuinely hidden or encrypted from visitors. The security model is therefore to keep every secret out of `public/`. Production JavaScript and CSS are minified only as a casual-copying deterrent. For future server-side credentials, use Cloudflare Secrets.

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

This runs JavaScript syntax validation, a privacy/security scan, image-metadata checks, external-link validation, header validation, and a Wrangler deployment dry run.

## Deploy

```bash
npm run deploy
```

Cloudflare serves the contents of `public/` according to `wrangler.jsonc`.
