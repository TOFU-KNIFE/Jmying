# First-Visit Style and Image Diagnostics

Status: evidence captured 2026-10-28 Asia/Kuala_Lumpur (2026-10-27 UTC); transport rechecked at 2026-10-28 02:48:11 +08 (2026-10-27 18:48:11 UTC). Initial observations were read-only; the subsequent remediation below was authorized by the owner. It does not prove what happened during the user's historical visit.

## Executive result

The current production site is reachable and renders correctly in fresh Chromium and Safari sessions. A no-JavaScript reload still has its CSS and hero image. A normal fresh load produced no browser resource failures or console errors.

The reported symptom is reproducible when the same-origin stylesheet and hero image are deliberately blocked: the page falls back to blue browser-default links, unstyled text and a large natural-size image/broken-image area. This is evidence for a CSS/image retrieval, cache, content-blocker or historical deployment problem, not evidence that the current HTML or JavaScript is failing.

The initial live-server check did not redirect HTTP to HTTPS. After **Always Use HTTPS** was enabled in the authorized Cloudflare UI, a no-proxy follow-up at 2026-10-28 02:48:11 +08 (2026-10-27 18:48:11 UTC) returned `301` for both the homepage and a query-bearing stylesheet URL, with HTTPS `200` endpoints and no loop. This transport hardening remains separate from, and is not proof of, the historical styling failure.

## Remediation completed in Cloudflare

- Always Use HTTPS is enabled; raw HTTP checks return 301 with path/query preserved.
- Non-production Version command is `npx wrangler versions upload`; main retains `npx wrangler deploy`.
- A proxied `www` CNAME now points to `jmying.com`. The enabled Single Redirect `Canonical www to jmying.com` matches only `http.host eq "www.jmying.com"`, targets `concat("https://jmying.com", http.request.uri.path)` with 301 and preserves the query string. Browser navigation to `https://www.jmying.com/?entry=www-check` reached `https://jmying.com/?entry=www-check`.
- Local 1.15.4 code adds inline CSP-hashed CSS, content-derived URLs, image retries and mobile no-JavaScript navigation. Deployment/verification is recorded in the release notes.

## Original repository and deployment contract

The repository documentation and configuration identify the deployment as Cloudflare Workers Static Assets:

- `wrangler.jsonc`: Worker `jmying`, static assets from generated `dist/`.
- `README.md` and `CODEX.md`: Cloudflare Workers Builds deploys only merged `main`; pull requests do not create production previews.
- `docs/VERSIONING.md`: every changed immutable CSS, JavaScript, locale, image or icon URL must receive a matching `?v=` revision.
- `public/_headers`: security headers and long-lived immutable asset caching; it contains no domain-level HTTP redirect rule.

The repository contains no zone-level Cloudflare settings. `wrangler whoami` was run with the local Wrangler 4.111.0 installation and reported that the authentication token had expired; no account, token or environment value was printed. A separate authorized, logged-in Cloudflare browser session was available for the deployment settings below; the CLI credential remains expired.

Cloudflare deployment evidence captured in the same session:

- The active deployment was `8148be0d`, serving 100% of traffic, at commit `23b742453e7e3fafe05dc1552df42c08e45027a5`, with source `dependabot/github_actions/github-actions-c923ae5b31`.
- Workers Builds settings showed production branch `main` and non-production deployments enabled.
- The Version command was initially `npx wrangler deploy`, identical to the Deploy command. The authorized browser session saved `npx wrangler versions upload` and a subsequent reload confirmed the new value.

The duplicate Version/Deploy command was an accompanying release-pipeline risk: a non-production/version workflow could have used the production deploy command. It is not evidence that the historical CSS or image requests failed, and it does not replace the separate zone-level HTTPS decision.

## Direct transport checks before the UI change

The checks below used `curl --noproxy '*'` to bypass any configured HTTP proxy. The apex was also pinned to both observed Cloudflare IPv4 addresses. The three HTTP requests returned the same representation as the direct HTTPS request:

