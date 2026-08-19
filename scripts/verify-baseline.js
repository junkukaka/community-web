const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const packageJson = JSON.parse(read('package.json'));
assert.ok(process.version.startsWith('v16.'), `Expected Node 16, received ${process.version}`);
assert.strictEqual(packageJson.dependencies.vue, '2.7.16');
assert.strictEqual(packageJson.devDependencies['vue-template-compiler'], '2.7.16');

const installedVue = require('vue/package.json');
const installedCompiler = require('vue-template-compiler/package.json');
const compiler = require('vue-template-compiler');
assert.strictEqual(installedVue.version, '2.7.16');
assert.strictEqual(installedCompiler.version, '2.7.16');
assert.strictEqual(typeof compiler.parseComponent, 'function');

const router = read('src/router.js');
for (const route of [
  "path: '/'",
  "path: '/member'",
  "path: '/aspnAdmin'",
  "path: '/community'",
  "path: '/wiki'",
  "path: '/pdf'",
]) {
  assert.ok(router.includes(route), `Missing route declaration: ${route}`);
}
assert.ok(router.includes("localStorage.getItem('Authorization')"));
assert.ok(router.includes("next('/signIn')"));

const store = read('src/store.js');
assert.ok(store.includes("localStorage.getItem('Authorization')"));
assert.ok(store.includes("localStorage.setItem('Authorization'"));
assert.ok(store.includes("localStorage.setItem('token'"));
assert.ok(store.includes('changeLogin'));
assert.ok(store.includes('removeLogin'));

const http = read('src/http.js');
assert.ok(http.includes('baseURL: conf.url.prod'));
assert.ok(http.includes('config.headers.Authorization'));
assert.ok(http.includes('config.headers.token'));

for (const component of [
  'src/views/member/user/SignIn.vue',
  'src/components/wiki/List.vue',
  'src/components/wiki/Detail.vue',
  'src/components/wiki/Edit.vue',
  'src/components/community/List.vue',
  'src/components/community/Detail.vue',
  'src/components/community/Edit.vue',
  'src/views/IndexAdmin.vue',
]) {
  assert.ok(fs.existsSync(path.join(root, component)), `Missing key page: ${component}`);
}

console.log(`Baseline verification passed on ${process.version}: versions, auth wiring, HTTP headers, routes, and key pages.`);
