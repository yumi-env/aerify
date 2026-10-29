/* Document Picture-in-Picture has a separate document. Paint only that
   document; Spotify and Spicy Lyrics retain their own controls and behavior. */
(() => {
  const STYLE_ID = "aerify-pip-style";
  const css = `
    :root { color-scheme: dark; --aerify-cyan: #43bdd2; --aerify-deep: #043d38; --aerify-mint: #1dbb80; }
    html, body {
      color: #f5fffb !important;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif !important;
      background: radial-gradient(ellipse at 78% 58%, rgba(164,222,49,.33), transparent 40%),
        radial-gradient(ellipse at 35% 23%, rgba(28,190,141,.24), transparent 48%),
        linear-gradient(135deg, #0b6b66 0%, #064b3f 40%, #043d38 100%) !important;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      pointer-events: none;
      border: 3px solid var(--aerify-cyan);
      border-radius: 8px;
      box-shadow: inset 0 0 0 1px #dbffff, inset 0 5px 9px rgba(246,255,255,.24), inset 0 -3px rgba(2,30,28,.48);
    }
    body::after {
      content: "";
      position: fixed;
      inset: 3px 3px auto;
      height: 18px;
      z-index: 2147483645;
      pointer-events: none;
      border-radius: 5px 5px 0 0;
      background: linear-gradient(180deg, rgba(227,255,255,.42), rgba(103,222,235,.18) 48%, transparent 100%);
    }
    :is([data-testid="now-playing-bar"], [data-testid="player-controls"], .ContentBox .NowBar) {
      background: linear-gradient(180deg, #5d9790 0%, #1b4e48 8%, #0b2929 23%, #041413 100%) !important;
      border-top: 1px solid #c6fff4;
      box-shadow: inset 0 2px rgba(255,255,255,.2);
    }
    :is(button[aria-label="Play"], button[aria-label="Pause"], [data-testid="control-button-playpause"]) {
      color: #064836 !important;
      background: linear-gradient(180deg, #f0fff1 0%, #a9f9c7 38%, #35c88c 51%, #087448 100%) !important;
      border: 1px solid #d0ffe3 !important;
      border-radius: 50% !important;
      box-shadow: inset 0 1px #fff, inset 0 -2px rgba(3,72,46,.42), 0 1px 5px rgba(0,19,24,.55) !important;
    }
    :is(button[aria-label="Play"], button[aria-label="Pause"], [data-testid="control-button-playpause"]):hover { filter: brightness(1.1); }
    :is([data-testid="progress-bar"], [role="slider"]) { accent-color: var(--aerify-mint); }
    img { border-radius: 4px; box-shadow: 0 2px 8px rgba(0,21,22,.48); }
    .spicy-pip-wrapper, #SpicyLyricsPage {
      color: #f5fffb !important;
      background: radial-gradient(ellipse at 80% 64%, rgba(174,227,46,.24), transparent 45%),
        linear-gradient(145deg, #0b716b, #064b3f 50%, #043d38) !important;
    }
    #SpicyLyricsPage .LyricsContainer .LyricsContent .line { color: #cde9e1 !important; }
    #SpicyLyricsPage .LyricsContainer .LyricsContent .line.Active,
    #SpicyLyricsPage .LyricsContainer .LyricsContent .line.active {
      color: #fff !important;
      text-shadow: 0 1px 3px #052d2c, 0 0 12px rgba(122,255,196,.43) !important;
    }
    button:focus-visible, a:focus-visible { outline: 2px solid #d6ff9c !important; outline-offset: 2px; }
    @media (prefers-reduced-transparency: reduce) {
      html, body, .spicy-pip-wrapper, #SpicyLyricsPage { background: #064b3f !important; }
      body::after { display: none; }
    }
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
  const PLAYER_BAR = '[data-testid="now-playing-bar"], [aria-label="Now playing bar"], .main-nowPlayingBar-nowPlayingBar, .Root__now-playing-bar';
  let timer;
  let retries = 0;
  let lastText = "";

  function trackDetails(item) {
    const track = item?.track || item;
    const metadata = track?.metadata || item?.metadata || {};
    const title = metadata.title || track?.name;
    if (!title) return null;
    const artists = track?.artists;
    const artist = metadata.artist_name || track?.artist_name ||
      (Array.isArray(artists) ? artists.map((entry) => entry?.name).filter(Boolean).join(", ") : "");
    return { title, artist };
  }

  function firstTrack(items) {
    if (!Array.isArray(items)) return null;
    for (const item of items) {
      const details = trackDetails(item);
      if (details) return details;
    }
    return null;
  }

  // Spotify can show the next context song in Now Playing while the public
  // queue snapshots are empty. Read only that visible, already-rendered panel.
  function nextFromNowPlayingView() {
    const panel = document.querySelector('[role="complementary"][aria-label="Now playing view"], aside[aria-label="Now playing view"]');
    if (!panel?.querySelectorAll) return null;
    const heading = Array.from(panel.querySelectorAll("h2, h3, [role='heading']"))
      .find((node) => node.textContent?.trim() === "Next in queue");
    const section = heading?.closest?.("section") || heading?.parentElement?.parentElement;
    const group = section?.querySelector?.('[role="group"]');
    if (!group) return null;
    const title = group.querySelector?.('a[href*="/track/"]')?.textContent?.trim()
      || group.getAttribute?.("aria-label")?.trim();
    if (!title) return null;
    const artist = Array.from(group.querySelectorAll?.('a[href*="/artist/"]') || [])
      .map((link) => link.textContent?.trim()).filter(Boolean).join(", ");
    return { title, artist };
  }

  function render() {
    if (document.visibilityState === "hidden") return;
    const host = document.querySelector(PLAYER_BAR);
    const api = window.Spicetify;
    if (!host || !api) return;

    const next = firstTrack(api.Queue?.nextTracks) || firstTrack(api.Player?.data?.next_tracks)
      || nextFromNowPlayingView();
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
      card.setAttribute("role", "status");
      card.innerHTML = '<span class="aerify-up-next__icon" aria-hidden="true"></span><span class="aerify-up-next__details"><span class="aerify-up-next__label">Up next</span><span class="aerify-up-next__song"></span><span class="aerify-up-next__artist"></span></span>';
      document.body.appendChild(card);
    }

    const { title, artist } = next;
    const text = artist ? `${title} · ${artist}` : title;
    if (text !== lastText) {
      card.querySelector(".aerify-up-next__song").textContent = title;
      card.querySelector(".aerify-up-next__artist").textContent = artist || "";
      card.setAttribute("aria-label", `Up next: ${text}`);
      lastText = text;
    }
  }

  function mount() {
    if (!window.Spicetify?.Player || !document.querySelector(PLAYER_BAR)) {
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
