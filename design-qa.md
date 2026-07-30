# Design QA

## Near-viewport motion release 1.15.0

- Review date: 2026-07-30
- Scope: single near-viewport playback, user stop control, institutional
  introductory copy, 14-locale parity and same-origin autoplay policy
- Viewports: 1,280 × 720; 390 × 844; 320 × 720
- Locales reviewed in browser: English, German, Japanese and Arabic
  right-to-left
- States: ready, loading, playing, stopped, complete, replay, reduced motion,
  constrained connection and rejected automatic playback

### Findings

No actionable P0, P1 or P2 findings remain.

- The initial document keeps the MP4 detached: its `src` is absent, its state is
  Ready and the page has no initial motion-media transfer.
- A 1% intersection threshold with a 15% lower root margin starts one muted,
  inline playback attempt shortly before the module enters the viewport. The
  attempt is consumed once and does not restart after the visitor stops the
  motion or leaves and re-enters the activation region.
- The 5.2-second sequence exposes an enabled Stop control while loading or
  playing. Stop immediately restores the stable start frame, returns the video
  to zero and changes the control back to Play; completion changes it to Replay.
- Manual Play and Replay remain available after a stop, completion or rejected
  browser autoplay attempt. A blocked automatic attempt resolves to Ready,
  while an actual media error resolves to the static fallback.
- Reduced-motion, Save-Data, 2G and slow-2G paths continue to use the complete
  static preview without attaching the MP4. Hiding the page or leaving the
  activation region during playback pauses and resets the sequence.
- The Permissions Policy permits autoplay only for same-origin media. The
  Content Security Policy continues to limit media to the same origin; the
  video remains muted, inline, non-looping and `preload="none"`.
- The previous descriptive sentence is replaced by institutional language that
  connects accounting evidence, structured review, AI-assisted analysis,
  control and human judgement without implying autonomous decision-making.
- All 14 locale bundles contain the revised introduction plus Play, Stop,
  Replay and every live status message. German, Japanese and Arabic were
  inspected at 320 pixels with no horizontal overflow; Arabic retains correct
  right-to-left document direction.
- Browser testing found no console warnings or errors. Automated formatting,
  syntax, localisation, quality, performance, security and Cloudflare dry-run
  gates cover the remaining static, connection and policy states.

final result: passed

## AI × Accounting interaction release 1.14.0

- Review date: 2026-07-30
- Scope: homepage module extraction, manual media playback, multilingual states,
  responsive cropping, accessibility fallbacks and same-origin delivery
- Viewports: 1,440 × 1,000; 820 × 900; 390 × 844; 320 × 720
- Locales: English, German, Japanese, Thai and Arabic right-to-left
- States: ready, preparing, playing, complete, reduced motion, constrained
  connection, media error and print

### Findings

No actionable P0, P1 or P2 findings remain.

- The prototype is embedded as a supporting interaction study after the Selected
  highlights carousel. It does not introduce a second Hero, navigation system,
  framework runtime or unsupported professional claim.
- Only three deployable, metadata-reviewed assets were extracted. The 5.2-second
  H.264 MP4 and two WebP frames total 1,965,442 bytes; source portraits, editable
  layers, reference recordings and research documents remain outside `public/`.
- The complete static composition lazy-loads at low priority. The MP4 remains a
  detached `data-src` with `preload="none"` until the visitor explicitly chooses
  Play, so it does not affect the initial page transfer.
- The start frame remains visible until the first decoded video frame is ready.
  This preserves a stable visual hand-off instead of flashing between separately
  rendered assets.
- Playback has a 44-pixel keyboard-accessible Play/Replay control and a polite
  live status. Repeated activation is disabled while preparing or playing, and
  the control returns to Replay after completion.
- Reduced-motion and constrained-connection visitors receive the complete static
  preview without a motion-media request. Media errors, printing, page hiding and
  offscreen playback also resolve to a stable static or reset state.
- The wide stage preserves its full desktop composition and uses a centred crop
  on narrow screens without introducing horizontal document overflow.
- Module titles, explanation, action labels and status messages are present in
  all 14 locale bundles. Logical layout and the centred media crop remain stable
  in Arabic right-to-left mode.
- The Content Security Policy allows only same-origin media, and the dedicated
  media path uses immutable caching with image indexing disabled.
- The module remains independent of critical profile content: all identity,
  experience, project and contact information is available without playing it.

### Extraction and release workflow

1. Inspect the handoff archive without executing source code.
2. Keep only the finished motion sequence and static frames required by the
   browser; exclude source and research directories from `public/`.
3. Verify dimensions, duration, codec, file size, hashes and metadata.
4. Integrate the sequence into the existing native HTML/CSS/JavaScript system
   with namespaced classes and no extra font or framework bundle.
5. Add complete locale keys, reduced-motion/static behaviour, CSP and cache
   rules.
6. Review desktop, minimum-width, long-text, CJK/Thai and right-to-left states;
   then run formatting, syntax, localisation, quality, performance, security and
   Cloudflare dry-run gates before release.
7. After merge, verify the production media MIME type, immutable cache header,
   static fallback, manual playback and absence of console or network errors.

final result: passed

## Browser identity release 1.13.4

- Review date: 2026-07-30
- Scope: pure graphic browser/install identity, page-layout exclusion, asset
  management and release documentation
- Viewports: 1,440 × 1,000; 390 × 844; 320 × 720
- Locales: German, Japanese and Arabic right-to-left

### Findings

No actionable P0, P1 or P2 findings remain.

- The final symbol contains no letter, monogram or typographic glyph. Its
  three-plane silhouette and central aperture remain recognisable at 32 pixels.
- The webpage navigation contains only the live-text `JMYING` wordmark. No symbol
  image, symbol class or raster identity participates in desktop or mobile page
  layout.
- The symbol is limited to the revisioned 32-pixel favicon, 180-pixel Apple touch
  icon and 192/512-pixel web-app manifest assets.
- The desktop header remains 68 pixels high; mobile controls remain 44 pixels high.
  No horizontal overflow appears at 1,440, 390 or 320 pixels.
- German long text, Japanese type and Arabic mirrored navigation retain their
  existing hierarchy. The Arabic document reports `dir="rtl"` and no overflow.
- Browser inspection reports no console warnings or errors and resolves the
  expected favicon, Apple touch icon and manifest declarations.
- Production header review removed an overlapping `/brand/*` rule after confirming
  that the PNG wildcard already covers nested icon paths, preventing duplicate
  cache directives while preserving one-year immutable delivery.
- The transparent master and deterministic exports have explicit provenance and
  regeneration rules in `assets/brand/README.md`.
- Syntax, 14-locale parity, identity, quality, performance, security and Cloudflare
  dry-run checks pass.

final result: passed

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
