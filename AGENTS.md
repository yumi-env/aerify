# Aerify contributor instructions

## Project

Aerify is a dark Windows Media Player / Windows 7 Aero inspired Spicetify theme for Spotify's main window. Keep Spotify's navigation, playback behavior, and accessibility intact. `color.ini` defines schemes, `user.css` paints the main window, and `theme.js` displays the conditional bottom-left Up next card. Build the main-window look from WMPotify's SCSS patterns adapted to current Spotify selectors.

## Design boundaries

- Follow `DESIGN.md` and the supplied Aero reference, with the latest graphite main-window direction. Use graphite content, a charcoal-blue sidebar, black transport, restrained cyan accents on existing controls, compact beveled tiles, and a green play control. Do not return to the earlier emerald wash.
- Keep Spotify's native window shell. Do not draw a simulated outer border, fake title bar, or replacement window controls.
- Treat earlier captures and concepts as historical references. Never describe one as a live screenshot of the current source.
- Prefer stable `data-testid`, ARIA, and Spicetify variables over generated Spotify CSS module classes. Confirm new selectors against the installed Spotify version when possible.
- Keep visible keyboard focus, readable text, reduced-motion behavior, and solid-color fallbacks for reduced transparency.
- Keep any substantial WMPotify CSS adaptations attributed with its MIT notice in `THIRD_PARTY_NOTICES.md`. Do not copy WMPotify's image resources or application code.

## Testing

- Do not start or pause music merely to test the theme. Use existing paused or static UI state when possible.
- `node --check theme.js` checks script syntax; `node --test tests/queue-glance.test.js` checks queue-card behavior.
- `spicetify apply` checks installation. Inspect the actual Spotify main window when the desktop is available and label unverified visuals honestly.
- Preserve the user's Spicetify configuration when making local changes.

## Publishing

- Push to `yumi-env/aerify` using the **soulflowxd** GitHub account. Do not use `yumi-env` credentials unless the user explicitly changes this instruction.
- Verify remote files after a push and report which parts were actually tested.
