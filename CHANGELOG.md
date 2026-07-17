# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and Semantic Versioning.

## [Unreleased]

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

[Unreleased]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/TOFU-KNIFE/Jmying/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/TOFU-KNIFE/Jmying/releases/tag/v1.0.0
