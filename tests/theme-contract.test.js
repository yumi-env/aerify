const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'user.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'theme.js'), 'utf8');
const ini = fs.readFileSync(path.join(root, 'color.ini'), 'utf8');
const notice = fs.readFileSync(path.join(root, 'THIRD_PARTY_NOTICES.md'), 'utf8');

// The user specifically rejected a simulated border around the entire window.
assert.doesNotMatch(css, /body\s*::(?:before|after)\s*\{/i);
assert.doesNotMatch(css, /#main\s*\{[^}]*margin-top\s*:/i);

// Lyrics and mini-player work is outside this main-window restart.
assert.doesNotMatch(css + js, /SpicyLyricsPage|spicy-pip-wrapper|miniPlayer|pip-hover-element/i);

// The result must be a native Spotify theme with real WMPotify source attribution.
for (const selector of ['#global-nav-bar', '#Desktop_LeftSidebar_Id', '#Desktop_PanelContainer_Id', 'control-button-playpause']) {
  assert.ok(css.includes(selector), `Missing main-window styling for ${selector}`);
}
assert.match(css, /45%/);
assert.match(notice, /Ingan121/);
assert.match(notice, /MIT License|The MIT License/);

const aero = ini.split(/^\[Aero Blue\]/m)[0];
const color = (name) => {
  const match = aero.match(new RegExp(`^${name}\\s*=\\s*([0-9A-F]{6})$`, 'm'));
  assert.ok(match, `Missing ${name} color`);
  return match[1].match(/../g).map((part) => parseInt(part, 16) / 255);
};
const luminance = (rgb) => rgb.map((n) => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4)
  .reduce((sum, n, index) => sum + n * [0.2126, 0.7152, 0.0722][index], 0);
const main = luminance(color('main'));
const text = luminance(color('text'));
assert.ok(main < 0.05, `Main surface is too light (${main})`);
assert.ok((text + 0.05) / (main + 0.05) >= 4.5, 'Main text lacks contrast');

const syntax = spawnSync(process.execPath, ['--check', path.join(root, 'theme.js')], { encoding: 'utf8' });
assert.equal(syntax.status, 0, syntax.stderr);
console.log('theme contract passed');
