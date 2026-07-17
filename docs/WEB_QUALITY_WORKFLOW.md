# JMYING web quality workflow

This workflow turns design, content, localisation and release management into a
repeatable improvement loop. It preserves JMYING's independent identity and uses
public guidance as a quality benchmark rather than copying another organisation's
brand assets or proprietary layouts.

## Reference model

| Reference                                                                                                                                                                                                   | Adopt                                                                                                                            | Avoid                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [Goldman Sachs](https://www.goldmansachs.com) and its [design-system engineering principles](https://developer.gs.com/blog/posts/engineering-principles-of-the-gs-design-system)                            | Editorial hierarchy, consistent concepts, restrained rules, clear action priority and cross-device behaviour                     | Proprietary fonts, logos, artwork or claims of affiliation                      |
| [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) and [localisation guidance](https://developer.apple.com/localization/)                                    | Adaptive composition, 44-pixel targets, preserved image ratios, clear alignment, system preferences and locale testing           | Device-specific assumptions, decorative complexity or Apple branding            |
| [Claude design guidance](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines) and [evaluation harness](https://www.anthropic.com/engineering/harness-design-long-running-apps)           | A limited type hierarchy, visible controls, 320-pixel support, explicit acceptance criteria and separate build/evaluation passes | Hidden critical controls, horizontal page overflow or ungraded visual iteration |
| [Cravath](https://www.cravath.com/), [Skadden](https://www.skadden.com/capabilities), [Sullivan & Cromwell](https://www.sullcrom.com/About/about-us) and [Latham & Watkins](https://www.lw.com/en/about-us) | Evidence-first writing, factual capability structure, concise institutional prose and generous reading space                     | Unsupported superlatives, dense promotional copy or card-heavy presentation     |

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
  the fold.
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
7. Run `npm run format:check`, `npm test` and a Cloudflare dry run.

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
  weight; batch low-risk maintenance.
- Quarterly: re-check official reference guidance, content accuracy, every locale,
  responsive screenshots and Core Web Vitals.
- For every defect, add or strengthen a reusable test, token, checklist item or
  documented rule so the same class of issue is less likely to recur.

## Definition of done

A change is complete only when it is factual, understandable, responsive from 320
pixels, keyboard accessible, translated across all 14 locales, within the image
budget, free of runtime errors, documented, reviewed through `design-qa.md`, merged
through CI and verified on `https://jmying.com`.
