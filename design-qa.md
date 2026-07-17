# Design QA

- Review date: 2026-07-17
- Release candidate: `1.7.0`
- Scope: desktop navigation, hero composition and shared editorial grid
- Source visual truth: `desktop-institutional-audit/16-goldman-desktop-1440x1000-reference.png`
- Previous implementation: `desktop-institutional-audit/01-jmying-desktop-before.png`
- Final implementation: `desktop-institutional-audit/12-jmying-desktop-1440-final-v170.png`
- Viewport and state: 1,440 × 1,000, English, homepage at scroll start
- Full-view comparison: `desktop-institutional-audit/17-reference-implementation-full-comparison.png`
- Focused header comparison: `desktop-institutional-audit/18-reference-implementation-header-comparison.png`
- Narrow-desktop evidence: `desktop-institutional-audit/08-jmying-desktop-900-de-after-v170.png`
- Wide-screen evidence: `desktop-institutional-audit/09-jmying-desktop-1920-after-v170.png`
- RTL evidence: `desktop-institutional-audit/11-jmying-desktop-1440-ar-final-v170.png`
- Mobile regression evidence: `desktop-institutional-audit/13-jmying-mobile-regression-v170.png`
- Section evidence: `desktop-institutional-audit/14-jmying-desktop-profile-v170.png`, `desktop-institutional-audit/15-jmying-desktop-highlights-v170.png`

## Findings

No actionable P0, P1 or P2 findings remain.

- Typography: JMYING retains its established Iowan/Baskerville display stack and Helvetica-first interface stack. The 88-pixel desktop identity title, 22–27 pixel role and 12–18 pixel supporting levels remain optically distinct and do not clip at the tested widths. The Goldman reference is used for hierarchy and density, not for proprietary type assets.
- Spacing and layout: the final 68.5-pixel header is close to the reference’s compact institutional row while preserving 44-pixel controls. At 1,440 pixels, the header, hero copy and following section all begin at x = 80; at 1,920 pixels they all begin at x = 320. The portrait and content grid end on the same corresponding line.
- Colors and tokens: the institutional blue header, dark navy authority surface, warm neutral sections and white primary action remain within the existing design tokens. The desktop language control now rests transparently on the header and gains surface fill only on interaction.
- Image quality: the real portrait remains sharp, correctly cropped and unmirrored in RTL. The Sonoma backdrop is still present beneath the copy with the existing restrained contrast overlay. No source image was replaced, stretched or converted into a code-drawn substitute.
- Copy and content: all professional claims, internship dates, LinkedIn-only contact route and privacy language are unchanged. Long German actions remain legible, and Arabic follows logical reading order without changing the English name or portrait orientation.
- Responsive behavior: at 900 pixels, German actions become two intentional 360 × 48 pixel controls; at 1,024 pixels they fit on one row. The 1,920-pixel layout remains centred on the 1,280-pixel grid. The 390-pixel mobile regression retains its 56.5-pixel header, 343-pixel portrait stage and zero document overflow.
- Interaction and accessibility: full desktop navigation remains visible, active destinations retain their underline, language switching works, section anchors settle below the sticky header and the section 04 Next action advances the track by 400 pixels. Controls remain at least 44 pixels high, focus remains visible and reduced-motion rules are unchanged.
- Runtime: 900-, 1,024-, 1,440- and 1,920-pixel desktop checks have no document-level horizontal overflow. English, German and Arabic RTL were tested. The selected local desktop page reported no console errors or warnings.

## Comparison history

### P2 — desktop hero copy missed the shared grid

- Earlier evidence: `desktop-institutional-audit/01-jmying-desktop-before.png` showed the hero text at x = 104 while the header and Professional profile began at x = 80.
- Fix: removed the extra 24-pixel large-screen start padding and restored it only when the viewport is narrower than the centred 1,280-pixel shell.
- Post-fix evidence: `desktop-institutional-audit/12-jmying-desktop-1440-final-v170.png` and the browser measurements show all three start lines at x = 80.

### P2 — physical padding broke the RTL desktop baseline

- Earlier finding: the first alignment correction used physical left/right padding, leaving Arabic hero copy 100 pixels short of the logical right-hand grid.
- Fix: replaced the physical shorthand with `padding-inline-start` and `padding-inline-end` so the editorial baseline mirrors correctly.
- Post-fix evidence: `desktop-institutional-audit/11-jmying-desktop-1440-ar-final-v170.png` shows the header, eyebrow and name ending at x = 1,360 while the portrait remains unmirrored.

### P2 — translated actions wrapped accidentally at 900 pixels

- Earlier evidence: `desktop-institutional-audit/06-jmying-desktop-900-de-before.png` showed two unequal-width actions wrapping onto separate rows.
- Fix: introduced an 821–940 pixel narrow-desktop state with equal-width stacked actions.
- Post-fix evidence: `desktop-institutional-audit/08-jmying-desktop-900-de-after-v170.png` shows two aligned 360 × 48 pixel controls without text wrapping or overflow.

## Implementation checklist

- [x] Compact 68-pixel desktop header applied without changing the 56-pixel mobile header.
- [x] Header, hero and section content share the same 1,280-pixel editorial grid.
- [x] English, German long text and Arabic right-to-left desktop states checked.
- [x] 900, 1,024, 1,440 and 1,920 pixel desktop widths checked.
- [x] Portrait, Sonoma backdrop, profile section and project carousel preserved.
- [x] Navigation, language switching, section anchors and carousel advance checked.
- [x] Mobile regression, horizontal overflow and console output checked.
- [x] Internationalisation, quality, security and Cloudflare dry-run checks included in `npm test`.

final result: passed
