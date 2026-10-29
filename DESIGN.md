# Aerify design system

## Intent

Recreate the feeling of opening a polished Vista/Windows 7 music player: a bright cyan outer shell, deep teal listening surface, raised green play button, and a dark glass transport deck. Spotify's music art remains the colorful content. The theme changes paint, not Spotify's navigation or playback behavior.

## Color

| Role | Value | Use |
| --- | --- | --- |
| Shell cyan | `#0e889c` | Top frame and window light |
| Deep teal | `#064946` | Main listening surface |
| Transport black | `#071b1f` | Playback deck |
| Primary text | `#f4fffc` | Labels and metadata |
| Muted text | `#b6dbd8` | Secondary metadata |
| Play green | `#4be0ae` | Primary playback action and progress |
| Focus lime | `#d6ff9c` | Keyboard focus ring |

`color.ini` also provides an `Aero Blue` alternate scheme. Glass overlays use translucent white and teal above these opaque bases. Text stays opaque for readability.

## Geometry and material

- Frame: fine bright top edge and darker recessed bottom edge; the simulated glass is confined to shell, tiles, controls, and the mini player.
- Cards: 10px radius, thin pale border, modest offset shadow, inset highlight.
- Navigation: mostly 5px radius, compact, with a glowing green-teal selected state.
- Transport: dark continuous strip with a 44px round play control and recessed progress track.
- Lyrics: quiet inactive lines; current line gets white fill and a soft mint light. Artwork is not recolored.
- Compact player: the Spicy Lyrics picture-in-picture window uses the same cyan frame and dark player footer.
- Separate windows: `theme.js` adds a scoped stylesheet to Spotify's Document Picture-in-Picture window so the native mini player and Spicy Lyrics popup share the frame even when the main document's CSS is not copied.

## Type and interaction

Segoe UI is first choice for the Windows era. Trebuchet MS and Arial are fallbacks. Native controls keep their labels, keyboard behavior, and accessible names. Hover increases light and edge contrast; focus uses a visible lime outline. Reduced motion removes Aerify's decorative transitions. Reduced transparency uses an opaque teal shell.

## Source notes

The user-supplied Spotify/Aero composite is the primary target. The Vista desktop and Media Center references inform framing and translucency. Heyclicky's pill buttons inform tactile highlights only; this is intentionally more Windows media player than web landing page.

