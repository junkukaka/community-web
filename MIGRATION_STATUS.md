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

## Stage 5: Node.js 24 and Vite 8.2

- Runtime: Node.js `24.19.0` LTS with npm `11.17.0`.
- Build tool: Vite `8.2.1` with `@vitejs/plugin-vue` `6.0.8`.
- Preserved behavior: port `8888`, `dist` output, `@` alias, public static assets, HTML5 history routing, existing API base URL, authentication, and business fields.
- Removed build chain: Vue CLI service/plugins, Babel loader, Sass loader, `vue.config.js`, and `babel.config.js`.
- Compatibility work: converted i18n dictionaries from CommonJS to ESM, migrated the router base URL to `import.meta.env.BASE_URL`, and retained the legacy global Lodash binding expected by existing components.
- Verification: clean `npm ci` succeeded on Node.js 24; lint passed; Vue 3 static verification passed; Vite development server started; production build and production preview succeeded; direct `/signIn` loading worked with CSS and fonts; browser console was clean after the final build.
- Known warnings: the main JavaScript chunk is larger than Vite's 500 kB recommendation; npm reports 21 dependency vulnerabilities. Both are deferred to the dependency cleanup stage rather than changing business libraries during the build-tool migration.
- Known limitation: authenticated Wiki/admin flows remain subject to the visual-verification exception accepted before this stage.
