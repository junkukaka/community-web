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

## Stage 6: third-party dependency upgrade and cleanup

- Upgraded direct runtime dependencies: Axios `0.21.4` to `1.19.0`, Lodash `4.17.21` to `4.18.1`, and Vue I18n `10.0.8` to `11.4.8`.
- Upgraded development dependencies: Sass `1.77.8` to `1.102.0`, ESLint `8.57.1` to `10.8.1`, ESLint Plugin Vue `9.33.0` to `10.10.0`, and Vue ESLint Parser to `10.4.1`.
- Removed unused direct dependencies `jspdf` and `core-js`; repository searches found no source imports or calls.
- Migrated ESLint to the supported flat configuration format while preserving the existing Vue essential-rule baseline. No unrelated business-code modernization was introduced.
- Applied compatible transitive security overrides for `brace-expansion`, `braces`, `js-yaml`, `minimatch`, and `prismjs`.
- Security result: npm audit findings decreased from 21 (9 moderate, 10 high, 2 critical) to 9 (7 moderate, 2 high, 0 critical).
- Remaining audit findings are all in the `@kangc/v-md-editor` dependency chain (`@vuepress/markdown`, `markdown-it`, `linkify-it`, `katex`, and related packages). npm provides no compatible automatic fix. Replacing the editor is deferred because it can change Markdown rendering, editing behavior, and page appearance and requires authenticated visual and functional acceptance.
- Intentionally retained current major versions of Vue Router, Vuetify, and Roboto font assets. Their available next majors carry routing, component-DOM/style, or visual changes outside this stage's safe scope.
- Verification: ordinary Node.js 24 `npm ci` succeeded without `--force` or legacy peer flags; lint passed; Vue 3 auth/HTTP/route/key-page verification passed; Vite development server and production build passed; `/signIn` rendered with loaded fonts, registered controls, and no broken images.
- Known warnings: Vue I18n 11 reports that legacy API mode is deprecated; it remains enabled to preserve existing Options API behavior. The production main chunk remains above Vite's 500 kB recommendation. Both require separately scoped work.
- Known limitation: authenticated Wiki editor, upload/download, and administration flows remain subject to the visual-verification exception accepted before stage 5.

## Stage 7: critical business stability and security

- Authentication storage is now centralized in `src/auth.js`. Login writes both legacy token keys for backend compatibility, while logout and HTTP 401 handling consistently clear `Authorization`, `token`, and the persisted Vuex state.
- Protected-route redirects retain only safe application-relative paths. Protocol-relative values such as `//example.com` are rejected, and the saved redirect is consumed after a successful login.
- Axios now reads the current token for every request instead of retaining a stale startup value. A 401 response clears the session and redirects to `/signIn`; 403 and network failures remain rejected to the calling page without incorrectly deleting a valid session.
- The persisted Vuex state is restored inside a guarded JSON parse. Corrupt browser storage is cleared instead of preventing application startup.
- The API origin can be supplied through `VITE_API_BASE_URL`; omitting it preserves the existing production endpoint and backend protocol. `.env.example` documents the public configuration name without including credentials.
- Removed five direct `v-html` render sites for member names and administration summaries. Vue interpolation now escapes server-provided text, while `white-space: pre-line` preserves summary line breaks.
- Added shared client-side upload checks: attachments must have a valid filename, be non-empty, and be at most 50 MB; Markdown/avatar images must be JPEG, PNG, or GIF and at most 10 MB. Upload progress is now cleared after both success and failure.
- File download links opened in a new tab now use `noopener noreferrer`.
- Verification: Node.js 24 lint passed; the Vue 3 auth/HTTP/route/security verification passed; Vite production build passed; Vite development smoke testing confirmed an unauthenticated protected route redirects to `/signIn`, fonts load, and no broken images are present.
- Known warning: Vue I18n legacy-mode and Vite large-chunk warnings remain unchanged.
- Remaining security boundary: client-side file checks are bypassable and must also be enforced by the backend. `@kangc/v-md-editor` still renders through its legacy Markdown dependency chain; fully sanitizing or replacing that renderer requires authenticated content-compatibility acceptance and remains unresolved.
- Known limitation: login success, logout against a live backend, 401/403 backend responses, authenticated editors, upload/download, and administration workflows could not be end-to-end tested without test credentials and an authenticated backend environment.
