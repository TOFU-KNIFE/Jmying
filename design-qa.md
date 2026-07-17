# Design QA

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
