# Design QA

- Review date: 2026-07-17
- Release candidate: `1.9.0`
- Scope: user-provided Hero photograph, neutral-black overlay and yearbook portrait placement
- Hero source: `/Users/jeremmy/Downloads/hero photo.png`
- Portrait source: `public/portrait.jpg`
- Desktop Hero: `qa/desktop-hero.png`
- Desktop profile: `qa/desktop-profile.png`
- Mobile Hero: `qa/mobile-hero.png`
- Mobile profile: `qa/mobile-profile.png`
- Hero comparison: `qa/hero-comparison.jpg`
- Portrait comparison: `qa/portrait-comparison.jpg`
- Viewports: 1,440 × 1,000; 390 × 844; 320 × 844

## Findings

No actionable P0, P1 or P2 findings remain.

- Hero fidelity: the supplied 1,659 × 948 photograph remains unmirrored and is delivered without invented scenery, logos or compositing. The comparison confirms that the implementation preserves the original subject, desk and monitor composition.
- Overlay: desktop uses a neutral-black tonal overlay that is strongest behind the copy and lighter over the rest of the photograph. Mobile applies a uniform 24% black overlay only to the image stage, then places copy on the existing institutional-navy surface.
- Copy placement: the desktop title stays in the left editorial column and does not cover the subject’s eyes or central facial features. Mobile separates photography and copy so the portrait remains legible at narrow widths.
- Yearbook treatment: the formal portrait is moved below the Hero into Professional profile, retains its native 4:5 ratio, neutral background, top-of-head clearance and head-and-shoulders framing, and is not filtered or cropped.
- Responsive layout: the portrait is 280 pixels wide at 1,440 and 390 pixel viewports, then scales to 230 pixels at the 320-pixel minimum width. It remains centred on mobile and aligned with the editorial grid on desktop.
- Image delivery: the Hero uses metadata-stripped 800- and 1,600-pixel WebP/JPEG sources. The 1,600-pixel WebP is 81 KiB and the JPEG fallback is 167 KiB. The below-Hero portrait lazy-loads its 480-pixel WebP at the tested desktop and mobile widths.
- Accessibility: the decorative Hero image has empty alternative text; the meaningful profile image is labelled “Yearbook portrait of Jeremy Ying.” Hero buttons remain 48 pixels high at 320 pixels and the mobile Menu exposes its expanded state.
- Runtime: no console errors or warnings were recorded. `npm test` passes syntax, 14-locale parity, responsive-image, security and Cloudflare dry-run checks.
- Overflow: document width equals viewport width at 1,440, 390 and 320 pixels.

## Reference basis

The presentation follows common US school yearbook guidance rather than claiming a national standard: vertical orientation, a clear head-and-shoulders view, space above the head, neutral background and high-resolution source. The source portrait already satisfies the selected 4:5 implementation ratio, so no destructive recrop was needed.

## Implementation checklist

- [x] User-provided Hero photograph replaces the previous generated backdrop on every viewport.
- [x] Neutral-black overlay is lighter than the previous navy treatment.
- [x] Formal portrait moved below the Hero into Professional profile.
- [x] Native 4:5 portrait ratio, orientation, colour and image integrity preserved.
- [x] Desktop, standard mobile and minimum-width layouts verified.
- [x] Mobile Menu state and 48-pixel Hero actions verified.
- [x] Reference and implementation placed in combined visual comparisons.
- [x] Internationalisation, quality, security and Cloudflare dry-run checks pass.

final result: passed
