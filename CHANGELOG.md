# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and Semantic Versioning.

## [Unreleased]

### Changed

- Limited automated Cloudflare deployment to merged `main` changes and grouped GitHub Actions dependency updates.
- Pinned the Node.js and Wrangler toolchain and enabled npm dependency caching for reproducible CI.

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

[Unreleased]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.2.0...v1.3.1
[1.2.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/TOFU-KNIFE/Jmying/releases/tag/v1.0.0
