# Aerify design system

## Intent

Give Spotify's main window the tactile depth of a dark Windows Media Player and Windows 7 Aero interface. Start from WMPotify's source-level control and layout patterns, then adapt them to Spotify's current DOM without replacing navigation or playback. Keep Spotify's native window shell. The supplied Aero Spotify composite informs the glass and control details; the current direction is graphite rather than emerald and has no simulated outer border or title bar.

## Color

`color.ini` is the source for Spicetify's semantic schemes. The default `Aero` scheme uses graphite content (`#222222`), a charcoal-blue sidebar (`#20282E`), a near-black player (`#101010`), cool light text (`#E0E4EC`), a cyan accent (`#50B5D0`), and a green primary action (`#1CAB79`). Cyan belongs on controls, selected states, and small glass reflections; it does not tint the whole content surface. `Aero Blue` is a separate cooler scheme.

## Geometry and material

- Native shell: retain Spotify's real title bar and window controls. Do not draw a full-window border, fake title strip, or replacement controls with `body` pseudo-elements.
- Main content: layered graphite and charcoal surfaces. Let album art provide the strongest color.
- Cards: compact rectangles with fine pale borders, subtle inset highlights, and enough contrast for text.
- Controls: WMP11 inspired split-gloss bevels with clear normal, hover, pressed, disabled, and keyboard-focus states.
- Transport: continuous dark deck, a raised green play control, compact secondary controls, and a recessed progress track.
- Up next: a separate small card above the bottom-left transport area, present only when the next song is known. It should not obscure player controls.

## Interaction and accessibility

Spotify owns navigation and playback. Aerify changes paint and adds the read-only Up next card. Segoe UI is the first-choice font on Windows, with system fallbacks elsewhere. Text must stay readable over glass, focus must be visible, reduced motion must remove decorative transitions, and reduced transparency must keep opaque surfaces.

## Source and verification

WMPotify's SCSS is the source foundation for WMP11 control proportions, split-gloss states, compact panes, and transport geometry. Aerify adapts these patterns to current Spotify selectors under the MIT notice in `THIRD_PARTY_NOTICES.md`; it does not include WMPotify's image assets or application code. Verify the final main-window appearance in a live Spotify screenshot. Older captures and concepts are historical references, not evidence of the current theme.
