# Design QA

- Review date: 2026-07-17
- Release candidate: `1.4.0`
- Official visual references: `typography-audit/01-goldman-sachs-desktop.png`, `typography-audit/09-cravath-desktop.png`, `typography-audit/11-skadden-capabilities-desktop.png`
- User-provided visual references: the preserved Sonoma hero, abstract blue approach image and lake contact image
- Same-view reference comparison: `final-audit/17-reference-implementation-comparison.png`
- Desktop implementation: `final-audit/02-local-desktop-hero-en.png`, `final-audit/05-local-desktop-approach-lead.png`, `final-audit/06-local-desktop-connect.png`
- Responsive implementation: `final-audit/11-local-mobile-hero-en.png`, `final-audit/12-local-mobile-approach-en.png`, `final-audit/13-local-mobile-approach-list-en.png`, `final-audit/14-local-320-hero-en.png`
- Localisation implementation: `final-audit/15-local-320-approach-de.png`, `final-audit/16-local-mobile-approach-ar.png`
- Preference evidence: `final-audit/19-dark-reduced-motion.png`, `final-audit/20-reduced-transparency.png`
- Automated evidence: `final-audit/18-lighthouse-final.json`

## Outcome

No open P0, P1 or P2 findings remain.

- Typography and hierarchy: Helvetica Neue-first interface text is paired with a restrained system-serif display hierarchy. The scale, line height, weight and reading measures follow the reference sites' editorial logic without using proprietary Goldman Sachs fonts.
- Layout and scan path: identity, factual profile, experience, working approach, highlights, credentials and contact follow a clear recruiter scan path. Numbered evidence rows, hairline rules and generous reading space reflect the strongest institutional patterns from Goldman Sachs, Cravath and Skadden without copying their brand layouts.
- Image fidelity: the Sonoma backdrop and real portrait remain in the hero. Two selected user images are used with distinct editorial roles, responsive WebP/JPEG sources, explicit dimensions, stripped metadata and below-fold lazy loading.
- Copy and claims: the new working-approach copy restates demonstrated document, accounting-system, Python and AI-assisted work habits. It adds no unsupported proficiency, impact, affiliation or private information.
- Localisation: all 65 interface/content keys are present in all 14 locale bundles. German at 320 pixels and Arabic RTL at 390 pixels have no page-level horizontal overflow; the portrait remains unmirrored.
- Accessibility and interaction: semantic headings, list structure, skip link, focus containment, Escape close, visible focus, 44-pixel targets, reduced motion, reduced transparency, dark mode, increased contrast and forced-colour rules are preserved. The short mobile navigation intentionally scrolls horizontally inside its own container while the page remains overflow-free.
- Performance: final Lighthouse scores are 100 Performance, 100 Accessibility, 100 Best Practices and 100 SEO. Lab metrics were FCP 0.8 seconds, LCP 1.4 seconds, CLS 0 and TBT 0 milliseconds.

## Iteration history

### P1 — accessible language-button name

- Finding: Lighthouse reported that the custom `aria-label` for the language button did not contain its visible language code, creating a WCAG 2.5.3 label-in-name mismatch.
- Correction: removed the redundant custom accessible name so the control derives its name directly from the translated visible label and code.
- Verification: the final Lighthouse run reports no failed binary accessibility audits and an Accessibility score of 100.

### P2 — minimum-width and long-text resilience

- Finding checked: the fifth navigation destination and the new working-approach text could have caused overflow at narrow widths or in longer translations.
- Result: at 320 pixels the document and body widths equal the client width. The navigation alone scrolls within a 296-pixel container; German and Arabic content wrap without page overflow.

## Runtime checks

- All four responsive images loaded successfully; the browser selected WebP sources.
- English, German and Arabic locale changes completed through the language dialog.
- The Arabic document direction is `rtl` and the portrait transform is `none`.
- Navigation targets resolve to all five visible sections and active-state tracking updates.
- All visible links and buttons measure at least 44 pixels on mobile.
- Browser console reported no errors or warnings.
- The LinkedIn-only contact route is unchanged and no data-collection surface was added.

## Release gates

- [x] Same-view source and implementation comparison completed.
- [x] Desktop, 390-pixel mobile and 320-pixel minimum width checked.
- [x] English, German long text and Arabic RTL checked.
- [x] Dark mode, reduced motion and reduced transparency rules checked.
- [x] Lighthouse performance, accessibility, best-practices and SEO review passed.
- [x] Internationalisation, quality, security and Cloudflare dry-run checks included in `npm test`.

final result: passed
