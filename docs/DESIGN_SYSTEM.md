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

The historical Goldman Sachs manual is treated as supporting evidence, not as a
current licence to reproduce brand assets. Current public pages and the project's
own content constraints take precedence.

## Foundations

### Typography

- Primary stack: `Helvetica Neue`, Helvetica, Arial, then script-appropriate system fallbacks.
- Use a small three-level interface scale: heading, body and caption.
- Use regular and emphasised weights for most content; reserve bold for the name and essential evidence.
- Keep headings left-aligned in LTR locales and logically start-aligned in RTL.

### Colour

- Warm neutral surfaces: `#FAF9F5`, `#F5F4ED`, `#FFFFFF`.
- Primary text: `#141413`; secondary text: `#3D3D3A`.
- Institutional blue header: `#AFC7E5`; dark authority surface: `#071A33`.
- Information accent: `#3266AD`; success is reserved for availability.
- Dark mode maps the same semantic roles to Claude-compatible dark neutrals.
- No gradients. Colour never carries meaning alone.

### Shape and spacing

- Radii are limited to 6, 8 and 12 pixels; full pills are reserved for circular status marks only.
- Content regions use hairline rules and whitespace instead of boxed card grids.
- Main content width is 1,280 pixels with responsive 24/16 pixel side insets.
- Interactive targets are at least 44 × 44 pixels.

### Motion

- Use `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and direct feedback.
- Animate only `transform` and `opacity` on large elements.
- Typical duration is 180–360 milliseconds for controls and 500–880 milliseconds for editorial reveals.
- Honour `prefers-reduced-motion` and never autoplay media.

## Content and interaction rules

- Lead with identity, professional direction and internship availability.
- Present experience and evidence as horizontal editorial rows separated by simple rules.
- Keep LinkedIn as the only public contact channel.
- Keep controls visible; avoid hidden mobile menus when a short horizontal navigation can reflow or scroll.
- Preserve keyboard focus, semantic headings, same-origin localisation, right-to-left order and an unmirrored portrait.
- Never add analytics, advertising, contact forms, private details or unsupported claims.
