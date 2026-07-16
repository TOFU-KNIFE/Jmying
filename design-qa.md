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

## Tested viewports

- Desktop: 1440 × 1000
- Mobile: 390 × 844
- Mobile language selector: 390 × 844
- Simplified Chinese mobile state: 390 × 844

## Interaction checks

- [x] Browser-language detection works
- [x] Manual language selection works
- [x] Language choice persists locally
- [x] Language dialog opens, closes, traps focus, and responds to Escape
- [x] Active desktop navigation state updates as sections enter view
- [x] Copy-site action works with a safe fallback
- [x] LinkedIn is the only professional contact path
- [x] No phone, email, form, public vCard, or GitHub contact button exists
- [x] External LinkedIn links use `noopener`, `noreferrer`, and `no-referrer`

## Responsive and accessibility checks

- [x] No horizontal overflow at 390 px
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
- [x] Production JavaScript and CSS minified without source maps

**final result: passed**
