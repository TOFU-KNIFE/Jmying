# Information security review

## Scope

Reviewed the deployable `public/` directory, Cloudflare headers, package configuration, image metadata, outbound links, browser JavaScript, and deployment behavior.

## Findings and remediation

### Contact and personal information

- Removed the public vCard.
- Removed phone, email, address, reference, credential-ID, and GitHub contact paths.
- Corrected every contact CTA to the approved LinkedIn profile.
- Added an automated check that rejects common email, phone, key, token, certificate, PDF, database, source-map, and obsolete-contact patterns in `public/`.

### Browser-delivered code

- Removed unsafe HTML-string rendering from the language menu and replaced it with DOM construction.
- Enabled Trusted Types enforcement in CSP.
- Prohibited inline scripts, inline styles, event-handler attributes, `eval`, dynamic `Function`, unsafe HTML sinks, and source-map references.
- Kept browser code reviewable and excluded source maps from deployment.

### Network and browser isolation

- Default-deny Content Security Policy.
- Runtime requests are limited to same-origin locale bundles; there are no analytics, advertising, external API, or third-party asset requests.
- HSTS, frame denial, MIME sniffing prevention, no-referrer policy, restrictive Permissions Policy, origin-agent isolation, COOP, and CORP.
- Static asset methods confirmed to reject POST with HTTP 405.

### Images

- Portrait and landscape JPEG/WebP assets contain no EXIF, GPS, XMP, or ICC metadata.
- Image-search indexing is discouraged with `noimageindex`.

### Dependencies and deployment

- No runtime npm dependencies.
- `npm audit` reports zero vulnerabilities.
- Wrangler static-assets deployment dry run passed.
- Release-versioned JavaScript, CSS and locale URLs use year-long immutable caching; the release checklist requires a revision bump whenever one changes.

## Encryption and reverse engineering

HTTPS/HSTS protects data in transit. Public HTML, CSS, JavaScript, text, and images cannot be meaningfully encrypted against a visitor because the browser must receive the decryption material to display them. Heavy obfuscation would add maintenance and performance costs without creating a real security boundary.

The effective protection is:

1. never deploy secrets or private information;
2. keep signing certificates, API keys, and tokens in Cloudflare Secrets or offline storage;
3. keep the GitHub repository private if source visibility matters;
4. keep client source reviewable and rely on transport compression, not obscurity, for delivery efficiency;
5. continue running `npm test` before every deployment.

## Future Apple Wallet work

Do not commit a Pass Type ID certificate, `.p12`, private key, certificate password, or signing intermediate to Git. Prefer offline pass signing for a static card, or use a server-side signing service with secrets stored outside the public asset bundle.

**review result: passed**
