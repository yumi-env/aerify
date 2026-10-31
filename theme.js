/* Show one next song in a small card above Spotify's player. No network
   requests, queue mutations, playback calls, or DOM-wide observers. */
(() => {
  const ID = "aerify-up-next";
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
    const panel = document.querySelector('#Desktop_PanelContainer_Id, [data-testid="now-playing-view"], [role="complementary"][aria-label="Now playing view"], aside[aria-label="Now playing view"]');
    if (!panel?.querySelectorAll) return null;
    const heading = Array.from(panel.querySelectorAll("h1, h2, h3, h4, [role='heading']"))
      .find((node) => node.textContent?.trim() === "Next in queue");
    if (!heading) return null;
    const section = heading?.closest?.("section") || heading?.parentElement?.parentElement;
    const localGroups = section?.querySelectorAll?.('[role="group"]');
    const groups = Array.from(localGroups?.length ? localGroups : panel.querySelectorAll('[role="group"]'));
    const group = groups.find((node) => Boolean(heading.compareDocumentPosition?.(node) & 4))
      || section?.querySelector?.('[role="group"]');
    if (!group) return null;
    const artists = Array.from(group.querySelectorAll?.('a[href*="/artist/"]') || [])
      .map((link) => link.textContent?.trim()).filter(Boolean);
    const artist = artists.join(", ");
    const labelId = group.getAttribute?.("aria-labelledby")?.split(/\s+/)[0];
    const labelledTitle = labelId ? document.getElementById(labelId)?.textContent?.trim() : "";
    const rawText = group.innerText || group.textContent || "";
    const textWithoutArtists = artists.reduce((text, name) => text.replace(name, ""), rawText);
    const title = group.querySelector?.('a[href*="/track/"]')?.textContent?.trim()
      || group.getAttribute?.("aria-label")?.trim()
      || labelledTitle
      || textWithoutArtists.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
    if (!title) return null;
    return { title, artist };
  }

  function render() {
    if (document.visibilityState === "hidden") return;
    const api = window.Spicetify;
    if (!api) return;

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
    if (!window.Spicetify?.Player) {
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
