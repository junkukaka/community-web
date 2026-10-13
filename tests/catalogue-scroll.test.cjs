const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load(file, context = {}) {
  let source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  if (file.endsWith('.vue')) source = source.match(/<script>([\s\S]*?)<\/script>/)[1];
  source = source.replace(/^import .*\r?\n/gm, '').replace('export default ', 'module.exports = ');
  const sandbox = { module: { exports: {} }, ...context };
  vm.runInNewContext(source, sandbox, { filename: file });
  return sandbox.module.exports;
}

for (const page of ['wiki', 'community']) {
  const events = new Map();
  const frames = new Map();
  let frameId = 0;
  let observer;
  let scrollRequest;
  const window = {
    pageYOffset: 0,
    innerHeight: 800,
    addEventListener: (name, callback) => events.set(name, callback),
    removeEventListener: (name, callback) => { assert.strictEqual(events.get(name), callback); events.delete(name); },
    requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
  };
  const document = { documentElement: { scrollHeight: 3000 } };
  const heading = (text, line, top, tag = 'H2') => ({
    innerText: text,
    tagName: tag,
    top,
    getAttribute: () => line,
    getBoundingClientRect() { return { top: this.top - window.pageYOffset }; },
  });
  let headings = [heading('First', '1', 300, 'H1'), heading('Second', '8', 900), heading('Last', '20', 2900)];
  const previewEvents = new Map();
  const preview = {
    querySelectorAll(selector) { assert.strictEqual(selector, 'h1,h2,h3,h4,h5,h6'); return headings; },
    addEventListener: (name, callback) => previewEvents.set(name, callback),
    removeEventListener: (name, callback) => { assert.strictEqual(previewEvents.get(name), callback); previewEvents.delete(name); },
  };
  class MutationObserver {
    constructor(callback) { this.callback = callback; observer = this; }
    observe(target) { assert.strictEqual(target, preview); }
    disconnect() { this.disconnected = true; }
  }
  const catalogue = load('src/components/com/catalogue.js', { window, document, MutationObserver });
  const component = load(`src/components/${page}/Detail.vue`, {
    catalogue, HisTimeLine: {}, DashboardVue: {}, FilesListVue: {}, mapGetters: () => ({}),
  });
  assert.strictEqual(component.mixins[0], catalogue);
  const context = {
    ...component.data(),
    $refs: { editor: {
      $el: { querySelector: selector => { assert.strictEqual(selector, '.v-md-editor-preview'); return preview; } },
      previewScrollToTarget: options => scrollRequest = options,
    } },
  };
  for (const [name, method] of Object.entries(catalogue.methods)) context[name] = method.bind(context);
  catalogue.mounted.call(context);
  assert.strictEqual(context.contentsTitle, '1');
  assert.strictEqual(context.titles[1].indent, 1);

  function flush() {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback());
  }
  function scrollTo(y) {
    window.pageYOffset = y;
    events.get('scroll')();
    flush();
  }
  scrollTo(800);
  assert.strictEqual(context.contentsTitle, '8');
  scrollTo(100);
  assert.strictEqual(context.contentsTitle, '1');
  scrollTo(2200);
  assert.strictEqual(context.contentsTitle, '20');

  context.handleAnchorClick(context.titles[1]);
  assert.strictEqual(scrollRequest.target, headings[1]);
  assert.strictEqual(scrollRequest.top, 100);
  assert.strictEqual(scrollRequest.scrollContainer, window);

  scrollTo(800);
  headings[1].top = 1200;
  previewEvents.get('load')();
  flush();
  assert.strictEqual(context.contentsTitle, '1');
  window.pageYOffset = 1100;
  events.get('resize')();
  flush();
  assert.strictEqual(context.contentsTitle, '8');
  events.get('scroll')();
  events.get('scroll')();
  assert.strictEqual(frames.size, 1);
  flush();

  headings = [];
  observer.callback();
  assert.strictEqual(context.titles.length, 0);
  assert.strictEqual(context.contentsTitle, null);
  headings = [heading('', '0', 100), heading('HTML heading', null, 1200, 'H3')];
  observer.callback();
  assert.strictEqual(context.titles.length, 1);
  assert.strictEqual(context.titles[0].lineIndex, 'heading-0');
  context.handleAnchorClick(context.titles[0]);
  assert.strictEqual(scrollRequest.target, headings[1]);

  events.get('scroll')();
  catalogue.beforeDestroy.call(context);
  assert.strictEqual(observer.disconnected, true);
  assert.strictEqual(events.size, 0);
  assert.strictEqual(previewEvents.size, 0);
  assert.strictEqual(frames.size, 0);
}

console.log('PASS: both detail pages track scrolling, bottom, click, async headings, images, resize and cleanup');
