const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('queue glance uses player-state tracks when Queue is empty', () => {
  const song = { textContent: '' };
  const artist = { textContent: '' };
  const host = {};
  const body = { card: null, appendChild(card) { this.card = card; } };
  const document = {
    body,
    visibilityState: 'visible',
    querySelector() { return host; },
    getElementById() { return body.card; },
    createElement() {
      return {
        setAttribute() {},
        querySelector(selector) { return selector.endsWith('__song') ? song : artist; },
        remove() { body.card = null; },
      };
    },
    addEventListener() {},
  };
  const callbacks = {};
  const window = {
    Spicetify: {
      Queue: { nextTracks: [] },
      Player: {
        data: { next_tracks: [{ metadata: { title: 'Next Song', artist_name: 'Artist' } }] },
        addEventListener(name, callback) { callbacks[name] = callback; },
      },
    },
    addEventListener() {},
  };
  const code = fs.readFileSync(path.join(__dirname, '..', 'theme.js'), 'utf8');
  vm.runInNewContext(code, { window, document, setInterval() {}, setTimeout() {} });

  assert.equal(song.textContent, 'Next Song');
  assert.equal(artist.textContent, 'Artist');
  window.Spicetify.Player.data.next_tracks = [{ metadata: { title: 'Another Song' } }];
  callbacks.songchange();
  assert.equal(song.textContent, 'Another Song');
  window.Spicetify.Player.data.next_tracks = [];
  callbacks.songchange();
  assert.equal(body.card, null);
});
