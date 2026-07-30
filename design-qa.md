# Design QA

## Performance release 1.13.0

- Review date: 2026-07-30
- Scope: responsive image delivery, startup work, offscreen rendering, cache policy and privacy-preserving edge behaviour
- Production mobile baseline: performance 99; FCP 1.6 s; LCP 1.6 s; TBT 0 ms; CLS 0; 92 KiB
- Local mobile candidate: performance 100; accessibility 100; best practices 100; SEO 100; FCP 0.9 s; LCP 1.4 s; CLS 0; 65 KiB
- Local desktop candidate: performance 100; accessibility 100; best practices 100; SEO 100; FCP 0.3 s; LCP 0.4 s; TBT 0 ms; CLS 0; 93 KiB

### Findings

No actionable P0, P1 or P2 performance findings remain.

- The 390-pixel viewport selects `hero-photo-800.avif` and `portrait-320.avif`; the previous 760-pixel portrait overfetch is removed.
- The desktop laboratory viewport selects the new 1,400-pixel Hero source instead of the 1,600-pixel source; Lighthouse reports no remaining image-delivery opportunity.
- The working-approach and connect images remain unfetched at initial load and retain WebP/JPEG fallbacks.
- Hidden language options are absent at startup and all 14 are constructed when the language dialog opens.
- Japanese applies its native font stack after switching at 390 pixels with zero horizontal overflow.
- Below-fold sections use `content-visibility: auto`; carousel geometry activates through a near-viewport observer instead of running during initialisation.
- HTML, AVIF, WebP and JPEG cache headers resolve as specified in the local Cloudflare runtime.
- The Hero crop, overlay, copy contrast and facial detail remain visually consistent in desktop and mobile review.
- Syntax, 14-locale parity, quality, performance, security, formatting and Cloudflare dry-run checks pass.

final result: passed

## Profile and approach release 1.10.0

- Review date: 2026-07-17
- Release candidate: `1.10.0`
- Scope: Professional profile asymmetry, Approach image relocation and project-card reuse
- Desktop profile: `qa/v1.10-profile-desktop.png`
- Tablet profile: `qa/v1.10-profile-tablet.png`
- Mobile profile: `qa/v1.10-profile-mobile.png`
- Desktop Approach: `qa/v1.10-approach-desktop.png`
- Desktop project card: `qa/v1.10-project-card-desktop.png`
- Mobile project card: `qa/v1.10-project-card-mobile.png`
- Profile comparison: `qa/v1.10-profile-comparison.png`
- Approach comparison: `qa/v1.10-approach-comparison.png`
- Viewports: 1,440 × 1,000; 820 × 900; 390 × 844; 320 × 844

## Findings

No actionable P0, P1 or P2 findings remain.

- Profile hierarchy: the formal 4:5 yearbook portrait is anchored in the left column and the complete title, introduction and capability evidence are aligned in one right-hand editorial column. The former split summary no longer produces a centred reading path.
- Responsive profile: at 820 pixels the portrait and summary remain side by side while the evidence rows span the full grid below. At 390 and 320 pixels the compact portrait stays left of the summary and the evidence rows continue below without compressing the copy into an unreadable column.
- Image relocation: the blue abstract image has been removed from the working-method lead. The section now uses a concise editorial introduction followed immediately by the three-step workflow, so the image no longer competes with procedural content.
- Project context: the same blue image now supports the first AI and data challenge card. A dark navy overlay preserves white-text contrast and the image crop remains coherent at desktop and mobile card sizes.
- Interaction: all four `Learn more` controls remain available; opening the first control presents the expected project dialog with title, result and description.
- Motion and loading: the relocated image retains responsive WebP/JPEG sources, lazy loading and the existing non-linear reveal behaviour. The card reaches full opacity after its reveal transition.
- Overflow: document width equals viewport width at 1,440, 820, 390 and 320 pixels.
- Runtime: `npm test` passes syntax, 14-locale parity, quality, security and Cloudflare dry-run checks.

## Comparison result

The side-by-side profile comparison confirms that the new version removes the long cross-page eye movement between title and introduction. The Approach comparison confirms that the oversized decorative image has been replaced by a tighter information hierarchy; its visual value is retained in the AI/Data project card instead of being discarded.

## Implementation checklist

- [x] Professional profile is left-image/right-copy on desktop, tablet and mobile.
- [x] Portrait integrity and 4:5 yearbook framing are preserved.
- [x] Approach lead no longer contains the oversized blue figure.
- [x] Blue abstract image is reused in the first AI & Data project card.
- [x] Desktop, tablet, standard-mobile and minimum-width layouts verified.
- [x] `Learn more` dialog interaction verified.
- [x] Reference and implementation placed in combined visual comparisons.
- [x] Internationalisation, quality, security and Cloudflare dry-run checks pass.

final result: passed
