# JMYING brand symbol

The current identity is the user-supplied `interlaced_03_transparent.svg`, provided on 2026-11-17. The source is a transparent, single-colour interlaced mark with fill `#133578` and a 600 × 600 viewBox. Do not redraw, stretch or recolour its individual paths.

## Sources

- `jmying-symbol-master.svg`: exact supplied vector; SHA-256 `ebb81dd64618be186f6fd1b18a4b50f67ff38de4964d1455d2657a1574746ae3`.
- `../../public/brand/jmying-symbol.svg`: identical web vector used by the navigation.
- `jmying-symbol-master.png`: 1024 × 1024 transparent rendering of the current vector.

Previous generated artwork is retained in Git history; it is superseded by this user-supplied mark.

## Exports

Render with `rsvg-convert`, retaining the complete source viewBox and aspect ratio. Transparent normal icons are exported at 192 and 512 pixels. Browser tabs use `../../public/favicon.svg`: the original symbol scaled uniformly within a white rounded rectangle, with transparent outer corners. Render its 32-pixel PNG fallback directly from that vector. The 180-pixel Apple icon renders the source at 164 pixels on the same backing. The separate 512-pixel maskable icon renders the source at 360 pixels, centred with 76-pixel insets on an opaque backing to protect the diagonal tips from launcher masks.

## Navigation

Show the vector, a decorative vertical divider and live `JMYING` text, in that physical left-to-right order even in RTL locales. Keep the logo decorative within the labelled home link, reserve its dimensions and retain the original link's 44-pixel target. Navigation links use a medium weight. Review desktop, narrow mobile, RTL and dark/forced-colour modes after changes. Revision all icon and stylesheet URLs when exports change.
