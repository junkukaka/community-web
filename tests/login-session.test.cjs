const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Vue = require('vue');
const Vuex = require('vuex');
const VueRouter = require('vue-router');

function storage(values = {}) {
  const items = new Map(Object.entries(values));
  return {
    getItem: key => items.has(key) ? items.get(key) : null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: key => items.delete(key),
  };
}

function load(file, context) {
  let source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  if (file.endsWith('.vue')) source = source.match(/<script>([\s\S]*?)<\/script>/)[1];
  source = source.replace(/^import .*\r?\n/gm, '').replace('export default ', 'module.exports = ');
  const sandbox = { module: { exports: {} }, Vue, Vuex, VueRouter, ...context };
  vm.runInNewContext(source, sandbox, { filename: file });
  return sandbox.module.exports;
}

const localStorage = storage();
const store = load('src/store.js', { localStorage });
store.state.member = { id: 7, authority: 1, memberName: 'Session test' };
store.commit('changeLogin', { Authorization: 'current-token' });
assert.strictEqual(JSON.parse(localStorage.getItem('store')).member.id, 7);

// 新标签页使用同一份 localStorage，在路由判断前就能恢复会员。
const restored = load('src/store.js', { localStorage });
assert.strictEqual(restored.state.member.id, 7);
assert.strictEqual(restored.state.Authorization, 'current-token');
const router = load('src/router.js', { localStorage, store: restored, window: {} });
const guard = router.beforeHooks[0];
const shared = '/wiki/wikiDetail?wikiId=1576#part';
let destination = 'not-called';
guard({ path: '/wiki/wikiDetail', fullPath: shared }, { path: '/' }, value => destination = value);
assert.strictEqual(destination, undefined);

localStorage.removeItem('Authorization');
guard({ path: '/wiki/wikiDetail', fullPath: shared }, { path: '/' }, value => destination = value);
assert.strictEqual(destination.path, '/signIn');
assert.strictEqual(destination.query.redirect, shared);
guard({ path: '/main', fullPath: '/main' }, { path: '/' }, value => destination = value);
assert.strictEqual(destination, undefined);

const stale = storage({ store: JSON.stringify({ member: { id: 9 } }) });
assert.strictEqual(load('src/store.js', { localStorage: stale }).state.member, null);
const corrupt = storage({ Authorization: 'token', store: '{broken' });
assert.strictEqual(load('src/store.js', { localStorage: corrupt }).state.member, null);
assert.strictEqual(corrupt.getItem('store'), null);
localStorage.setItem('Authorization', 'current-token');
restored.state.member = null;
guard({ path: '/wiki/wikiDetail', fullPath: shared }, { path: '/' }, value => destination = value);
assert.strictEqual(destination.path, '/signIn');

const signIn = load('src/views/member/user/SignIn.vue', { localStorage, mapMutations: () => ({}) });
function finishLogin(redirect, token = 'current-token') {
  const pushed = [];
  const context = {
    dialog: true,
    memberToken: token,
    $route: { query: redirect === undefined ? {} : { redirect } },
    $router: { resolve: url => router.resolve(url), push: url => pushed.push(url) },
  };
  signIn.methods.closeDialogMsg.call(context);
  return pushed;
}

localStorage.setItem('PreUrl', shared);
assert.deepStrictEqual(finishLogin(), ['/']);
assert.strictEqual(localStorage.getItem('PreUrl'), null);
assert.deepStrictEqual(finishLogin(shared), [shared]);
for (const invalid of ['https://example.com', '//example.com', '/\\example.com', '/missing', '/signIn', '/signUp', [shared]]) {
  assert.deepStrictEqual(finishLogin(invalid), ['/']);
}
assert.deepStrictEqual(finishLogin(shared, ''), []);

let beforeUnload;
const app = load('src/App.vue', {
  localStorage,
  mapMutations: () => ({}),
  window: { addEventListener(event, callback) { if (event === 'beforeunload') beforeUnload = callback; } },
  document: { body: { clientWidth: 1200 } },
});
let getCallback;
let postCallback;
let verifiedUrl;
let logoutCount = 0;
const appContext = {
  $store: { state: { member: null, Authorization: '' } },
  $http: {
    get(url) { verifiedUrl = url; return { then(callback) { getCallback = callback; } }; },
    post() { return { then(callback) { postCallback = callback; } }; },
  },
  logout() { logoutCount++; },
  pageResize() {},
  getMemberMenuTree() { throw new Error('Guest must not request member menus'); },
};
appContext.checkSession = app.methods.checkSession.bind(appContext);

localStorage.removeItem('Authorization');
app.created.call(appContext);
assert.strictEqual(verifiedUrl, undefined);
assert.strictEqual(logoutCount, 0);

// 登录前打开的旧标签页关闭时，不能覆盖新标签页已经保存的会员。
localStorage.setItem('Authorization', 'other-tab-token');
const otherTabSnapshot = JSON.stringify({ member: { id: 8 }, Authorization: 'other-tab-token' });
localStorage.setItem('store', otherTabSnapshot);
beforeUnload();
assert.strictEqual(localStorage.getItem('store'), otherTabSnapshot);

localStorage.removeItem('Authorization');
beforeUnload();
assert.strictEqual(JSON.parse(localStorage.getItem('store')).Authorization, '');

localStorage.setItem('Authorization', 'old-token');
localStorage.setItem('token', 'unrelated-legacy-token');
appContext.checkSession();
assert.strictEqual(verifiedUrl, '/member/memberVerify/old-token');
localStorage.setItem('Authorization', 'new-token');
getCallback({ data: { code: '50000', data: 0 } });
assert.strictEqual(logoutCount, 0);
appContext.checkSession();
getCallback({ data: { code: '50000', data: 0 } });
assert.strictEqual(logoutCount, 1);

appContext.$store.state.member = { id: 7 };
appContext.$router = { push() { throw new Error('Stale session response must not navigate'); } };
app.beforeCreate.call(appContext);
localStorage.setItem('Authorization', 'latest-token');
postCallback({ data: { data: { member: 0 } } });
assert.strictEqual(appContext.$store.state.member.id, 7);
assert.strictEqual(localStorage.getItem('Authorization'), 'latest-token');

appContext.changeLogin = ({ Authorization }) => localStorage.setItem('Authorization', Authorization);
app.beforeCreate.call(appContext);
postCallback({ data: { data: { member: { id: 7 }, token: 'refreshed-token' } } });
assert.strictEqual(verifiedUrl, '/member/memberVerify/refreshed-token');
getCallback({ data: { code: 200, data: 1 } });
assert.strictEqual(logoutCount, 1);

let invalidSessionRoute;
let removedLogin = false;
appContext.$router = { push(url) { invalidSessionRoute = url; } };
appContext.removeLogin = () => removedLogin = true;
app.beforeCreate.call(appContext);
postCallback({ data: { data: { member: 0 } } });
assert.strictEqual(appContext.$store.state.member, null);
assert.strictEqual(localStorage.getItem('Authorization'), null);
assert.strictEqual(invalidSessionRoute, '/');
assert.strictEqual(removedLogin, true);

console.log('PASS: login persistence, new-tab restore, protected links, home login, redirect validation, guest startup, stale checks and invalid sessions');