| Request                                        | Result            | Evidence                                                                                |
| ---------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `http://jmying.com/` via DNS                   | `HTTP/1.1 200 OK` | No `Location` header; `CF-Cache-Status: HIT`; ETag `"5e76c3d33612775aef7f268861fba5d6"` |
| `http://jmying.com/` pinned to `104.21.24.230` | `HTTP/1.1 200 OK` | Same ETag and HTML representation                                                       |
| `http://jmying.com/` pinned to `172.67.221.1`  | `HTTP/1.1 200 OK` | Same ETag and HTML representation                                                       |
| `https://jmying.com/` direct                   | `HTTP/1.1 200 OK` | Same ETag and HTML representation                                                       |

The HTTP response included `Server: cloudflare`, `Cache-Control: public, max-age=0, must-revalidate, no-transform`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`, and the same default-deny CSP as HTTPS. It did not include a redirect status or `Location` header, even when sent browser-like `Upgrade-Insecure-Requests: 1` and `Sec-Fetch-*` headers.

DNS evidence at the time of review:

- `jmying.com` A: `172.67.221.1`, `104.21.24.230`.
- `jmying.com` AAAA: `2606:4700:3032::ac43:dd01`, `2606:4700:3036::6815:18e6`.
- Authoritative nameservers: `nora.ns.cloudflare.com`, `kaiser.ns.cloudflare.com`.
- `www.jmying.com` had no A/AAAA answer; curl returned `Could not resolve host`.

The absence of a `www` record means a visitor who enters that hostname cannot reach the site. Whether this is intentional apex-only architecture or an incomplete alias is not recorded in the repository.

## Follow-up transport verification after Always Use HTTPS

The authorized Cloudflare browser session enabled **Always Use HTTPS** and the UI remained enabled after reload. Independent `curl --noproxy '*' --http1.1 -sSIL` checks at 2026-10-28 02:48:11 +08 (2026-10-27 18:48:11 UTC) observed:

| Request                                  | Result           | Evidence                                                                                                                                                                      |
| ---------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `http://jmying.com/`                     | `301` then `200` | `Location: https://jmying.com/`; final HTTPS response was `200 text/html`, `CF-Cache-Status: HIT`, ETag `"5e76c3d33612775aef7f268861fba5d6"`                                  |
| `http://jmying.com/styles.css?v=1.15.3`  | `301` then `200` | `Location: https://jmying.com/styles.css?v=1.15.3`; final HTTPS response was `200 text/css; charset=utf-8`, `CF-Cache-Status: HIT`, ETag `"09894766b5b608b62a43ff095bc51aa3"` |
| `https://jmying.com/`                    | `200`            | No further `Location` header or redirect loop                                                                                                                                 |
| `https://jmying.com/styles.css?v=1.15.3` | `200`            | No further `Location` header or redirect loop                                                                                                                                 |

The HTTP redirect responses were served by Cloudflare and preserved the path and query in `Location`. This verifies the apex HTTP-to-HTTPS policy from the current network path; it does not verify a `www` hostname, which at that stage had no DNS answer (subsequently repaired above).

## Browser upgrade evidence

In a newly created Chrome tab, navigating to `http://jmying.com/` ended at `https://jmying.com/`. CDP recorded a `requestWillBeSent` for the HTTP URL, then an HTTPS request and HTTPS `200` responses; the HTTP event had no `redirectResponse`, and no HTTP `responseReceived` event was observed. This is consistent with browser-side HSTS/upgrade handling rather than a server 301/308.

The browser's HTTPS upgrade does not change the raw server fact above: before remediation, a client without a cached HSTS policy could receive a `200` document over HTTP. A screenshot address bar showing a non-secure HTTP state therefore needs its exact URL, browser state, timestamp and network log before it can be interpreted. It is not, by itself, evidence that HTTP caused the CSS/image failure.

## Live resource evidence

The current HTML references `styles.css?v=1.15.3`, `app.js?v=1.15.3` and same-origin responsive image sources. Direct GETs for all 44 URLs extracted from the current HTML returned `200`; representative results are:

