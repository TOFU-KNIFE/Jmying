# JMYING Archive 2.0 guidance

The user requested a complete RhineLabUI-based major migration. The root app uses TypeScript, Three.js and Vite. Read README.md and docs/RHINELAB_MIGRATION.md. Keep source/asset license notices and attribution.

Preserve factual public-profile content, LinkedIn-only professional contact, the classic fourteen-locale fallback, keyboard navigation and motion/quality preferences. Never add private contact data, analytics or remote executable scripts. Keep main releasable; build/test before PR, wait for green quality, merge normally and verify Cloudflare production. Do not bypass repository protections.

Use npm ci, npm test, npm run test:browser. New active browser tests are in tests/v2. Root content is content/archives.json. Public build output is dist, not public. Nonproduction Cloudflare builds must use wrangler versions upload.
