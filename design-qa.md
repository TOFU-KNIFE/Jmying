# Design QA

## Direction

The page follows the current Apple platform-design direction without copying Apple branding or proprietary assets:

- content-first composition
- translucent material reserved for navigation and interactive controls
- opaque content surfaces for hierarchy and readability
- bold, left-aligned typography
- consistent concentric corner radii
- adaptive desktop and mobile layouts
- restrained motion and clear focus states
- nonlinear, compositor-friendly entrance motion with a no-motion alternative

## Tested viewports

- Desktop: 1440 × 1000
- Mobile: 390 × 844
- Mobile language selector: 390 × 844
- Simplified Chinese mobile state: 390 × 844
- German long-text mobile state: 390 × 844
- Thai complex-script mobile state: 390 × 844
- Arabic right-to-left mobile state: 390 × 844

## Interaction checks

- [x] Browser-language detection works
- [x] Manual language selection works
- [x] Language choice persists locally
- [x] Automatically detected language is not persisted as an explicit choice
- [x] Language names adapt to the active interface language
- [x] Locale bundles load on demand from the same origin
- [x] Timeline dates adapt to the active locale
- [x] Arabic mirrors directional layout without mirroring photography or the Latin name
- [x] Language dialog opens, closes, traps focus, and responds to Escape
- [x] Active desktop navigation state updates as sections enter view
- [x] Copy-site action works with a safe fallback
- [x] LinkedIn is the only professional contact path
- [x] No phone, email, form, public vCard, or GitHub contact button exists
- [x] External LinkedIn links use `noopener`, `noreferrer`, and `no-referrer`

## Responsive and accessibility checks

- [x] No horizontal overflow at 390 px
- [x] No horizontal overflow in German, Thai or Arabic at 390 px
- [x] Primary actions remain visible at mobile width
- [x] Exactly one H1 and a logical H2 section structure
- [x] Visible keyboard focus treatment
- [x] Reduced-motion support
- [x] Reduced-transparency support
- [x] Increased-contrast support
- [x] Forced-colors fallback
- [x] Primary button color meets normal-text contrast requirements
- [x] No browser console or page errors in desktop/mobile interaction tests

## Build checks

- [x] JavaScript syntax check passed
- [x] Wrangler deployment dry run passed
- [x] Security audit passed
- [x] npm audit reports zero vulnerabilities
- [x] Versioned JavaScript, CSS and locale bundles use immutable caching
- [x] Readable source is retained for maintainability; no source maps are deployed
- [x] Every translation key is present across 14 BCP 47 locales

## Local Lighthouse results

- Desktop: Performance 100, Accessibility 100, Best Practices 100
- Mobile: Performance 99, Accessibility 100, Best Practices 100
- Mobile metrics: FCP 0.8 s, LCP 1.6 s, TBT 20 ms, CLS 0
- Desktop metrics: FCP 0.2 s, LCP 0.4 s, TBT 0 ms, CLS 0
- Local SEO score was 92 because Lighthouse could not download `robots.txt`; the file was separately confirmed as available from the local server.

**final result: passed**
