# Design QA

- Review date: 2026-07-17
- Release candidate: `1.8.0`
- Scope: desktop hero portrait scale, original market-operations backdrop and interactive experience evidence
- Source visual truth: `/var/folders/fd/wx83dyms6h327z4r0wmz1s680000gn/T/codex-clipboard-258b2e7e-b08e-4cf2-a61b-33af87fe11bc.png`
- Supporting references: Goldman Sachs FICC and Equities, Apple Charts and The Economist visualisation guidance
- Generated source asset: `/Users/jeremmy/.codex/generated_images/019f6e25-89da-7881-a98b-40680293236b/exec-623657d0-ed64-4ebb-a167-4b10e91ce264.png`
- Final desktop: `desktop-market-redesign/final-desktop-1440x1000.png`
- Reference comparison: `desktop-market-redesign/reference-implementation-comparison.png`
- Mobile English: `desktop-market-redesign/after-mobile-390x844-en.png`
- Mobile RTL: `desktop-market-redesign/after-mobile-390x844.png`
- Mobile chart: `desktop-market-redesign/after-mobile-chart-390x844.png`
- Viewports: 1,440 × 1,000; 390 × 844; 320 × 844

## Findings

No actionable P0, P1 or P2 findings remain.

- Composition: the desktop portrait is now a restrained 360 × 520 pixel profile frame at 1,440 pixels, down from a full-height right column. The identity copy remains the primary scan target and the generated trading-floor scene supplies context without competing with the portrait.
- Visual fidelity: the final composition preserves the source mock’s two-part identity/portrait logic while following the user’s requested darker Goldman-inspired trading context. The comparison image confirms that the portrait is materially smaller than the source and the previous implementation.
- Image integrity: the real portrait remains sharp, unmirrored and correctly cropped. Mobile keeps the original Sonoma background. Desktop uses an original, metadata-free 1,600 × 900 market-operations image with no logos, readable figures, third-party artwork or claim of affiliation.
- Disclosure: the market scene is decorative and accompanied by a translated “no affiliation implied” note. It cannot reasonably be read as evidence that Jeremy worked on a trading floor.
- Data truth: the chart contains only three verified ranges already present in the profile—Taylor’s University from 2024 to present, S.C. Wong & Co. from June to September 2025, and CSCEC Malaysia from February to April 2026. No performance, market or proficiency metric was invented.
- Chart design: the final evidence view uses direct role and date labels, three restrained year divisions and the existing navy/blue tokens. The always-visible detail panel makes the selected context understandable without colour alone.
- Interaction: All, Experience and Education filters expose `aria-pressed`; selecting Experience hides Education and automatically selects the first remaining row. Selecting the internship updates its role, date, organisation and description in the polite live region.
- Accessibility: filter targets are 44 pixels high at the 320-pixel minimum width. The chart region is keyboard focusable, buttons retain visible focus, important information is repeated in semantic text and the reduced-motion/forced-colour rules cover the new controls.
- Localisation: all 14 locale bundles contain the ten new strings. English LTR and Arabic RTL mobile states were inspected; dynamic details are refreshed after locale changes and dates continue to use `Intl.DateTimeFormat`.
- Responsive behaviour: document-level horizontal overflow is zero at 1,440, 390 and 320 pixels. The 680-pixel chart plot scrolls only inside its labelled region on narrow screens while the page itself remains fixed to the viewport.
- Performance: desktop and mobile each preload only their relevant hero asset. The new 1,600-pixel WebP is 59 KiB and the JPEG fallback is 137 KiB, both within the 350 KiB public-image budget.
- Runtime: `npm test` passes syntax, 14-locale parity, responsive image, security and Cloudflare dry-run checks.

## Comparison history

### P1 — evidence chart expanded the mobile document

- Earlier measurement: the 680-pixel plot increased a 390-pixel page to 737 pixels wide.
- Fix: set the timeline, evidence panel and chart scroller to a zero minimum width, with overflow contained by the labelled chart region.
- Post-fix result: the document reports 390/390 pixels at the standard mobile viewport and 320/320 pixels at the minimum viewport; the chart retains a 317-pixel client area with native horizontal scrolling.

### P2 — short ranges could not carry full date labels

- Earlier evidence: the June–September and February–April bars reduced their labels to ambiguous ellipses.
- Fix: moved dates beside their directly labelled roles and kept the range bars as proportional visual marks.
- Post-fix result: every button exposes a complete accessible name such as “Finance & Accounting Intern — Feb–Apr 2026”, and the mobile plot keeps every date visible before interaction.

## Implementation checklist

- [x] Desktop portrait reduced without changing the real image.
- [x] Original responsive desktop market backdrop added with a clear disclosure.
- [x] Mobile Sonoma backdrop and portrait-first order preserved.
- [x] Timeline uses verified profile data only.
- [x] Filters, selection, live details and keyboard semantics verified.
- [x] English LTR, Arabic RTL, 390-pixel mobile and 320-pixel minimum width checked.
- [x] Reference and implementation placed in one visual comparison.
- [x] Internationalisation, quality, security and Cloudflare dry-run checks pass.

final result: passed