| URL                                                   | Status / MIME                        |           Response size |
| ----------------------------------------------------- | ------------------------------------ | ----------------------: |
| `/`                                                   | `200 text/html`                      |            24,380 bytes |
| `/styles.css?v=1.15.3`                                | `200 text/css; charset=utf-8`        | 10,525 compressed bytes |
| `/app.js?v=1.15.3`                                    | `200 text/javascript; charset=utf-8` |  5,898 compressed bytes |
| `/hero-photo-1600.avif?v=1.15.3`                      | `200 image/avif`                     |            59,152 bytes |
| `/portrait-760.avif?v=1.15.3`                         | `200 image/avif`                     |            23,331 bytes |
| `/approach-1400.webp?v=1.15.3`                        | `200 image/webp`                     |            12,698 bytes |
| `/lake-1400.jpg?v=1.15.3`                             | `200 image/jpeg`                     |           131,222 bytes |
| `/media/ai-accounting/sticker-motion-v1.mp4?v=1.15.3` | `200 video/mp4`                      |         1,613,220 bytes |

The stylesheet and script responses use `Cache-Control: public, max-age=31536000, immutable`; the HTML is revalidated with `max-age=0, must-revalidate`. The active CSP allows same-origin scripts, styles and images. This is correct for the current same-origin asset layout, but an unchanged immutable URL can preserve an old asset in a visitor's cache if a release changes its bytes without changing the revision.

For the current CSS, JavaScript and hero AVIF, `?v=1.15.2`, no query, `?v=1.15.3` and an unknown query returned the same bytes/ETag during this investigation. This shows no current cross-version divergence, but it does not remove the need to revise URLs: query handling may be ignored by the origin while still acting as a cache-key change at an edge or browser.

## Browser and failure reproduction

Normal cold-load observations:

1. Fresh Chromium loaded the styled navigation, typography and hero image.
2. Safari loaded the same styled first viewport and hero image in a new tab.
3. JavaScript was disabled in Chromium through CDP; CSS, HTML and hero image still rendered.
4. Normal Chromium network capture reported `200` for the document, hero, stylesheet, script, portrait and favicon, with zero `Network.loadingFailed` events.
5. Scrolling to lazy content requested the sticker WebPs/MP4, approach image and lake image; each returned `200` with zero failures.

Controlled failure observations (not server failures):

- Blocking `https://jmying.com/styles.css?v=1.15.3` produced browser-default blue links, unstyled text and a large natural-size hero image.
- Blocking that stylesheet plus `https://jmying.com/hero-photo-1600.avif?v=1.15.3` produced a blank first viewport with a broken-image marker and the image's explicit large dimensions.
- The failure events identified the stylesheet as `Stylesheet` and the hero as `Image`, with `blockedReason: inspector`; the document and unrelated resources remained `200`.

The controlled result closely matches the reported visual symptom, but the failure was injected locally by the browser automation and cannot establish that the production edge failed at the historical visit.

## Configuration maintenance

Keep the apex as canonical and the www alias/redirect enabled. Do not substitute
Workers `_redirects` path rules for zone-level HTTPS or hostname redirects.
After releases, verify content-hashed assets, exact CSP style hashes, fresh
WebKit/Chromium visits, locale switching, image-format failures, and the HTTP/www
redirect chain. Do not attribute the historical outage to the accompanying
configuration defects without request-level evidence.

Official references reviewed 2026-10-28:

- https://developers.cloudflare.com/workers/static-assets/headers/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src

## Historical unknowns and handoff checklist

The current evidence cannot distinguish among a transient edge failure, a local DNS/proxy/content blocker, a stale immutable asset, a cached old HTML document, a previous deployment with missing files, or a different hostname. Preserve the following if the symptom recurs:

- exact address-bar URL and whether it was `jmying.com`, `www.jmying.com`, HTTP or HTTPS;
- browser name/version, private vs normal profile, and whether content blockers were enabled;
- local time plus timezone and approximate network/region;
- a HAR or browser Network panel showing the first document, `styles.css`, `app.js` and hero-image requests;
- status, MIME, final URL and cache headers for each failed request.

No private contact information, credentials or tracking was added to the public site. The expired local Wrangler CLI credential was not used for deployment; releases use the existing GitHub/Cloudflare build pipeline.
