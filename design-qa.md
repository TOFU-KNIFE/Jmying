# Design QA

- Review date: 2026-07-17
- Release candidate: `1.5.0`
- Scope: section 04, “Selected projects and challenges”
- Primary reference: `carousel-audit/11-apple-cards-1280x720.png`
- Same-view comparison: `carousel-audit/13-reference-implementation-comparison.png`
- Desktop implementation: `carousel-audit/12-jmying-carousel-1280x720.png`
- Mobile implementation: `carousel-audit/09-jmying-carousel-mobile-settled.png`
- Localisation evidence: `carousel-audit/10-jmying-carousel-mobile-ar.png`, `carousel-audit/14-jmying-carousel-mobile-de.png`
- Detail-dialog evidence: `carousel-audit/07-jmying-learn-more-dialog.png`, `carousel-audit/15-jmying-dialog-mobile-de.png`
- Automated evidence: `carousel-audit/16-lighthouse-final.json`

## Outcome

No open P0, P1 or P2 findings remain.

- Reference adaptation: the section uses the Apple Store pattern of large rounded cards, a horizontal native scroller, a neighbouring-card preview and visible navigation. It keeps JMYING’s existing serif/Helvetica hierarchy, institutional blues and factual project content rather than copying Apple products, imagery or brand assets.
- Desktop layout: at 1,280 × 720 pixels, the 1,280-pixel scroller contains four 371 × 480 pixel cards with 20-pixel gaps. Three cards are readable and the fourth is deliberately visible at the edge.
- Mobile layout: at 390 × 844 pixels, each card is 320 × 430 pixels with a 14-pixel gap and a visible adjacent-card edge. The page remains 390 pixels wide; only the labelled carousel scrolls horizontally.
- Interaction: touch/trackpad scrolling, previous/next controls and keyboard arrows share the same native scroll track. Paging is based on the available scroll range, so desktop reaches the end in one meaningful step while mobile advances card by card.
- Learn more: each card opens a native modal dialog containing the existing translated result and description. It adds no new claim or external destination. Escape closes the dialog, body scrolling unlocks and focus returns to the triggering button.
- Localisation: all 68 required strings are present in all 14 locale bundles. German long text wraps inside the mobile card and dialog. Arabic uses logical right-to-left order; its Next action moves the track from `0` to `-334` pixels and keyboard Arrow Left advances to `-667` pixels.
- Accessibility: the track has a translated list name, controls are at least 44 pixels high, disabled states match the scroll boundary, the modal is labelled and described, focus is visible and reduced-motion mode switches scripted movement to `auto`.
- Preferences: the carousel and modal extend the existing dark, increased-contrast, forced-colour, reduced-motion and print rules. Their motion uses transform/opacity or native scrolling with nonlinear easing; no autoplay or decorative media was added.
- Performance: Lighthouse reports 100 Performance, 100 Accessibility, 100 Best Practices and 100 SEO. Final lab metrics were FCP 1.0 seconds, LCP 1.4 seconds, CLS 0 and TBT 40 milliseconds.

## Iteration history

### P1 — initial-page scroll position

- Finding: the first implementation used `scrollIntoView` to align a card, which could also move the page vertically during initial locale application.
- Correction: replaced it with a horizontal-only calculation on the carousel’s own `scrollLeft`.
- Verification: a fresh homepage load remains at `scrollY = 0`; natural carousel clicks preserve the page scroll position.

### P1 — desktop end-state accuracy

- Finding: per-card index controls could advance internally after the wide desktop scroller had already reached its maximum horizontal offset.
- Correction: based disabled states and paging on the actual logical scroll range, with one card-width step clamped by the native scroller.
- Verification: desktop moves from `0` to its 313-pixel maximum and disables Next; mobile advances through the full 963-pixel range.

### P1 — English accessible list name

- Finding: English is captured from the HTML fallback, so the new attribute-only carousel label initially resolved as `undefined`.
- Correction: added the HTML aria label to the English fallback object while keeping translated attribute values for the other locales.
- Verification: the accessibility tree exposes `Selected projects carousel`; Lighthouse reports no failed accessibility audits.

### P2 — modal typography

- Finding: the native dialog initially used the browser’s default font instead of the page’s type tokens.
- Correction: explicitly applied the interface stack to the dialog and the display stack to its project title.
- Verification: desktop and German mobile dialog captures now match the site hierarchy and remain within the viewport without internal overflow.

## Runtime checks

- Four cards, four Learn more buttons, one labelled list and one native modal are present.
- Previous is disabled at the logical start; Next is disabled at the logical end in LTR and RTL.
- Keyboard Arrow Right advances in English; Arrow Left advances in Arabic.
- German and Arabic mobile pages have no document-level horizontal overflow.
- Escape closes the detail dialog and restores focus to its Learn more trigger.
- Browser console reported no errors or warnings.
- The Sonoma hero backdrop, portrait, LinkedIn-only contact route and privacy controls are unchanged.

## Release gates

- [x] Apple source and implementation captured at the same 1,280 × 720 viewport and reviewed in one comparison image.
- [x] Desktop, 390-pixel mobile, German long text and Arabic RTL checked.
- [x] Touch/pointer, buttons, keyboard navigation, boundary states and Learn more modal checked.
- [x] Dark, reduced-motion, increased-contrast, forced-colour and print rules reviewed.
- [x] Lighthouse performance, accessibility, best-practices and SEO review passed.
- [x] Internationalisation, quality, security and Cloudflare dry-run checks included in `npm test`.

final result: passed
