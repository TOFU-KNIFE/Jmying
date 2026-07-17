# Security policy

## Public-contact policy

Professional enquiries and responsible security reports are accepted through LinkedIn only:

- https://www.linkedin.com/in/jeremy-ying-a8520b350/

The public site does not publish or collect a phone number, private email address, home address, reference details, credential IDs, or the source résumé.

## Secrets

This is a static public website. No secret is required at runtime and no secret may be committed to the repository or copied into `public/`.

For future server-side features, store credentials with Cloudflare Secrets (`wrangler secret put`) rather than source code, static files, environment files committed to Git, or browser JavaScript.

The following are intentionally ignored by Git:

- `.env`
- `.dev.vars`
- `.wrangler/`
- private keys and certificates should never be added

## Public-code limitation

Anything sent to a browser can be inspected, downloaded, or reconstructed. Minification may deter casual copying, but it is not encryption and cannot protect a secret. The security boundary is therefore: **sensitive information must not exist in deployed client files**.

## Automated audit

Run:

```bash
npm test
```

The audit checks for common secrets and personal data, unexpected external URLs, source maps, risky files, image metadata markers, required headers, JavaScript syntax, and a Cloudflare deployment dry run.
