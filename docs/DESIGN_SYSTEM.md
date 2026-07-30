# JMYING institutional design system

This design system keeps JMYING recognisably independent while applying public,
verifiable interaction and visual principles from Claude/Anthropic and Goldman
Sachs. It must not use their logos, names as endorsements, proprietary artwork or
layouts that could imply affiliation.

## Sources and interpretation

- [Claude design guidelines](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines): adaptive layouts from 320 pixels, 44 × 44 pixel targets, limited type hierarchy, limited radii, structural colour tokens, visible controls, WCAG AA contrast, keyboard access and light/dark support.
- [Claude frontend quality rubric](https://www.anthropic.com/engineering/harness-design-long-running-apps): deliberate typography, spacing, colour, contrast, usability and a distinct identity instead of generic template patterns.
- [GS Design System engineering principles](https://developer.gs.com/blog/posts/engineering-principles-of-the-gs-design-system): consistent concepts, clear action hierarchy, cross-browser/mobile support and accessibility.
- [Goldman Sachs Digital Design Language System](https://goldmansachs.papirfly.com/readimage.aspx?down=1&pubid=fbb8d2c1-1bce-4486-8bd6-64b50f5bc88b): clean headers, simple rules instead of boxed modules, flat presentation without gradients or 3D decoration, concise naming, Helvetica Neue compatibility and warm, natural, current photography.
- [Goldman Sachs homepage](https://www.goldmansachs.com): current public evidence for wide editorial hierarchy, restrained institutional blue, strong image/copy relationships and direct navigation.
- [Goldman Sachs type story](https://view.ceros.com/goldman-sachs/type-story-ii-1-2-1-1-1): clear, contemporary and credible type, with open forms, compact proportions and a strong reading hierarchy.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines): clear hierarchy, visual harmony, consistent interaction and layouts that adapt without losing meaning.
- [Apple: Get to know the new design system](https://developer.apple.com/videos/play/wwdc2025/356/): official guidance for fixed, capsule and concentric shapes, including nested-radius balance across compact and spacious interfaces.
- [Apple Charts guidance](https://developer.apple.com/design/human-interface-guidelines/charts): communicate a small number of facts, align charts with surrounding UI, reduce unnecessary grid density and keep critical information available without interaction.
- [Apple Store](https://www.apple.com/store) and [Apple scroll-view guidance](https://developer.apple.com/design/human-interface-guidelines/scroll-views): horizontally browsable cards, partial next-item visibility, native gestures and position-aware controls for selected project highlights.
- [Apple localisation guidance](https://developer.apple.com/localization/): test layout, images, dates, text expansion and reading direction across supported locales.
- [Apple typography guidance](https://developer.apple.com/design/human-interface-guidelines/typography): prefer the platform system typefaces, keep the number of families restrained and express hierarchy through size, weight and spacing.
- [W3C Japanese layout requirements](https://www.w3.org/TR/jlreq/), [Chinese layout requirements](https://www.w3.org/TR/clreq/) and [Thai layout requirements](https://www.w3.org/TR/thai-lreq/): preserve script-native line breaking, solid CJK composition, punctuation behaviour and enough vertical space for Thai marks.
- [Noto usage guidance](https://notofonts.github.io/noto-docs/website/use/): use script-specific families, match Sans and Serif within a script, limit weight variants and use UI cuts for compact Southeast Asian interfaces.
- [Microsoft multilingual UI font guidance](https://learn.microsoft.com/en-us/globalization/fonts-layout/multi-script-fonts): include native Windows UI fallbacks such as Yu Gothic UI, Microsoft JhengHei UI and Leelawadee UI instead of relying on a Latin font to select every glyph.
- [CSS Borders and Box Decorations Level 4](https://drafts.csswg.org/css-borders/#corner-shaping): the standards definition for progressive `corner-shape: squircle` rendering on the web.
- [The Economist visualisation interview](https://education.economist.com/insights/interviews/tips-for-visualising-data-like-the-economist) and [chart style guide](https://design-system.economist.com/documents/CHARTstyleguide_20170505.pdf): favour simple chart forms, a limited palette, direct labels and one restrained highlight colour when emphasis is needed.
- [Cravath](https://www.cravath.com/) and [Skadden capabilities](https://www.skadden.com/capabilities): current examples of evidence-first professional writing, numbered editorial structure and clear capability taxonomy.
- [Deloitte brand refresh](https://www.deloitte.com/an/en/about/story/purpose-values/brand-makeover.html) and [Green Dot history](https://www.deloitte.com/cbc/en/about/governance/network-brand-alliances/becoming-the-green-dot.html): consistency across services, geographies and devices, plus the value of one simple recognisable anchor.
- [EY brand expansion](https://www.ey.com/en_gl/newsroom/2024/10/ey-unveils-shape-the-future-with-confidence-brand-expansion): a stable core identity can support restrained shape variation without losing recognition.
- [PwC Global Annual Review 2025](https://www.pwc.com/jp/ja/about-us/annual-review/pdf/annual-review-2025en.pdf): the “momentum mark” is a current example of using abstract movement to express forward progress.
- [KPMG Make the Difference campaign](https://kpmg.com/fr/fr/media/press-releases/2026/01/make-the-difference-nouvelle-campagne-marque.html): trust, clarity, ingenuity and measurable impact provide a useful professional-tone benchmark.

The historical Goldman Sachs manual is treated as supporting evidence, not as a
current licence to reproduce brand assets. Current public pages and the project's
own content constraints take precedence.

## Foundations

### Typography

- English and other Latin-script body/interface text uses `Helvetica Neue`, Helvetica and Arial. Locale-specific stacks place native system faces first so punctuation, numerals and local glyphs share compatible metrics instead of being assembled from a Latin-first fallback chain.
- Simplified Chinese pairs PingFang SC / Microsoft YaHei UI / Noto Sans SC body text with Songti SC / Noto Serif SC display text. Traditional Chinese pairs PingFang TC / Microsoft JhengHei UI / Noto Sans TC with Songti TC / Noto Serif TC.
- Japanese pairs Hiragino Sans / Yu Gothic UI / Noto Sans JP with Hiragino Mincho / Yu Mincho / Noto Serif JP. Korean pairs Apple SD Gothic Neo / Malgun Gothic / Noto Sans KR with a restrained AppleMyungjo / Batang / Noto Serif KR display stack.
- Thai uses Thonburi / Leelawadee UI / Sarabun / Noto Sans Thai UI at every level. Arabic likewise retains its native sans stack. Neither script is forced into an unrelated Western serif.
- Vietnamese shares the Latin Helvetica-first stack and the Unicode-ranged JMYing Sans/JMYing Serif fallbacks, whose selected Inter and Source Serif 4 subsets cover Vietnamese diacritics.
- The site self-hosts Unicode-ranged Inter and Source Serif 4 fallbacks for Latin and Vietnamese. They load from the same origin only when a preferred system face is unavailable; no third-party font service or blanket preload is used.
- Do not download or redistribute Goldman Sachs proprietary fonts. The project adopts the public site's hierarchy principles, not its brand assets.
- Display titles use 58–88 pixels at 0.96 line height and weight 400. Section titles use 44–72 pixels at 1.0 line height and weight 400.
- Subheads use 22–27 pixels at 1.3 line height and weight 500. Reading text uses 16–18 pixels at 1.65 line height and stays within roughly 62 characters.
- CJK section titles use a slightly smaller 40–64 pixel range with 1.08–1.14 line height. Thai and Arabic titles use 1.18–1.22 line height; their subheads use 1.5–1.55 so above- and below-base marks are never clipped.
- Labels and metadata use 10–13 pixels. Latin uppercase tracking stays between 0.08 and 0.14 em; CJK labels use only 0.03–0.04 em; Korean, Thai and Arabic remain solid set with no added tracking.
- Keep Latin display tracking moderate, usually −0.035 em. Never apply tight Latin tracking to CJK, Korean, Thai, Arabic or other complex scripts.
- Keep headings start-aligned in every locale and use weight, size, spacing and rules—not colour alone—to express hierarchy.

### Colour

- Warm neutral surfaces: `#FAF9F5`, `#F5F4ED`, `#FFFFFF`.
- Primary text: `#141413`; secondary text: `#3D3D3A`.
- Institutional blue header: `#AFC7E5`; dark authority surface: `#071A33`.
- Information accent: `#3266AD`; success is reserved for availability.
- Dark mode maps the same semantic roles to Claude-compatible dark neutrals.
- Avoid decorative gradients. A restrained tonal overlay may be used only to keep text readable on photography. Colour never carries meaning alone.

### Identity

- The primary symbol is a pure graphic device: three connected planes around one clear aperture. It represents evidence, structured review and clarity without using initials, letters or an accounting cliché.
- Keep the symbol in institutional navy, warm white and pale blue. The compact palette ensures recognition without competing with content.
- Preserve its rounded-square silhouette, internal negative space and square safe area. Never stretch, rotate, add a word inside it or introduce effects.
- Reserve the symbol for browser chrome, Apple touch and install surfaces. It does
  not participate in the webpage layout.
- Keep the navigation identity as accessible live `JMYING` text. Do not place,
  overlay or rasterise the graphic inside the page.
- Broad professional-brand references inform clarity and consistency only. Do not reproduce Deloitte's green dot, EY's yellow beam, PwC's stacked warm-colour blocks or KPMG's boxed wordmark.

### Shape and spacing

- Core fallback radii are limited to 8, 12, 22 and 28 pixels: compact indicators, controls and nested surfaces, medium containers, then editorial cards and dialogs.
- Treat pills as a separate shape, not as an oversized radius token. Filters and carousel controls remain true capsules; ordinary buttons and dense header controls remain smooth rounded rectangles.
- Preserve concentric hierarchy when surfaces nest. Inner surfaces use a visibly smaller radius than their parent, and spacing must keep corners from appearing pinched or flared.
- Apply `corner-shape: squircle` only as progressive enhancement. `border-radius` remains the complete fallback in browsers that do not implement CSS Corner Shaping.
- Let clipping, borders, shadows and focus outlines follow the same host element. Do not fake continuous corners with masks, generated assets or decorative wrappers.
- Borrow Apple's geometric discipline without imitating Liquid Glass branding or adding translucent decoration that competes with professional content.
- Content regions use hairline rules and whitespace instead of boxed card grids. Section 04 is a deliberate single-row carousel exception for touch-friendly project browsing, not a general-purpose card grid.
- Main content width is 1,280 pixels with responsive 24/16 pixel side insets.
- Desktop navigation uses a 68-pixel row and shares the same 1,280-pixel start and end lines as the hero copy and section content.
- Interactive targets are at least 44 × 44 pixels.

### Motion

- Use `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and direct feedback.
- Animate only `transform` and `opacity` on large elements.
- Typical duration is 180–360 milliseconds for controls and 500–880 milliseconds for editorial reveals.
- Honour `prefers-reduced-motion` and never autoplay media.
- Motion studies require an explicit, keyboard-accessible Play/Replay control and
  a polite status announcement. Keep the complete static composition visible
  before playback rather than presenting an empty media frame.
- Detach optional motion sources until the visitor requests playback. Keep
  `preload="none"`, reveal video only after its first decoded frame and reset it
  when the module leaves the viewport or the page becomes hidden.
- Reduced-motion, constrained-connection, print and media-error states show the
  complete static preview and do not make animation the only route to meaning.
- A playing label may temporarily disable repeated activation, but the control
  must return as Replay after completion. Do not bind essential playback to hover.

### Imagery

- Use the user-provided desk photograph as the responsive Hero image. Keep its natural colour, treat it as contextual editorial photography and use only a restrained neutral-black overlay for copy legibility.
- Place the formal portrait in the Professional profile section below the Hero. Preserve its native 4:5 ratio, unmirrored orientation, neutral background, head-and-shoulders framing, headroom and eye line; do not crop or filter the source image.
- Keep the yearbook portrait between roughly 220 and 280 pixels wide, pair it with a simple editorial caption and lazy-load it because it sits below the Hero.
- Use additional user-provided imagery only when it has a clear editorial role. The abstract blue image gives the AI & Data Challenge card a distinct project visual; the lake image creates a calm, professional close behind the LinkedIn-only contact section.
- Treat the AI × Accounting collage as a supporting interaction study below
  Selected highlights, not as a replacement Hero or a factual claim. Keep its
  people, accounting tools and review screens inside one namespaced module, with
  a centred crop on narrow screens and a complete static fallback.
- Deliver below-fold imagery in responsive WebP and JPEG formats, strip metadata, include explicit dimensions and lazy-load it.
- Use factual or empty alternative text according to whether the image adds meaning or is purely decorative. Never turn decorative imagery into an unsupported personal claim.

## Content and interaction rules

- Lead with identity, professional direction and internship availability.
- Keep Professional profile explicitly asymmetrical: yearbook portrait on the left, start-aligned summary on the right and evidence rows beneath. On narrow screens retain the left-image/right-copy relationship, then let the evidence rows span the full width.
- Present experience and evidence as horizontal editorial rows separated by simple rules.
- The interactive evidence timeline may visualise only dates and descriptions already stated in the profile. Use direct role/date labels, three year divisions, the institutional navy/blue palette and an always-visible detail summary. Filtering must work with keyboard, touch and pointer input, expose `aria-pressed` state and never make interaction the only route to critical information.
- Keep LinkedIn as the only public contact channel.
- Keep primary mobile controls visible in a compact 56-pixel header. When the full five-item navigation no longer fits without clipping, expose it through a clearly labelled, keyboard-accessible Menu control and keep the language code visible beside it.
- Keep section 04 as a native horizontal scroller with scroll snapping, a visible neighbouring card, previous/next controls, keyboard direction support and logical right-to-left order.
- Preserve keyboard focus, semantic headings, same-origin localisation, right-to-left order and an unmirrored portrait.
- Never add analytics, advertising, contact forms, private details or unsupported claims.
