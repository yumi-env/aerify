# Aerify contributor instructions

## Project

Aerify is a Spicetify theme inspired by Windows Vista and Windows 7 Aero media players. Keep Spotify's navigation, playback behavior, and accessibility intact. `color.ini` defines the schemes, `user.css` paints Spotify and Spicy Lyrics, and `theme.js` paints separate Document Picture-in-Picture windows.

## Design boundaries

- Follow `DESIGN.md` and the supplied Aero/Windows Media Player direction. Keep the cyan glass frame, teal content, dark transport bar, and green play control coherent across the main UI and mini player.
- Treat `preview/aerify-preview.svg` as a concept illustration. Never describe it as a live Spotify screenshot.
- Spicy Lyrics is optional and maintained upstream. Scope its styling under `#SpicyLyricsPage` or `.spicy-pip-wrapper`; do not bundle or copy its implementation.
- Prefer stable `data-testid`, ARIA, and Spicetify variables over generated Spotify CSS module classes. Confirm any new selector against the installed Spotify or Spicy Lyrics version when possible.
- Keep visible keyboard focus, readable text, reduced-motion behavior, and a solid-color fallback for reduced transparency.

## Testing

- Keep lyric tests silent. Use static lyric fixtures for visual checks. Before a live lyric check, mute Spotify and the system audio session, verify both are muted, then start playback only if needed. Stop playback after the check.
- `node --check theme.js` checks script syntax. `spicetify apply` checks that the theme installs. Inspect the actual Spotify window and mini player when the desktop is available; label unverified visuals honestly.
- Do not change the user's Spicetify configuration or install extensions solely to run a test unless the task calls for it. Preserve existing settings when making local changes.

## Publishing

- Push to `yumi-env/aerify` using the **soulflowxd** GitHub account. Do not use `yumi-env` credentials unless the user explicitly changes this instruction.
- Verify the remote files after a push and report which parts were actually tested.

