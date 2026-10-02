import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import ts from 'typescript';
import postcss from 'postcss';

// Exercise the actual bootstrap and store, with independent browser sessions.
function browserSession({ savedTheme, dark = false, blocked = false, reduced = false } = {}) {
  const root = { dataset: {}, setAttribute(key, value) { if (key === 'data-theme') this.dataset.theme = value; else this[key] = value; }, removeAttribute(key) { delete this[key]; } };
  const saved = new Map(savedTheme === undefined ? [] : [['velour-theme', savedTheme]]);
  const localStorage = {
    getItem(key) { if (blocked) throw new Error('Storage blocked'); return saved.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error('Storage blocked'); saved.set(key, value); },
  };
  class MediaQuery extends EventTarget {
    constructor(matches) { super(); this.matches = matches; this.listenerCount = 0; }
    addEventListener(...args) { this.listenerCount++; super.addEventListener(...args); }
    removeEventListener(...args) { this.listenerCount--; super.removeEventListener(...args); }
    change(matches) { this.matches = matches; this.dispatchEvent(new Event('change')); }
  }
  const system = new MediaQuery(dark), motion = new MediaQuery(reduced);
  const window = Object.assign(new EventTarget(), {
    localStorage,
    matchMedia(query) {
      if (query === '(prefers-color-scheme: dark)') return system;
      assert.equal(query, '(prefers-reduced-motion: reduce)');
      return motion;
    },
  });
  const globals = { document: { documentElement: root }, window, localStorage, setTimeout, clearTimeout, Event };
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    vm.runInNewContext(source, { ...globals, exports, require: specifier => load(path.resolve(path.dirname(file), specifier) + '.ts') });
    return exports;
  }
  const config = load('lib/theme.ts'), store = load('lib/theme-store.ts');
  const boot = () => vm.runInNewContext(config.themeInitScript, globals);
  const storage = (value, key = config.THEME_STORAGE_KEY) => {
    if (key === null) saved.clear();
    else if (value === null) saved.delete(key); else saved.set(key, value);
    window.dispatchEvent(Object.assign(new Event('storage'), { key, newValue: value }));
  };
  boot();
  return { root, saved, store, system, motion, boot, storage };
}

for (const dark of [false, true]) {
  for (const savedTheme of [undefined, '<invalid>', 'light', 'dark', 'default', 'monochrome']) {
    const session = browserSession({ dark, savedTheme });
    const expected = savedTheme === 'dark' ? 'dark' : ['light', 'default', 'monochrome'].includes(savedTheme) ? 'light' : dark ? 'dark' : 'light';
    assert.equal(session.store.getTheme(), expected, `Bootstrap ${savedTheme}/${dark}`);
    assert.equal(session.store.getServerTheme(), 'light'); // Stable first React hydration snapshot.
    assert.equal(session.root['data-theme-transition'], undefined); // No initial-paint animation.
    if (['default', 'monochrome'].includes(savedTheme)) assert.equal(session.saved.get('velour-theme'), 'light');
    if (savedTheme === undefined) assert.equal(session.saved.has('velour-theme'), false); // Automatic choice is not persisted as manual.
  }
}

const automatic = browserSession({ dark: true });
let notifications = 0, mobileNotifications = 0;
const unsubscribe = automatic.store.subscribeTheme(() => notifications++);
const unsubscribeMobile = automatic.store.subscribeTheme(() => mobileNotifications++);
assert.equal(automatic.system.listenerCount, 1); // Both controls share one OS listener.
automatic.system.change(false); assert.equal(automatic.store.getTheme(), 'light');
assert.equal(notifications, 1); assert.equal(mobileNotifications, 1);
automatic.store.setTheme('dark'); assert.equal(automatic.saved.get('velour-theme'), 'dark');
automatic.system.change(true); automatic.system.change(false);
assert.equal(automatic.store.getTheme(), 'dark'); // Manual choice wins over subsequent OS changes.
automatic.boot(); assert.equal(automatic.store.getTheme(), 'dark');
automatic.storage('light'); assert.equal(automatic.store.getTheme(), 'light');
automatic.system.change(true); assert.equal(automatic.store.getTheme(), 'light');
automatic.storage(null); assert.equal(automatic.store.getTheme(), 'dark'); // Deleted preference resumes OS.
automatic.system.change(false); assert.equal(automatic.store.getTheme(), 'light');
automatic.storage('dark', 'unrelated'); assert.equal(automatic.store.getTheme(), 'light');
automatic.storage('dark'); assert.equal(automatic.store.getTheme(), 'dark');
automatic.storage(null, null); assert.equal(automatic.store.getTheme(), 'light'); // localStorage.clear().
automatic.storage('invalid'); automatic.system.change(true); assert.equal(automatic.store.getTheme(), 'dark');
automatic.motion.change(true); automatic.store.setTheme('light');
assert.equal(automatic.root['data-theme-transition'], undefined);
unsubscribe(); assert.equal(automatic.system.listenerCount, 1);
unsubscribeMobile(); assert.equal(automatic.system.listenerCount, 0);
const previous = notifications;
automatic.store.setTheme('dark'); assert.equal(notifications, previous);

