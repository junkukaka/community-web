const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let observer;
const image = {
  tagName: 'IMG', currentSrc: 'https://example.test/diagram.png', alt: 'Diagram', style: {},
  closest: selector => selector === '.v-md-editor-preview',
  setAttribute(name, value) { this[name] = value; },
  focus(options) { this.focused = options.preventScroll; },
};
class MutationObserver {
  constructor(callback) { this.callback = callback; observer = this; }
  observe(target) { this.target = target; }
  disconnect() { this.disconnected = true; }
}
const source = fs.readFileSync(path.join(__dirname, '../src/components/com/ImagePreview.vue'), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace('export default ', 'module.exports = ');
const sandbox = { module: { exports: {} }, MutationObserver };
vm.runInNewContext(script, sandbox);
const component = sandbox.module.exports;
const context = {
  ...component.data(),
  $t: key => key,
  $el: { querySelectorAll: selector => { assert.strictEqual(selector, '.v-md-editor-preview img'); return [image]; } },
};
for (const [name, method] of Object.entries(component.methods)) context[name] = method.bind(context);
component.mounted.call(context);
assert.strictEqual(image.tabIndex, 0);
assert.strictEqual(image.role, 'button');
assert.strictEqual(image['aria-label'], 'imagePreview: Diagram');
assert.strictEqual(image.style.cursor, 'zoom-in');
observer.callback();

let prevented = 0;
let stopped = 0;
const event = { target: image, preventDefault() { prevented++; }, stopPropagation() { stopped++; } };
context.openImage({ ...event, target: { tagName: 'A' } });
assert.strictEqual(context.opened, false);
context.openImage({ ...event, target: { ...image, closest: () => null } });
assert.strictEqual(context.opened, false);
context.openImage(event);
assert.strictEqual(context.opened, true);
assert.strictEqual(context.imageSource, image.currentSrc);
assert.strictEqual(context.imageAlt, 'Diagram');
assert.strictEqual(image.focused, true);
assert.strictEqual(prevented, 1);
assert.strictEqual(stopped, 1);

context.onWheel({ deltaY: -100 });
assert.strictEqual(context.scale, 1);
context.loading = false;
context.onWheel({ deltaY: -100 });
assert(context.scale > 1);
context.onWheel({ deltaY: 100 });
assert(Math.abs(context.scale - 1) < 0.000001);
context.zoom(10000);
assert.strictEqual(context.scale, 10);
context.zoom(0.000001);
assert.strictEqual(context.scale, 0.1);
context.imageFailed = true;
context.onWheel({ deltaY: -100 });
assert.strictEqual(context.scale, 0.1);

context.imageFailed = false;
let captured;
const pointer = { button: 0, pointerId: 3, clientX: 100, clientY: 200, currentTarget: { setPointerCapture: id => captured = id }, preventDefault() {} };
context.startDrag({ ...pointer, button: 2 });
assert.strictEqual(context.drag, null);
context.startDrag(pointer);
assert.strictEqual(captured, 3);
context.moveDrag({ pointerId: 4, clientX: 300, clientY: 400 });
assert.strictEqual(context.offsetX, 0);
context.moveDrag({ pointerId: 3, clientX: 180, clientY: 230 });
assert.strictEqual(context.offsetX, 80);
assert.strictEqual(context.offsetY, 30);
context.rotation = 90;
assert(component.computed.imageStyle.call(context).transform.includes('rotate(90deg)'));
context.reset();
assert.strictEqual(context.scale, 1);
assert.strictEqual(context.rotation, 0);
assert.strictEqual(context.offsetX, 0);
assert.strictEqual(context.offsetY, 0);
assert.strictEqual(context.drag, null);
context.startDrag(pointer);
context.close();
assert.strictEqual(context.opened, false);
assert.strictEqual(context.drag, null);

context.imageFailed = true;
context.openImage(event);
assert.strictEqual(context.imageFailed, false);
assert.strictEqual(context.loading, true);
component.watch.opened.call(context, false);
assert.strictEqual(context.drag, null);
component.beforeDestroy.call(context);
assert.strictEqual(observer.disconnected, true);

for (const language of ['ch', 'en', 'ko']) {
  const messages = require(`../src/i18n/${language}.js`);
  for (const key of ['imagePreview', 'zoomIn', 'zoomOut', 'rotateLeft', 'rotateRight', 'imageLoadFailed']) {
    assert.strictEqual(typeof messages[key], 'string');
  }
}
console.log('PASS: image scope, keyboard access, open/close, zoom limits, wheel, dragging, reset, error recovery and translations');
