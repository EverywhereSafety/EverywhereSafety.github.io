const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const source = readFileSync(resolve(__dirname, '../assets/analytics.js'), 'utf8');

function page({ hostname = 'everywheresafety.github.io', existing = false, embedded = false } = {}) {
  const scripts = [];
  const window = { self: {}, dataLayer: [] };
  window.top = embedded ? {} : window.self;
  if (existing) {
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('config', 'G-VP2GFJFNGW');
  }
  const context = vm.createContext({
    window, location: { hostname },
    document: {
      querySelector: () => existing ? {} : null,
      createElement: () => ({}),
      head: { appendChild: script => scripts.push(script) },
    },
  });
  const run = () => vm.runInContext(source, context);
  const configs = () => window.dataLayer.filter(args => args[0] === 'config').map(args => args[1]);
  return { window, scripts, run, configs };
}

test('production page configures the main destination once, even if loaded twice', () => {
  const p = page(); p.run(); p.run();
  assert.deepEqual(p.configs(), ['G-91FRVY1271']);
  assert.equal(p.scripts.length, 1);
  assert.equal(p.scripts[0].async, true);
  assert.equal(p.window.dataLayer.filter(a => a[0] === 'event' && a[1] === 'page_view').length, 0);
});

test('existing project Analytics keeps its destination and its loader', () => {
  const p = page({ existing: true });
  const original = p.window.gtag;
  p.run(); p.run();
  assert.equal(p.window.gtag, original);
  assert.deepEqual(p.configs(), ['G-VP2GFJFNGW', 'G-91FRVY1271']);
  assert.equal(p.scripts.length, 0);
});

test('previews and embedded demos do not send site traffic', () => {
  for (const options of [{ hostname: 'localhost' }, { hostname: 'another-owner.github.io' }, { embedded: true }]) {
    const p = page(options); p.run();
    assert.deepEqual(p.configs(), []);
    assert.equal(p.scripts.length, 0);
  }
});
