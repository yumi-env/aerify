const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const code = fs.readFileSync(path.join(__dirname, '..', 'theme.js'), 'utf8');

function setup(queueTracks = [], playerTracks = [], nowPlayingPanel = null) {
  const song = { textContent: '' };
  const artist = { textContent: '' };
  const attributes = {};
  const body = { card: null, appendChild(card) { this.card = card; } };
  const document = {
    body,
    visibilityState: 'visible',
    querySelector(selector) { return selector.includes('Now playing view') ? nowPlayingPanel : null; },
    getElementById() { return body.card; },
    createElement() {
      return {
        setAttribute(key, value) { attributes[key] = value; },
        querySelector(selector) { return selector.endsWith('__song') ? song : artist; },
        remove() { body.card = null; },
      };
    },
    addEventListener() {},
  };
  const callbacks = {};
  const player = {
    data: { next_tracks: playerTracks },
    addEventListener(name, callback) { callbacks[name] = callback; },
    play() { throw new Error('theme must never start playback'); },
    pause() { throw new Error('theme must never alter playback'); },
  };
  const window = {
    Spicetify: { Queue: { nextTracks: queueTracks }, Player: player },
    addEventListener() {},
  };
  vm.runInNewContext(code, { window, document, setInterval() {}, setTimeout() {}, fetch() { throw new Error('theme must not fetch'); } });
  return { window, body, song, artist, attributes, callbacks };
}

test('queue card falls back to automatic player-state track and disappears when none exists', () => {
  const state = setup([], [{ metadata: { title: 'Next Song', artist_name: 'Artist' } }]);
  assert.equal(state.song.textContent, 'Next Song');
  assert.equal(state.artist.textContent, 'Artist');
  assert.equal(state.attributes.role, 'status');
  assert.equal(state.attributes['aria-label'], 'Up next: Next Song · Artist');

  state.window.Spicetify.Player.data.next_tracks = [{ metadata: { title: 'Another Song' } }];
  state.callbacks.songchange();
  assert.equal(state.song.textContent, 'Another Song');
  state.window.Spicetify.Player.data.next_tracks = [];
  state.callbacks.songchange();
  assert.equal(state.body.card, null);
});

test('explicit queue takes priority and nested or context tracks are normalized', () => {
  const state = setup(
    [{ track: { name: 'Queued Song', artists: [{ name: 'First' }, { name: 'Second' }] } }],
    [{ metadata: { title: 'Automatic Song', artist_name: 'Auto Artist' } }],
  );
  assert.equal(state.song.textContent, 'Queued Song');
  assert.equal(state.artist.textContent, 'First, Second');

  state.window.Spicetify.Queue.nextTracks = [{ invalid: true }];
  state.callbacks.songchange();
  assert.equal(state.song.textContent, 'Automatic Song');
});

test('no card is shown for an empty or unresolved next track', () => {
  const state = setup([{ metadata: {} }], [{ metadata: {} }]);
  assert.equal(state.body.card, null);
});

test('visible Now Playing group name fills an empty API snapshot without a track link', () => {
  const group = {
    innerText: 'I Feel It Coming\nThe Weeknd\nDaft Punk',
    querySelector() { return null; },
    getAttribute() { return null; },
    querySelectorAll() { return [{ textContent: 'The Weeknd' }, { textContent: 'Daft Punk' }]; },
  };
  const heading = { textContent: 'Next in queue', compareDocumentPosition() { return 4; } };
  const panel = { querySelectorAll(selector) { return selector.includes('group') ? [group] : [heading]; } };
  const state = setup([], [], panel);
  assert.equal(state.song.textContent, 'I Feel It Coming');
  assert.equal(state.artist.textContent, 'The Weeknd, Daft Punk');
});

