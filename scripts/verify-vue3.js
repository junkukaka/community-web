const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const packageJson = JSON.parse(read('package.json'));

assert.ok(process.version.startsWith('v16.'), `Expected Node 16, received ${process.version}`);
assert.strictEqual(packageJson.dependencies.vue, '3.5.41');
assert.strictEqual(require('vue/package.json').version, '3.5.41');
assert.strictEqual(require('@vue/compiler-sfc/package.json').version, '3.5.41');

const main = read('src/main.js');
assert.ok(main.includes('createApp(App)'));
for (const plugin of ['app.use(vuetify)', 'app.use(router)', 'app.use(store)', 'app.use(i18n)']) {
  assert.ok(main.includes(plugin), `Missing Vue 3 plugin registration: ${plugin}`);
}

const router = read('src/router.js');
for (const route of ["path: '/'", "path: '/member'", "path: '/aspnAdmin'", "path: '/community'", "path: '/wiki'", "path: '/pdf'"]) {
  assert.ok(router.includes(route), `Missing route declaration: ${route}`);
}
assert.ok(router.includes('createWebHistory'));
assert.ok(router.includes("localStorage.getItem('Authorization')"));
assert.ok(router.includes("next('/signIn')"));

const store = read('src/store.js');
assert.ok(store.includes('createStore'));
assert.ok(store.includes("localStorage.setItem('Authorization'"));
assert.ok(store.includes('changeLogin'));

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

console.log(`Vue 3 migration verification passed on ${process.version}: versions, plugins, auth, HTTP, routes, and key pages.`);
