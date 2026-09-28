const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const packageJson = JSON.parse(read('package.json'));

assert.ok(process.version.startsWith('v24.'), `Expected Node 24, received ${process.version}`);
assert.strictEqual(packageJson.devDependencies.vite, '8.3.1');
assert.strictEqual(packageJson.devDependencies['@vitejs/plugin-vue'], '6.0.9');
assert.strictEqual(packageJson.devDependencies['vite-plugin-vuetify'], '2.1.3');
assert.ok(!packageJson.devDependencies['@vue/cli-service'], 'Vue CLI must be removed after the Vite migration');
assert.strictEqual(packageJson.dependencies.vue, '3.5.43');
assert.strictEqual(packageJson.dependencies.vuetify, '4.2.2');
assert.strictEqual(packageJson.dependencies['vue-router'], '5.3.1');
assert.strictEqual(require('vue/package.json').version, '3.5.43');
assert.strictEqual(require('@vue/compiler-sfc/package.json').version, '3.5.43');

const viteConfig = read('vite.config.mjs');
assert.ok(viteConfig.includes("vuetify({ autoImport: true })"));

const vuetifyPlugin = read('src/plugins/vuetify.js');
assert.ok(!vuetifyPlugin.includes('legacyComponents'));
assert.ok(!vuetifyPlugin.includes('vuetify/components'));

const i18n = read('src/i18n/index.js');
assert.ok(i18n.includes('legacy: false'));
assert.ok(i18n.includes('globalInjection: true'));

const vueFiles = [];
function collectVueFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectVueFiles(fullPath);
    else if (entry.name.endsWith('.vue')) vueFiles.push(fullPath);
  }
}
collectVueFiles(path.join(root, 'src'));
const vueSource = vueFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');
for (const removedTag of ['v-tabs-items', 'v-tab-item', 'v-simple-table', 'v-subheader', 'v-list-item-group', 'v-list-item-content', 'v-list-item-icon', 'v-list-item-avatar']) {
  assert.ok(!vueSource.includes(`<${removedTag}`), `Removed Vuetify tag remains: ${removedTag}`);
}
assert.ok(!vueSource.includes('disable-pagination'), 'Removed Vuetify data-table pagination prop remains');
assert.ok(!vueSource.includes('item-key='), 'Removed Vuetify data-table item-key prop remains');

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
assert.ok(router.includes('import.meta.env.BASE_URL'));
assert.ok(router.includes('getAuthToken()'));
assert.ok(router.includes('savePreviousUrl(to.fullPath)'));
assert.ok(router.includes("return '/signIn'"));
assert.ok(!router.includes('(to, from, next)'));

const store = read('src/store.js');
assert.ok(store.includes('createStore'));
assert.ok(store.includes('setAuthToken(member.Authorization)'));
assert.ok(store.includes('clearAuthStorage()'));
assert.ok(store.includes('changeLogin'));

const http = read('src/http.js');
assert.ok(http.includes('import.meta.env.VITE_API_BASE_URL || conf.url.prod'));
assert.ok(http.includes('config.headers.Authorization'));
assert.ok(http.includes('config.headers.token'));
assert.ok(http.includes('error.response?.status === 401'));

const auth = read('src/auth.js');
for (const behavior of ['setAuthToken', 'clearAuthStorage', 'savePreviousUrl', 'takePreviousUrl']) {
  assert.ok(auth.includes(`function ${behavior}`), `Missing auth behavior: ${behavior}`);
}
assert.ok(auth.includes("!path.startsWith('//')"), 'Previous URL must reject protocol-relative redirects');

const fileValidation = read('src/utils/fileValidation.js');
assert.ok(fileValidation.includes('MAX_ATTACHMENT_SIZE = 50_000_000'));
assert.ok(fileValidation.includes('MAX_IMAGE_SIZE = 10_000_000'));
assert.ok(fileValidation.includes("'image/jpeg', 'image/png', 'image/gif'"));

for (const component of [
  'src/components/com/Search.vue',
  'src/views/admin/article/WikiManage.vue',
  'src/views/admin/article/CommunityManage.vue',
]) {
  assert.ok(!read(component).includes('v-html'), `Unsafe v-html remains in ${component}`);
}

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
