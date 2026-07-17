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
- [Apple Store](https://www.apple.com/store) and [Apple scroll-view guidance](https://developer.apple.com/design/human-interface-guidelines/scroll-views): horizontally browsable cards, partial next-item visibility, native gestures and position-aware controls for selected project highlights.
- [Apple localisation guidance](https://developer.apple.com/localization/): test layout, images, dates, text expansion and reading direction across supported locales.
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

- Core radii are limited to 6, 8 and 12 pixels. An 18-pixel radius is reserved for the section 04 carousel cards and its matching detail sheet; compact carousel navigation is the only pill-control exception.
- Content regions use hairline rules and whitespace instead of boxed card grids. Section 04 is a deliberate single-row carousel exception for touch-friendly project browsing, not a general-purpose card grid.
- Main content width is 1,280 pixels with responsive 24/16 pixel side insets.
- Interactive targets are at least 44 × 44 pixels.

### Motion

- Use `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and direct feedback.
- Animate only `transform` and `opacity` on large elements.
- Typical duration is 180–360 milliseconds for controls and 500–880 milliseconds for editorial reveals.
- Honour `prefers-reduced-motion` and never autoplay media.

### Imagery

- Keep the Sonoma landscape as the hero's identity backdrop and the real portrait as the primary professional image.
- Use additional user-provided imagery only when it has a clear editorial role. The abstract blue image supports the working-approach section; the lake image creates a calm, professional close behind the LinkedIn-only contact section.
- Deliver below-fold imagery in responsive WebP and JPEG formats, strip metadata, include explicit dimensions and lazy-load it.
- Use factual or empty alternative text according to whether the image adds meaning or is purely decorative. Never turn decorative imagery into an unsupported personal claim.

## Content and interaction rules

- Lead with identity, professional direction and internship availability.
- Present experience and evidence as horizontal editorial rows separated by simple rules.
- Keep LinkedIn as the only public contact channel.
- Keep controls visible; avoid hidden mobile menus when a short horizontal navigation can reflow or scroll.
- Keep section 04 as a native horizontal scroller with scroll snapping, a visible neighbouring card, previous/next controls, keyboard direction support and logical right-to-left order.
- Preserve keyboard focus, semantic headings, same-origin localisation, right-to-left order and an unmirrored portrait.
- Never add analytics, advertising, contact forms, private details or unsupported claims.
