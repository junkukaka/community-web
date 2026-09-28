# Frontend Modernization Plan and Status

Updated: 2026-09-28

## Outcome

The second-stage modernization is implemented on the project's pinned runtime:

- Node.js 24.19.0 and npm 11.17.0;
- Vue 3.5.43;
- Vue Router 5.3.1;
- Vuetify 4.2.2;
- Vue I18n 11.4.12;
- Vite 8.3.1.

The application remains on Vue, Vuex, Vuetify, JavaScript, and the existing API
contract. No redesign, state-library replacement, TypeScript conversion, or API
rewrite was introduced.

## Completed work

### Dependencies and build

- Updated direct dependencies and regenerated `package-lock.json` with ordinary
  `npm install`; no `--force` or `--legacy-peer-deps` flag was used.
- Added the official `vite-plugin-vuetify` auto-import integration.
- Added `eslint-plugin-vuetify` with its Vuetify 4 flat-config rules.
- Removed unused Sass and the obsolete wildcard Vuetify component/directive
  registration.
- Kept `@kangc/v-md-editor` 2.3.18 because the registry's `latest` tag points
  backward to 1.7.12.

### Vuetify 4 compatibility

- Replaced removed tab items with `v-window` / `v-window-item`.
- Replaced removed table/list components and migrated list grouping.
- Migrated button, icon, image, rating, snackbar, typography, grid, and color
  APIs to supported Vuetify 4 forms.
- Converted data-table headers from `text` / `value` to `title` / `key`,
  migrated row keys and pagination, and preserved selection behavior.
- Retained the MD2 blueprint and pinned the light theme to preserve the existing
  page appearance across operating-system color schemes.

### Vue ecosystem compatibility

- Switched Vue I18n to composition mode with global injection, preserving
  existing `$t` and `$i18n` component usage.
- Converted the Router navigation guard to the return-based Router 5 API.
- Added a null-session guard for the shared member-comment count request so the
  public login page does not request a member-specific endpoint without a user.
- Expanded `scripts/verify-vue3.js` to cover the exact dependency versions,
  Vuetify auto-import/configuration, removed APIs, i18n mode, and Router guard.

## Verification

| Check | Result |
|---|---|
| Runtime | Node 24.19.0 via the nvm-managed `C:\Program Files\nodejs` symlink; npm 11.17.0 |
| Install graph | `npm ls --depth=0` passed |
| Lint | `npm run lint` passed |
| Migration checks | `npm run test:vue3` passed |
| Production build | Vite 8.3.1 passed; 1,415 modules transformed |
| Git whitespace | `git diff --check` passed |
| Desktop UI | `/signIn` rendered correctly; password visibility and language selection worked |
| Narrow UI | 390 x 844 rendered without horizontal overflow |
| Routing | Unauthenticated `/member` redirected to `/signIn` |
| Browser console | No warnings or errors after the final reload and route check |

The entry bundle is now about 642.48 kB minified / 221.34 kB gzip, down from the
previous approximately 1.27 MB / 420 kB. Vite still reports its 500 kB chunk
warning.

## Remaining work

1. `npm audit` reports 12 findings (7 moderate, 5 high, 0 critical). They are
   within the direct `@kangc/v-md-editor` dependency and its legacy VuePress
   Markdown chain; npm reports no compatible fix for the editor chain. Replacing
   it requires a separate Markdown rendering and authenticated editor migration.
2. Authenticated Wiki, Community, Member, Admin, editor, upload/download, PDF,
   logout, and backend 401/403 flows still require a test account and backend
   environment for end-to-end acceptance.
3. Further bundle splitting is optional. Add it only if the remaining 500 kB
   warning causes a measured load-time problem.
