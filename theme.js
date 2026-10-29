/* Aerify paints Document Picture-in-Picture windows opened by Spotify or
   Spicy Lyrics. Theme CSS in the main Spotify document is not guaranteed to
   be present in those separate documents, so we install a small scoped sheet. */
(() => {
  const STYLE_ID = "aerify-pip-style";
  const css = `
    :root { color-scheme: dark; }
    html, body { background: #146f7b !important; color: #f4fffc !important; font-family: "Segoe UI", Arial, sans-serif !important; }
    body::before { content: ""; position: fixed; inset: 0; border: 1px solid rgba(226,255,255,.72); box-shadow: inset 0 1px rgba(255,255,255,.48), inset 0 0 0 4px rgba(26,133,151,.28); border-radius: 8px; pointer-events: none; z-index: 2147483647; }
    body:not(:has(#SpicyLyricsPage)) { background: radial-gradient(ellipse at 80% 18%, rgba(150,235,55,.34), transparent 50%), linear-gradient(155deg, #45b4c8, #127d83 52%, #084458) !important; }
    body:not(:has(#SpicyLyricsPage)) button { color: #effffc !important; border-radius: 999px !important; }
    body:not(:has(#SpicyLyricsPage)) button:hover { background: rgba(186,255,239,.19) !important; }
    body:not(:has(#SpicyLyricsPage)) img { border-radius: 5px; box-shadow: 0 2px 10px rgba(0,21,31,.45); }
    body:not(:has(#SpicyLyricsPage)) [data-testid="progress-bar"] { accent-color: #54e3ac; }
    .spicy-pip-wrapper, .spicy-pip-wrapper #SpicyLyricsPage { background: radial-gradient(ellipse at 75% 18%, rgba(150,235,55,.31), transparent 50%), linear-gradient(155deg, #41b3c5, #127c7f 53%, #064458) !important; }
    .spicy-pip-wrapper #SpicyLyricsPage .LyricsContainer .LyricsContent .line.Active { color: #fff !important; text-shadow: 0 1px 3px #063644, 0 0 14px rgba(105,255,219,.56) !important; }
    button:focus-visible, a:focus-visible { outline: 2px solid #d6ff9c !important; outline-offset: 2px; }
    @media (prefers-reduced-transparency: reduce) { html, body, .spicy-pip-wrapper { background: #146f7b !important; } }
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

/* Show one next song in a small card above Spotify's player. No network
   requests, queue mutations, playback calls, or DOM-wide observers. */
(() => {
  const ID = "aerify-up-next";
  let timer;
  let retries = 0;
  let lastText = "";

  function render() {
    if (document.visibilityState === "hidden") return;
    const host = document.querySelector('[data-testid="now-playing-bar"], [aria-label="Now playing bar"], .main-nowPlayingBar-nowPlayingBar, .Root__now-playing-bar');
    const api = window.Spicetify;
    if (!host || !api) return;

    const next = api.Queue?.nextTracks?.find((item) => item?.metadata?.title)
      || api.Player?.data?.next_tracks?.find((item) => item?.metadata?.title);
    let card = document.getElementById(ID);
    if (!next) {
      card?.remove();
      lastText = "";
      return;
    }

    if (!card) {
      card = document.createElement("div");
      card.id = ID;
      card.className = "aerify-up-next";
      card.innerHTML = '<span class="aerify-up-next__icon" aria-hidden="true"></span><span class="aerify-up-next__details"><span class="aerify-up-next__label">Up next</span><span class="aerify-up-next__song"></span><span class="aerify-up-next__artist"></span></span>';
      document.body.appendChild(card);
    }

    const title = next.metadata.title;
    const artist = next?.metadata?.artist_name;
    const text = artist ? `${title} · ${artist}` : title;
    if (text !== lastText) {
      card.querySelector(".aerify-up-next__song").textContent = title;
      card.querySelector(".aerify-up-next__artist").textContent = artist || "";
      card.setAttribute("aria-label", `Up next: ${text}`);
      lastText = text;
    }
  }

  function mount() {
    if (!window.Spicetify?.Player || !document.querySelector('[data-testid="now-playing-bar"], [aria-label="Now playing bar"], .main-nowPlayingBar-nowPlayingBar, .Root__now-playing-bar')) {
      if (retries++ < 60) setTimeout(mount, 500);
      return;
    }
    render();
    window.Spicetify.Player.addEventListener("songchange", render);
    document.addEventListener("visibilitychange", render);
    timer = setInterval(render, 15000);
    window.addEventListener("pagehide", () => clearInterval(timer), { once: true });
  }

  mount();
})();
