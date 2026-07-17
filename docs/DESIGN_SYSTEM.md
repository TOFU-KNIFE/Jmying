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
- [CSS Borders and Box Decorations Level 4](https://drafts.csswg.org/css-borders/#corner-shaping): the standards definition for progressive `corner-shape: squircle` rendering on the web.
- [The Economist visualisation interview](https://education.economist.com/insights/interviews/tips-for-visualising-data-like-the-economist) and [chart style guide](https://design-system.economist.com/documents/CHARTstyleguide_20170505.pdf): favour simple chart forms, a limited palette, direct labels and one restrained highlight colour when emphasis is needed.
- [Cravath](https://www.cravath.com/) and [Skadden capabilities](https://www.skadden.com/capabilities): current examples of evidence-first professional writing, numbered editorial structure and clear capability taxonomy.

The historical Goldman Sachs manual is treated as supporting evidence, not as a
current licence to reproduce brand assets. Current public pages and the project's
own content constraints take precedence.

## Foundations

### Typography

- Body and interface stack: `Helvetica Neue`, Helvetica, Arial, then script-appropriate system fallbacks.
- Display stack: system serif faces led by `Iowan Old Style` and Baskerville. Chinese and Japanese use native system serif fallbacks; Korean, Thai and Arabic retain their tested sans-serif stacks.
- Do not download or redistribute Goldman Sachs proprietary fonts. The project adopts the public site's hierarchy principles, not its brand assets.
- Display titles use 58–88 pixels at 0.96 line height and weight 400. Section titles use 44–72 pixels at 1.0 line height and weight 400.
- Subheads use 22–27 pixels at 1.3 line height and weight 500. Reading text uses 16–18 pixels at 1.65 line height and stays within roughly 62 characters.
- Labels and metadata use 10–13 pixels. Uppercase tracking is limited to short labels and stays between 0.08 and 0.14 em.
- Keep display tracking moderate, usually −0.035 em. Never apply tight Latin tracking to Arabic or complex scripts.
- Keep headings start-aligned in every locale and use weight, size, spacing and rules—not colour alone—to express hierarchy.

### Colour

- Warm neutral surfaces: `#FAF9F5`, `#F5F4ED`, `#FFFFFF`.
- Primary text: `#141413`; secondary text: `#3D3D3A`.
- Institutional blue header: `#AFC7E5`; dark authority surface: `#071A33`.
- Information accent: `#3266AD`; success is reserved for availability.
- Dark mode maps the same semantic roles to Claude-compatible dark neutrals.
- Avoid decorative gradients. A restrained tonal overlay may be used only to keep text readable on photography. Colour never carries meaning alone.

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

### Imagery

- Use the user-provided desk photograph as the responsive Hero image. Keep its natural colour, treat it as contextual editorial photography and use only a restrained neutral-black overlay for copy legibility.
- Place the formal portrait in the Professional profile section below the Hero. Preserve its native 4:5 ratio, unmirrored orientation, neutral background, head-and-shoulders framing, headroom and eye line; do not crop or filter the source image.
- Keep the yearbook portrait between roughly 220 and 280 pixels wide, pair it with a simple editorial caption and lazy-load it because it sits below the Hero.
- Use additional user-provided imagery only when it has a clear editorial role. The abstract blue image gives the AI & Data Challenge card a distinct project visual; the lake image creates a calm, professional close behind the LinkedIn-only contact section.
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
