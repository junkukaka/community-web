# Migration status

## Vue 3 visual regression repair

- Baseline commit: `e0aa391` (last pre-Vue 3 migration baseline)
- Root causes: Vuetify 3 default Material Design density and layout registration differed from Vuetify 2; legacy component props, activator slots, text-color utilities, and Markdown plugin ordering were not fully compatible.
- Repair: enabled the Vuetify MD2 blueprint, added narrowly scoped compatibility adapters for legacy buttons and text fields, restored the original header/content/footer layout calculations, migrated activator slots, and removed duplicate Markdown plugin registration.
- Verified: Node.js 16 lint passed; Node.js 16 production build passed; the public login page matched the reference geometry at 1912x901; no critical browser console errors or unregistered custom elements were found on that page.
- Known limitation: authenticated home, Wiki list/detail, administration pages, and the 1366x768 viewport were not visually verified because the local environment did not have an authenticated backend session. The user explicitly accepted this incomplete visual verification before stage 5 on 2026-08-19.

### Files changed

- `src/plugins/vuetify.js`
- `src/main.js`
- `src/static/css/api.css`
- `src/components/com/MainFooter.vue`
- `src/components/com/SystemBar.vue`
- `src/components/community/EditorMd.vue`
- `src/components/community/EditorVue.vue`
- `src/components/wiki/Detail.vue`
- `src/components/wiki/Edit.vue`
- `src/views/IndexMember.vue`
- `src/views/admin/authority/AuthorityManage.vue`
- `src/views/admin/authority/Department.vue`
- `src/views/member/user/SignUp.vue`
