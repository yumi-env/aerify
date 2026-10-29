/* Aerify paints Document Picture-in-Picture windows opened by Spotify or
   Spicy Lyrics. Theme CSS in the main Spotify document is not guaranteed to
   be present in those separate documents, so we install a small scoped sheet. */
(() => {
  const STYLE_ID = "aerify-pip-style";
  const css = `
    :root { color-scheme: dark; }
    html, body { background: #0b5063 !important; color: #f4fffc !important; font-family: "Segoe UI", Arial, sans-serif !important; }
    body::before { content: ""; position: fixed; inset: 0; border: 1px solid rgba(226,255,255,.72); box-shadow: inset 0 1px rgba(255,255,255,.48), inset 0 0 0 4px rgba(26,133,151,.28); border-radius: 8px; pointer-events: none; z-index: 2147483647; }
    body:not(:has(#SpicyLyricsPage)) { background: linear-gradient(155deg, #278fa2, #0b5265 52%, #082d41) !important; }
    body:not(:has(#SpicyLyricsPage)) button { color: #effffc !important; border-radius: 999px !important; }
    body:not(:has(#SpicyLyricsPage)) button:hover { background: rgba(186,255,239,.19) !important; }
    body:not(:has(#SpicyLyricsPage)) img { border-radius: 5px; box-shadow: 0 2px 10px rgba(0,21,31,.45); }
    body:not(:has(#SpicyLyricsPage)) [data-testid="progress-bar"] { accent-color: #54e3ac; }
    .spicy-pip-wrapper, .spicy-pip-wrapper #SpicyLyricsPage { background: linear-gradient(155deg, #238a9a, #0b5665 53%, #062e41) !important; }
    .spicy-pip-wrapper #SpicyLyricsPage .LyricsContainer .LyricsContent .line.Active { color: #fff !important; text-shadow: 0 1px 3px #063644, 0 0 14px rgba(105,255,219,.56) !important; }
    button:focus-visible, a:focus-visible { outline: 2px solid #d6ff9c !important; outline-offset: 2px; }
    @media (prefers-reduced-transparency: reduce) { html, body, .spicy-pip-wrapper { background: #0b5063 !important; } }
  `;

  function paint(pipWindow) {
    const doc = pipWindow?.document;
    if (!doc || doc.getElementById(STYLE_ID)) return;
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    (doc.head || doc.documentElement).appendChild(style);
  }

  if ("documentPictureInPicture" in window) {
    documentPictureInPicture.addEventListener("enter", (event) => paint(event.window));
    paint(documentPictureInPicture.window);
  }
})();

