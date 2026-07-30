# JMYING web quality workflow

This workflow turns design, content, localisation and release management into a
repeatable improvement loop. It preserves JMYING's independent identity and uses
public guidance as a quality benchmark rather than copying another organisation's
brand assets or proprietary layouts.

## Reference model

| Reference                                                                                                                                                                                                                         | Adopt                                                                                                                            | Avoid                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Goldman Sachs](https://www.goldmansachs.com) and its [design-system engineering principles](https://developer.gs.com/blog/posts/engineering-principles-of-the-gs-design-system)                                                  | Editorial hierarchy, consistent concepts, restrained rules, clear action priority and cross-device behaviour                     | Proprietary fonts, logos, artwork or claims of affiliation                              |
| [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) and [localisation guidance](https://developer.apple.com/localization/)                                                          | Adaptive composition, 44-pixel targets, preserved image ratios, clear alignment, system preferences and locale testing           | Device-specific assumptions, decorative complexity or Apple branding                    |
| [Apple Charts](https://developer.apple.com/design/human-interface-guidelines/charts) and [The Economist visualisation guidance](https://education.economist.com/insights/interviews/tips-for-visualising-data-like-the-economist) | Simple chart forms, direct labels, restrained grid lines, accessible interaction and a limited palette                           | Invented metrics, unexplained decoration, colour-only meaning or interaction-only facts |
| [Claude design guidance](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines) and [evaluation harness](https://www.anthropic.com/engineering/harness-design-long-running-apps)                                 | A limited type hierarchy, visible controls, 320-pixel support, explicit acceptance criteria and separate build/evaluation passes | Hidden critical controls, horizontal page overflow or ungraded visual iteration         |
| [Cravath](https://www.cravath.com/), [Skadden](https://www.skadden.com/capabilities), [Sullivan & Cromwell](https://www.sullcrom.com/About/about-us) and [Latham & Watkins](https://www.lw.com/en/about-us)                       | Evidence-first writing, factual capability structure, concise institutional prose and generous reading space                     | Unsupported superlatives, dense promotional copy or card-heavy presentation             |

Accessibility follows [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Performance
targets follow [Core Web Vitals](https://web.dev/articles/vitals): at the 75th
percentile, LCP at or below 2.5 seconds, INP at or below 200 milliseconds and CLS
at or below 0.1.

## The improvement loop

### 1. Frame

- State the recruiter or professional outcome in one sentence.
- Inventory the factual source material before writing. Do not infer proficiency,
  seniority, impact or availability.
- Identify the affected sections, locales, privacy constraints and deployment risk.
- Ask for a style decision only when two credible directions would materially
  change identity, emphasis or content truth. Continue independently for routine
  spacing, type, responsive and accessibility decisions.

### 2. Research

- Prefer current official guidance and primary sources.
- Record URLs and the date reviewed in the relevant design or workflow document.
- Extract principles, not proprietary assets: hierarchy, spacing, navigation,
  interaction, localisation, evidence order and release practice.
- Capture reference screenshots when a visual change is proposed.

### 3. Specify

- Define the scan path, heading order, copy limits, image role and interaction states.
- Set acceptance criteria before implementation: target viewports, locales,
  accessibility preferences, asset budget and automated checks.
- Keep LinkedIn as the only contact channel and keep all runtime resources same-origin.

### 4. Build

- Work on a short-lived Conventional Commit branch.
- Keep typography, colour, spacing and motion in shared tokens.
- Use system font fallbacks, semantic HTML, start-aligned copy and logical CSS
  properties for right-to-left support.
- Supply responsive WebP and JPEG sources, explicit image dimensions, meaningful
  alternative text or an empty `alt` for decorative images, and lazy loading below
  the fold. Prefer AVIF first when a photographic source meets visual review, while
  retaining WebP and JPEG fallbacks.
- Match every `sizes` hint to the rendered CSS slot, revision immutable assets in
  their URLs and keep the Hero as the only high-priority image.
- Defer hidden interface construction, below-fold geometry reads and offscreen
  rendering until they are close to the viewport.
- Animate only `transform` and `opacity` with nonlinear easing and a reduced-motion
  fallback.

### 5. Evaluate independently

Do not treat successful implementation as successful evaluation. Run a separate
review pass:

1. Compare reference and implementation screenshots at the same viewport.
2. Review hierarchy, spacing, typography, colour, image crop, copy truth and
   interaction clarity.
3. Test 1440-pixel desktop, 390-pixel mobile and 320-pixel minimum width.
4. Test English, a long-text locale such as German, a CJK locale and Arabic RTL.
5. Test keyboard navigation, visible focus, 44-pixel targets, dark mode, reduced
   motion, reduced transparency, increased contrast and forced colours.
6. Check console errors, broken navigation, language switching and the LinkedIn CTA.
7. When a data view changes, verify every filter, selected state, keyboard focus, live detail update, source note and narrow-screen overflow behaviour.
8. Run `npm run format:check`, `npm test` and a Cloudflare dry run.
9. Run mobile and desktop Lighthouse against a cold profile and compare FCP, LCP,
   TBT, CLS, transfer size, console errors and image-delivery findings with the
   last accepted release.

Record P0 blocking, P1 major, P2 actionable and P3 optional findings in
`design-qa.md`. Correct P0–P2 findings and repeat the same checks until the file
ends with `final result: passed`.

### 6. Release

- Review the diff for scope, private data, factual accuracy and all-locale coverage.
- Open a pull request with visual evidence, wait for the required `quality` check and
  merge only after it passes.
- Let Cloudflare deploy the merged `main` commit automatically.
- Verify the production page, response security headers, locale assets, images and
  LinkedIn destination.
- Tag the verified merge with the aligned Semantic Version and publish changelog
  notes.

### 7. Observe and improve

- Per change: run the complete automated and visual gates.
- Monthly: review dependency updates, broken links, browser compatibility and asset
  weight; run `npm run audit:performance`; batch low-risk maintenance.
- Quarterly: re-check official reference guidance, content accuracy, every locale,
  responsive screenshots and Core Web Vitals.
- For every defect, add or strengthen a reusable test, token, checklist item or
  documented rule so the same class of issue is less likely to recur.

## Definition of done

A change is complete only when it is factual, understandable, responsive from 320
pixels, keyboard accessible, translated across all 14 locales, within the image
budget, free of runtime errors, documented, reviewed through `design-qa.md`, merged
through CI and verified on `https://jmying.com`.

## Performance evidence and decision rules

The 1.13.0 baseline was measured on 30 July 2026 with Lighthouse mobile emulation:
performance 99, FCP 1.6 seconds, LCP 1.6 seconds, TBT 0 milliseconds, CLS 0 and a
92 KiB initial transfer. The optimisation pass keeps those strong fundamentals and
targets the remaining measurable waste rather than adding a framework or a large
build toolchain.

- [web.dev LCP guidance](https://web.dev/articles/optimize-lcp) supports one
  discoverable, high-priority Hero resource; secondary imagery stays lazy and low
  priority.
- [web.dev image performance guidance](https://web.dev/learn/performance/image-performance)
  supports AVIF as a smaller progressive source with WebP/JPEG fallbacks and requires
  perceptual review rather than a universal compression setting.
- [web.dev content-visibility guidance](https://web.dev/articles/content-visibility)
  supports skipping layout, style and paint work for offscreen sections when an
  intrinsic fallback size is supplied.
- [web.dev back-forward cache guidance](https://web.dev/articles/bfcache) recommends
  avoiding `unload`; the global Permissions Policy prevents it from being added.
- [Cloudflare static-asset guidance](https://developers.cloudflare.com/workers/static-assets/headers/)
  supports explicit cache headers through `_headers`.
- [Cloudflare Web Analytics guidance](https://developers.cloudflare.com/web-analytics/faq/)
  documents that `Cache-Control: no-transform` prevents automatic beacon injection.
  This site uses that option to preserve its no-analytics promise and eliminate the
  CSP error caused by the injected script.

Performance changes must preserve the accessibility score, factual content, CSP,
image quality and 14-locale behaviour. A lower byte count is not accepted when it
causes visible banding, soft facial detail, layout instability or broken navigation.
