# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and Semantic Versioning.

## [Unreleased]

## [1.10.0] - 2026-07-17

### Changed

- Reworked Professional profile into an explicitly left-image, right-copy editorial layout across desktop, tablet and mobile widths.
- Consolidated the profile heading and introduction into one start-aligned text column instead of splitting the summary across the page.
- Removed the oversized abstract image from Working approach and rebuilt that section around a cleaner text hierarchy and three-step evidence workflow.
- Reused the blue abstract artwork as the responsive backdrop of the EY Open Science AI & Data Challenge card, where it has a clearer editorial relationship to the content.

## [1.9.0] - 2026-07-17

### Added

- Added the user-provided professional desk photograph as the responsive Hero visual in metadata-stripped WebP and JPEG formats.

### Changed

- Replaced the heavy navy Hero treatment with a restrained neutral-black readability overlay that preserves the photograph's natural colour and detail.
- Moved the formal portrait below the Hero into the Professional profile section and presented it as an uncropped 4:5 yearbook-style head-and-shoulders image.
- Reworked the mobile Hero into an image-first composition with a separate dark content surface, keeping the portrait and profile content immediately below it.

### Fixed

- Added explicit one-week edge-cache rules for every responsive Hero image source.

## [1.8.0] - 2026-07-17

### Added

- Added an original, metadata-free institutional market-operations backdrop for the desktop hero, with an explicit no-affiliation disclosure and responsive WebP/JPEG sources.
- Added a keyboard-accessible, fully translated experience timeline with direct labels, category filters and an `aria-live` supporting-detail panel.

### Changed

- Reduced the desktop portrait from a full-height right column to a restrained 320–360 pixel professional profile frame while preserving the existing mobile portrait treatment and Sonoma background.
- Rebalanced the desktop hero around the established 1,280-pixel grid so identity copy, contextual imagery and the smaller portrait read as a single editorial composition.
- Limited the evidence visualisation to verified education and experience dates already published in the profile, using the site’s navy and institutional-blue palette without invented performance metrics.

## [1.7.0] - 2026-07-17

### Changed

- Reduced the desktop header to a compact 68-pixel institutional row while retaining the complete five-item navigation and language control.
- Aligned the desktop hero copy with the shared 1,280-pixel editorial grid used by the header and following sections.
- Made narrow-desktop hero actions deliberately equal-width and stacked so long translated labels do not wrap into an accidental layout.
- Refined the desktop language control, sticky-section offset and hero viewport calculation without changing the mobile layout, portrait or Sonoma backdrop.

## [1.6.0] - 2026-07-17

### Added

- Added a compact, fully translated mobile Menu with keyboard Escape handling, outside-click dismissal and automatic desktop reset.

### Changed

- Reworked the mobile header into a single compact institutional navigation row inspired by current Goldman Sachs, Cravath and Apple mobile patterns.
- Shortened the mobile portrait stage while preserving the real portrait and Sonoma backdrop, bringing identity, role and availability earlier into the reading flow.
- Tightened mobile section spacing and type scale across 320–560 pixel layouts while retaining 44-pixel controls, long-text wrapping and right-to-left support.

## [1.5.0] - 2026-07-17

### Added

- Added an Apple-inspired horizontal project carousel with scroll snapping, visible previous/next controls, touch gestures and keyboard navigation.
- Added a same-page Learn more dialog that reveals the existing factual project description without introducing unverified claims or external links.
- Added localised carousel labels and actions across all 14 supported languages, including logical right-to-left navigation.

### Changed

- Reworked section 04 from editorial rows into large, responsive project cards while retaining the established Goldman Sachs-derived hierarchy, institutional palette and verified content.
- Extended dark-mode, increased-contrast, forced-colour, reduced-motion and print rules to cover the new carousel and detail dialog.

## [1.4.0] - 2026-07-17

### Added

- Added a multilingual working-approach section that explains evidence handling, clear file structure and practical technology use without expanding the factual claims.
- Added responsive, metadata-stripped versions of two user-provided images for the approach and contact sections while preserving the Sonoma hero backdrop.
- Added a repeatable web quality workflow grounded in official Goldman Sachs, Apple, Claude and leading US law-firm patterns.
- Added an automated quality audit for release-version alignment, responsive-image markup and public image budgets.

### Changed

- Limited automated Cloudflare deployment to merged `main` changes and grouped GitHub Actions dependency updates.
- Pinned the Node.js and Wrangler toolchain and enabled npm dependency caching for reproducible CI.
- Restored the responsive Sonoma landscape as a restrained photographic hero backdrop.
- Reworked the portrait caption so the professional profile label and focus areas remain clear at every viewport size.
- Rebuilt the type hierarchy around lighter editorial display headings, Helvetica-first interface text and more readable line lengths.
- Added script-aware display fallbacks so the hierarchy remains stable across all 14 locales without downloading proprietary brand fonts.
- Extended all 14 locale bundles with the new approach and selected-tool content.
- Refined the pull-request and contributor gates so every visual change carries responsive evidence and passes the documented quality loop.

### Fixed

- Replaced workspace-only package registry references that prevented GitHub Actions and Cloudflare Workers Builds from installing dependencies.

## [1.3.1] - 2026-07-17

### Added

- A documented institutional design system grounded in official Claude and Goldman Sachs public guidance.
- A credentials navigation destination and a recruiter-focused evidence structure.

### Changed

- Rebuilt the visual hierarchy around a calm editorial hero, simple rules, restrained institutional blue and warm neutral surfaces.
- Reworked experience, highlights and credentials into scan-friendly editorial rows instead of card-heavy modules.
- Added adaptive light and dark palettes, 44-pixel minimum targets and more robust mobile reflow from 320 pixels upward.
- Reduced above-the-fold image work to the responsive portrait and removed the decorative landscape from the rendered page.
- Standardised motion on brief transform-and-opacity transitions with nonlinear easing and reduced-motion fallbacks.
- Kept the portrait visible near the top of the mobile reading order and enlarged every compact navigation target to at least 44 pixels.

## [1.2.0] - 2026-07-17

### Added

- Indonesian, Thai, Vietnamese, Brazilian Portuguese and Arabic translations.
- Right-to-left layout support and locale-aware timeline dates.

### Changed

- Adopted Helvetica-first Latin typography with script-appropriate system fallbacks.
- Moved translations into same-origin locale bundles that load only when needed.
- Extended localisation and security audits to cover every locale file and controlled same-origin requests.

## [1.1.0] - 2026-07-17

### Added

- Purposeful nonlinear entrance and dialog motion with reduced-motion support.
- Localised language names, stronger modal isolation and a multilingual consistency audit.
- Contributor, Claude, versioning, CI and pull-request guidance.

### Changed

- Simplified English, Simplified Chinese and Traditional Chinese copy for clarity and more restrained claims.
- Improved locale detection and stopped persisting an automatically detected language.
- Reused language-option elements instead of rebuilding the menu on every switch.
- Added release-version cache busting for CSS and JavaScript.

### Fixed

- Security audit paths now work when the repository path contains spaces.

## [1.0.0] - 2026-07-16

### Added

- Initial secure, responsive and multilingual static profile.

[Unreleased]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.8.0...HEAD
[1.8.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.2.0...v1.3.1
[1.2.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/TOFU-KNIFE/Jmying/releases/tag/v1.0.0
