# Design QA

- Review date: 2026-07-17
- Release candidate: `1.6.0`
- Scope: mobile navigation, hero composition and vertical layout rhythm
- Primary references: `mobile-institutional-audit/04-goldman-mobile-hero.png`, `mobile-institutional-audit/06-cravath-mobile-hero.png`, `mobile-institutional-audit/07-apple-mobile-hero.png`
- Same-view comparison: `mobile-institutional-audit/26-reference-implementation-final-comparison.png`
- Final implementation: `mobile-institutional-audit/25-jmying-mobile-final-v160.png`
- Minimum-width evidence: `mobile-institutional-audit/27-jmying-mobile-final-320-en.png`
- Localisation evidence: `mobile-institutional-audit/28-jmying-mobile-final-320-de.png`, `mobile-institutional-audit/30-jmying-mobile-final-320-ar.png`
- Menu evidence: `mobile-institutional-audit/29-jmying-mobile-final-320-de-menu.png`
- Desktop regression evidence: `mobile-institutional-audit/21-jmying-desktop-regression-v160.png`

## Outcome

No open P0, P1 or P2 findings remain.

- Reference adaptation: the final page adopts the reference pattern of a compact single-row header, an image-first mobile hero, a restrained editorial type scale and an early primary action. It retains JMYING’s own wordmark, real portrait, Sonoma backdrop, factual copy and institutional palette.
- Header: the mobile header is 56.5 pixels high with a 44-pixel labelled Menu control and a 44-pixel language-code control. The desktop header remains 76.5 pixels high and continues to expose the full five-item navigation.
- Menu: the five links appear in a two-column hairline-rule panel rather than an overflowing strip. Every link is 50 pixels high. Menu, language and navigation labels are translated across all 14 locales.
- Hero: the portrait stage is 320 pixels high at a 320-pixel viewport and 343 pixels high at 390 pixels. The crop keeps the face and upper body clear, the portrait is not mirrored in RTL, and the Sonoma image remains visible behind the identity copy.
- Information order: at 390 × 844 pixels, the first viewport contains the portrait, professional-profile caption, name, role, positioning statement, availability and primary LinkedIn action. At the 320-pixel minimum, the same sequence remains legible without document overflow.
- Content rhythm: mobile section padding is 70 pixels, section titles are 40 pixels and numbered editorial rows retain their hierarchy with tighter vertical spacing. The profile and section 04 carousel remain readable at 390 pixels.
- Localisation: all 69 required strings are present in all 14 locale bundles. German long text and its five navigation labels fit at 320 pixels. Arabic switches the header and menu to logical right-to-left order while the English name and portrait remain correctly oriented.
- Interaction: Menu toggles `aria-expanded`, closes on Escape, closes after selecting a destination, closes on outside pointer input and automatically resets above the mobile breakpoint. Opening the language dialog also closes the menu.
- Accessibility: header controls measure at least 44 × 44 pixels, menu links measure 142 × 50 pixels at 320 pixels, focus is visible, the existing skip link remains intact and reduced-motion rules continue to suppress animation.
- Runtime: 320-, 390-, 430- and 1,440-pixel layouts have no document-level horizontal overflow. The selected mobile browser reported no console errors or warnings.

## Iteration history

### P1 — clipped mobile navigation

- Finding: the previous two-row horizontal navigation was about 107 pixels high at 390 pixels and clipped the Credentials destination.
- Correction: replaced it below 820 pixels with a single-row header and a labelled, two-column Menu panel.
- Verification: all five destinations are visible at 320 pixels in English, German and Arabic, with 50-pixel link targets and no page overflow.

### P1 — identity delayed below the first viewport

- Finding: the previous portrait and caption occupied roughly 406 pixels below the 107-pixel header, pushing the name and professional direction too far down the page.
- Correction: set a deliberate mobile portrait height, reduced the caption and tightened the identity-copy spacing without removing either image.
- Verification: the 390-pixel comparison shows the name, role, availability and LinkedIn action in the first viewport while preserving an uncropped face and readable caption.

### P2 — mobile editorial scale

- Finding: 44-pixel section titles and 82-pixel section padding created unnecessary vertical drift on smaller phones.
- Correction: reduced the mobile section title to 40 pixels, section padding to 70 pixels and tightened numbered-row spacing.
- Verification: the profile section and section 04 remain clearly separated, scan-friendly and consistent with the reference sites’ mobile hierarchy.

### P2 — first menu layout remained a flex row

- Finding: the first menu implementation inherited the desktop flex display and still placed all five items on one line.
- Correction: explicitly changed the mobile navigation panel to a two-column grid.
- Verification: English, German and Arabic menu captures show complete labels with no clipping.

## Release gates

- [x] Goldman Sachs reference and implementation reviewed together at the same 390 × 844 viewport.
- [x] 320 × 720, 390 × 844, 430 × 932 and 1,440 × 1,000 layouts checked.
- [x] English, German long text and Arabic right-to-left layout checked.
- [x] Menu pointer, destination, outside-click and Escape paths checked.
- [x] 44-pixel targets, visible focus, image preservation and document overflow checked.
- [x] Desktop navigation, section 04 carousel and profile layout regression-checked.
- [x] Internationalisation, quality, security and Cloudflare dry-run checks included in `npm test`.

final result: passed