const denied = browserSession({ dark: true, blocked: true });
assert.equal(denied.store.getTheme(), 'dark'); // OS fallback still works when storage throws.
const remove = denied.store.subscribeTheme(() => {});
denied.store.setTheme('light'); denied.system.change(false); denied.system.change(true);
assert.equal(denied.store.getTheme(), 'light');
remove();
const removeAfterNavigation = denied.store.subscribeTheme(() => {});
assert.equal(denied.store.getTheme(), 'light'); // Blocked storage does not lose the in-session choice on route changes.
removeAfterNavigation();
console.log('OK: arranque Light/Dark, sistema, prioridad manual, migración, persistencia, storage bloqueado, cambios de sistema/pestaña, reduced motion y cleanup.');

// Check the real palettes and all foreground/background combinations used by controls.
const stylesheet = postcss.parse(fs.readFileSync('app/themes.css', 'utf8'));
const palettes = { light: {}, dark: {} };
stylesheet.walkRules(rule => {
  const palette = rule.selector === ':root' ? palettes.light : rule.selector === ':root[data-theme="dark"]' ? palettes.dark : null;
  if (palette) rule.walkDecls(declaration => { if (declaration.prop.startsWith('--')) palette[declaration.prop] = declaration.value; });
});
function resolve(palette, key) {
  const value = palette[key];
  assert.ok(value, `Missing token ${key}`);
  return value.startsWith('var(') ? resolve(palette, value.slice(4, -1)) : value;
}
function luminance(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const channels = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
function contrast(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
const checks = [
  ['text', 'bg', 4.5], ['text-muted', 'bg', 4.5], ['text-muted', 'surface', 4.5], ['text-muted-on-alt', 'surface-alt', 4.5],
  ['accent-text', 'bg', 4.5], ['accent-text', 'surface', 4.5], ['placeholder', 'bg', 4.5], ['placeholder', 'surface', 4.5],
  ['button-text', 'button-bg', 4.5], ['footer-muted', 'footer-bg', 4.5], ['footer-link', 'footer-bg', 4.5],
  ['on-dark-muted', 'inverse-bg', 4.5], ['input-border', 'bg', 3], ['input-border', 'surface', 3],
  ['focus', 'bg', 3], ['focus', 'surface', 3], ['process-active-text', 'process-active-bg', 4.5],
  ['technology-text', 'bg', 4.5], ['selection-text', 'selection-bg', 4.5],
  ['cta-text', 'cta-bg', 4.5], ['cta-muted', 'cta-bg', 4.5], ['cta-accent', 'cta-bg', 4.5],
  ['cta-button-text', 'cta-button-bg', 4.5], ['cta-focus', 'cta-bg', 3],
];
for (const theme of ['light', 'dark']) {
  const palette = { ...palettes.light, ...(theme === 'dark' ? palettes.dark : {}) };
  for (const [foreground, background, minimum] of checks) {
    const value = contrast(resolve(palette, '--' + foreground), resolve(palette, '--' + background));
    assert.ok(value >= minimum, `${theme} ${foreground}/${background}: ${value.toFixed(2)} < ${minimum}`);
  }
  console.log(`OK: ${theme}, ${checks.length} combinaciones de contraste; texto >= 4.5:1 y controles/foco >= 3:1.`);
}
