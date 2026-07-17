# Design QA

- Source visual truth: `/Users/jeremmy/.codex/generated_images/019f6e25-89da-7881-a98b-40680293236b/exec-9511fc7a-3347-4de5-a168-4529e0125882.png`
- Supporting official visual references: `design-audit/10-goldman-reference.jpg`, `design-audit/12-claude-design-reference.jpg`, `design-audit/13-claude-guidelines-reference.jpg`, `design-audit/14-gs-design-system-reference.jpg`
- Implementation screenshot: `design-audit/15-institutional-desktop.jpg`
- Viewport: 1440 × 1024 CSS pixels
- State: English, left-to-right, default route, settled entrance motion
- Full-view comparison evidence: `design-audit/16-design-qa-comparison.png`
- Focused hero comparison evidence: `design-audit/22-design-qa-hero-comparison.png`
- Responsive evidence: `design-audit/18-institutional-mobile.jpg`, `design-audit/20-mobile-experience.jpg`, `design-audit/21-german-mobile.jpg`, `design-audit/17-arabic-desktop.jpg`

## Findings

No actionable P0, P1 or P2 findings remain.

- Fonts and typography: the implementation deliberately uses the requested Helvetica Neue-first stack instead of the concept's display serif. Weight, line height, tracking and wrapping are consistent across the hero, editorial rows and 14 locale fallbacks. The difference is an intentional JMYING constraint, not drift.
- Spacing and layout rhythm: the pale institutional header, split identity hero, evidence band and rule-separated sections preserve the concept's hierarchy. The dark photographic hero is intentional because the repository requires a dark photographic identity surface and the current Goldman Sachs reference uses cinematic dark imagery.
- Colours and visual tokens: warm Claude-compatible neutral surfaces, a restricted pale-blue/navy palette, semantic success green and hairline borders are applied consistently. There are no gradients, decorative 3D effects or card-heavy module stacks.
- Image quality and asset fidelity: the real responsive portrait is used at every breakpoint without mirroring in RTL. Cropping remains centred on the face, the photograph stays sharp, and no placeholder or code-drawn visual asset replaces it.
- Copy and content: the name, Accounting (FinTech) direction, Audit & Assurance goal, Feb–Apr 2027 availability, factual experience, credentials and LinkedIn-only contact route remain intact. No unsupported claims or new private details were introduced.
- Accessibility and interaction: semantic headings, skip link, visible focus, modal focus containment, Escape close, same-origin locale loading, locale-aware dates, 44-pixel targets, reduced motion, dark mode, increased contrast and forced colours are preserved.

## Comparison history

### Iteration 1

- Earlier P2 finding: at 390 × 844, the mobile reading order placed the portrait below a long text block, and the wordmark, first navigation item and footer link had one dimension under 44 pixels.
- Fix: moved the portrait to the beginning of the mobile hero, reduced its mobile height to a purposeful editorial crop, and added minimum 44-pixel target dimensions to compact links.
- Post-fix evidence: `design-audit/18-institutional-mobile.jpg`; measured document width was 390 pixels with no horizontal overflow and no interactive target below 44 × 44 pixels.

### Iteration 2

- Earlier findings reviewed: mobile identity visibility and touch-target sizing.
- Post-fix result: both resolved. The 390-pixel German layout also has no horizontal overflow, and the Arabic desktop view reverses layout direction without mirroring the portrait.
- Post-fix evidence: `design-audit/18-institutional-mobile.jpg`, `design-audit/21-german-mobile.jpg`, `design-audit/17-arabic-desktop.jpg`.

## Interactions and runtime checks

- Primary navigation scrolled to Experience and updated the active state.
- The language dialog opened, exposed all 14 locales, changed to Arabic and German, restored English, and closed after selection.
- The copy action displayed the localised `Link copied` status.
- Desktop and mobile browser consoles reported no errors.
- Desktop and 390-pixel mobile layouts reported no horizontal overflow.

## Follow-up polish

- P3: the portrait is intentionally darker than the source mock to support the dark photographic hero. A future photography session could produce a purpose-shot, naturally lit editorial portrait with more negative space while preserving the same crop and layout.

## Implementation checklist

- [x] Match the selected institutional composition and recruiter scan path.
- [x] Preserve the repository's dark photographic hero constraint.
- [x] Apply the source-backed typography, colour, spacing and interaction tokens.
- [x] Verify desktop, mobile, long-text locale and Arabic RTL states.
- [x] Verify primary interactions and console output.
- [x] Run formatting, internationalisation, security and deployment dry-run checks.

final result: passed
