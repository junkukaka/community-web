# community-web 渐进式升级计划

> 阶段 1 产物，生成于 2026-08-19。本文只描述方案，不代表相关代码已经修改或验证。

## 1. 目标和迁移原则

- 最终运行时：Node.js 24 LTS。
- 最终框架：Vue 3 最新稳定版；当前稳定目标为 `3.5.41`，不采用 `3.6.0-rc`。
- 最终构建工具：Vite `8.2.x` 最新稳定补丁；当前为 `8.2.1`。
- 路由：Vue Router 稳定版，规划目标为 `5.2.x`。
- 状态管理：保留 Vuex，迁移到 Vuex 4，不引入 Pinia。
- UI：先迁移到 Vuetify 3 稳定线，不直接从 Vuetify 2 跨到 Vuetify 4。
- 保留 JavaScript、Options API、页面外观、路由 URL、接口路径、字段、权限语义及操作流程。
- 禁止 alpha、beta、RC；每个实施阶段开始前重新核对稳定标签和 peer dependencies。
- Vue 3、兼容模式、Vite 和第三方依赖分阶段处理。

## 2. 当前基线

版本以 `package-lock.json` 锁定值为准。

| 项目 | 声明版本 | 锁定/实际版本 | 结论 |
|---|---:|---:|---|
| Node.js | README 指定 16 | 阶段 0 使用 16.20.2 / npm 8.19.4 | `npm ci` 因锁文件不同步失败 |
| Vue | `^2.6.11` | `2.7.16` | Vue 2 已 EOL |
| vue-template-compiler | `^2.6.11` | `2.6.12` | 与 Vue 2.7.16 不匹配，阶段 2 必修 |
| Vue CLI / Webpack | `^4.5.0` / 间接 | `4.5.19` / `4.47.0` | 保留至阶段 5 |
| Vue Router | `^3.4.9` | `3.4.9` | Vue 2 路由 |
| Vuex | `^3.6.0` | `3.6.2` | 可迁移 Vuex 4 |
| Vuetify | `^2.6.1` | `2.7.2` | Vuetify 2 已 EOL，且全项目高度依赖 |
| vue-i18n | `^8.26.7` | `8.26.7` | Vue 2 旧版本线 |
| Axios | `^0.21.4` | `0.21.4` | 请求散布在组件中 |
| Markdown 编辑器 | `^1.7.12` | `1.7.12` | 当前使用 Vue 2 入口，包另有 Vue 3 版本线 |
| 富文本编辑器 | `^2.10.3` | `2.10.3` | `vue2-editor` 仅面向 Vue 2，已多年未发布 |
| vuetify-confirm | `^2.0.6` | `2.0.6` | 仅支持 Vuetify 2，已多年未发布 |

阶段 0 已确认：锁文件缺少四个 `@jridgewell/*` 间接依赖记录。阶段 2 必须先恢复 Node 16 下的可重复安装，不能删除锁文件后盲目重建。

## 3. Vue 2 / Vue 3 兼容性分析

### 3.1 全局 API

影响 `src/main.js`、`src/plugins/vuetify.js`、`src/i18n/index.js`、`src/router.js`、`src/store.js`：

- `new Vue(...).$mount()` 改为 `createApp(App).use(...).mount()`。
- `Vue.use()` 改为 `app.use()`。
- `Vue.prototype.$http/_/$store` 改为 `app.config.globalProperties`；Vuex 应通过 `app.use(store)` 注入。
- `Vue.config.productionTip` 在 Vue 3 中删除。
- `Vue.filter('date-format')` 在 Vue 3 中删除。当前确认 `src/components/wiki/HisTimeLine.vue` 使用该过滤器，应迁移为显式工具函数或 method，输出格式保持一致。
- 未发现项目自定义全局 mixin 或 directive。

### 3.2 模板和组件语法

- 发现 19 处 `.native`，集中在登录、注册、修改密码、搜索和后台列表。Vue 3 移除了 `.native`，需结合 Vuetify 3 的事件转发改为 `@keyup.enter` 或组件事件。
- 发现 6 处 `.sync`：两个 Drawer、两个 Search 和两个后台文章管理页面。迁移为 Vue 3 具名 `v-model`，并同步核对 Vuetify 3 属性名。
- 未发现 `slot-scope`、项目级 event bus、`Vue.mixin`、`Vue.directive`、`Vue.set` 或 `Vue.delete`。
- Options API、`created`、`mounted`、watch、computed 可以保留。
- 阶段 3 仍需依靠编译错误和 compat 警告检查 `v-if/v-for` 优先级、组件 `v-model`、attrs/listeners、插槽等运行时差异。

### 3.3 Router

核心文件为 `src/router.js`：

- `Vue.use(VueRouter)`、`new VueRouter()` 改为 `createRouter()`。
- `mode: 'history'` 改为 `history: createWebHistory(...)`。
- 删除覆写 `VueRouter.prototype.push` 的全局补丁；Router 4/5 原生返回 Promise。
- 保留所有 path、name、query、children、redirect 及登录前返回行为。
- 当前守卫只判断 `localStorage.Authorization` 是否存在。阶段 3 保持行为，权限安全增强留到阶段 7。
- 生产服务器必须继续配置 history fallback。

### 3.4 Vuex、登录和请求

影响 `src/store.js`、`src/App.vue`、`src/http.js`、`src/router.js`、`SignIn.vue` 及各退出入口：

- Vuex 3 -> 4 API 基本兼容；改为 `createStore()` 和 `app.use(store)`。
- 保留 state/mutations/getters，不引入 Pinia。
- 大量页面直接写 `this.$store.state`；阶段 3 暂不做无关业务重构，阶段 7 再收敛。
- Token 同时存在于 `Authorization`、`token`、序列化 `store`，退出路径清理不一致。
- Axios 同时发送 `Authorization` 和 `token` 请求头；Vue 3 迁移期间不得改变后端协议。
- `App.vue` 在 `beforeCreate` 和 `created` 间存在状态恢复顺序风险；行为修复归阶段 7。

### 3.5 Vuetify

至少 72 个 Vue 文件使用 Vuetify，属于最高风险项。迁移顺序：应用外壳 -> 登录/注册 -> Wiki -> Community -> Member -> Admin -> PDF。

阶段 3 目标为 Vuetify `3.13.x` 稳定线。重点核对：

- `v-data-table` 的 headers、slots、分页和搜索。
- `v-app-bar`、`v-navigation-drawer`、`v-dialog`、`v-form`、`v-text-field`。
- grid、间距、颜色、主题、断点和图标配置。
- `.sync`、`.native`、组件事件及 slot 名称。

每个页面族必须做截图和交互对比；仅“编译成功”不能作为 Vuetify 验收。Vuetify 4 可在整体稳定后单独立项，不纳入本轮目标。

## 4. 编辑器、上传、下载和 PDF

- Markdown：`@kangc/v-md-editor` 在 `src/main.js` 全局注册，Wiki、Community、历史和 PDF 页面使用。迁移到该包明确支持 Vue 3 的稳定版本线，保留 VuePress theme、Prism、行号、emoji、tip、todo、copy-code、highlight-lines。
- 富文本：`src/components/community/EditorVue.vue` 使用 `vue2-editor` + Quill 1。该库不支持 Vue 3，需替换为 Vue 3 兼容的 Quill 封装；若第三方封装不能保持行为，则建立项目内轻量适配组件。
- 富文本替代必须保持工具栏、HTML 输出、图片插入、事件参数和 CSS；用已有 HTML 做读取—编辑—保存 round-trip 对比。
- 上传：`EditorMd.vue`、`EditorVue.vue`、`wiki/Edit.vue`、`MemberInfo.vue` 使用 `FormData` 和既有 `/files`、`/minio` 接口，不得修改字段名、响应结构或 URL。
- 下载：`FilesList.vue` 使用 `<a download>`，保留文件名和打开方式。
- PDF：两个 `pdf.vue` 使用 jsPDF 和渲染后 DOM 尺寸；必须比较样本 PDF 的页数、字体、分页和内容完整性。
- XSS 净化与上传限制属于阶段 7；阶段 3 先保证已有内容格式不变。

## 5. 构建、环境和代理

- `vue.config.js` 仅设置端口 8888 和 `lintOnSave: false`，没有自定义 Webpack chain/configureWebpack。
- `babel.config.js` 仅使用 Vue CLI preset。
- 未发现 `.env*`、`VUE_APP_*` 或业务 `process.env`。
- `src/conf.js` 硬编码 dev/test/prod 地址，`src/http.js` 固定使用 prod；没有开发代理。
- 阶段 5 迁移到 Vite 时保留 `@` alias、端口 8888、`dist`、history、静态资源和 CSS 行为。
- 环境隔离和代理业务修复放在阶段 7。不得把秘密放入 `VITE_*`，因为它们会进入浏览器包。

## 6. 迁移矩阵

难度分为低、中、高、极高。目标补丁版本在实施当日再次锁定。

| 当前依赖/能力 | 当前版本 | 目标版本或替代 | 破坏性变化 | 主要影响文件 | 难度 | 验证方式 |
|---|---:|---|---|---|---|---|
| Node.js | 16.20.2 基线 | 24 LTS | npm/engine 与旧工具链兼容 | `.nvmrc`、package、锁文件 | 中 | 版本、干净安装、全套命令 |
| Vue | 2.7.16 | 阶段 3：`@vue/compat` 3.5.41；阶段 4：Vue 3.5.41 | createApp、全局 API、过滤器、模板行为 | `src/main.js`、全部 SFC | 高 | compat 警告、冒烟、构建 |
| vue-template-compiler | 2.6.12 | 阶段 2：2.7.16；阶段 3：`@vue/compiler-sfc` 3.5.41 | Vue 2 编译器移除 | package、构建链 | 中 | SFC 编译、build |
| `@vue/compiler-dom` | 3.5.13 | 移除直接声明，由 Vue 编译链管理 | 当前与 Vue 2 混装且用途不明 | package | 低 | 依赖树、build |
| Vue Router | 3.4.9 | 5.2.x | createRouter、history、导航 Promise | `router.js`、路由调用 | 中 | 全路由、刷新、守卫 |
| Vuex | 3.6.2 | 4.1.x | createStore、app.use | `store.js`、`main.js` | 低 | 登录、菜单、通知、刷新 |
| Vuetify | 2.7.2 | 3.13.x 稳定线 | 组件/prop/event/slot/theme/CSS | 至少 72 个 SFC | 极高 | 分模块截图与交互 |
| vue-i18n | 8.26.7 | Vue 3 兼容稳定主线 | createI18n、legacy 配置 | `i18n/index.js`、所有 `$t` | 中 | 中英韩与 fallback |
| v-md-editor | 1.7.12 Vue 2 | 官方 Vue 3 稳定版本线 | 安装入口、app.use、插件兼容 | `main.js`、Wiki/Community/PDF | 高 | 编辑、预览、高亮、插件、PDF |
| vue2-editor | 2.10.3 | Vue 3 Quill 封装或本地适配 | v-model、Quill、HTML/CSS、事件 | `EditorVue.vue` | 高 | HTML round-trip、工具栏、图片 |
| vuetify-confirm | 2.0.6 | 项目内 Vuetify 3 confirm 适配优先 | Vue.prototype 插件失效 | `main.js`、确认交互 | 中 | 确认/取消、键盘、Promise |
| Axios | 0.21.4 | Axios 1.x 稳定版（阶段 6） | headers、错误对象、取消请求 | `http.js`、全部 API 调用 | 中 | 请求头、上传、401/403、错误 |
| jsPDF | 2.5.0 | 最新兼容稳定版 | 模块导入、DOM/字体差异 | 两个 `pdf.vue` | 中 | 样本 PDF 对比 |
| Lodash | 4.17.21 | 保持或移除全局挂载 | globalProperties/显式导入 | `main.js`、使用 `_` 的组件 | 低 | 表单和编辑器校验 |
| Vue CLI / Webpack | 4.5.19 / 4.47.0 | Vite 8.2.x + plugin-vue | 入口、env、资源、alias、输出 | 根配置、public、main | 高 | dev、HMR、build、资源、history |
| Babel / ESLint | CLI preset / ESLint 6 | Vite 原生目标 + 兼容 ESLint 稳定配置 | 配置和规则变化 | 根配置、package | 中 | lint；禁止顺便格式化业务代码 |
| Sass / sass-loader | 1.30 / 8.0.2 | Vite 支持的 Sass；移除 loader | Sass 弃用语法、加载方式 | styles、package | 中 | 样式构建和截图 |
| 图标/字体 | MDI 6、mdi-icons 1、Roboto 4 | 与 Vuetify 3 匹配的稳定资源 | 图标名和 CSS 路径 | `main.js`、图标页面 | 中 | 图标缺失扫描、视觉对比 |

## 7. 分阶段实施顺序

### 阶段 2：稳定 Vue 2.7.16

精确统一 Vue/编译器，修复锁文件不同步，保持 CLI/Webpack/Vuetify 2；建立最低限度路由、Token、HTTP 和关键页面验证。验收必须包含 Node 16 下 `npm ci`、dev、build、lint/测试的明确结果。

### 阶段 3：Vue 3 + compat

切换 Vue 3.5.x / `@vue/compat`，保持 Webpack/Vue CLI；迁移入口、Router、Vuex、i18n、Vuetify 3、Markdown、富文本和 confirm。按页面族验证，记录全部 compat 警告。

### 阶段 4：移除 compat

处理过滤器、`.native`、`.sync`、v-model 和运行时警告，移除 compat alias/config，使用标准 Vue 3 构建并清零兼容警告。

### 阶段 5：Node 24 + Vite 8.2

添加 `.nvmrc` 和 engines，迁移 HTML/alias/assets/env/build，保留端口 8888、`dist` 和 history，删除 CLI/Webpack/Babel/loader 旧链；Node 24 下干净安装、dev、build。

### 阶段 6：第三方依赖

按 HTTP -> 编辑器/PDF -> 字体图标 -> lint/tooling 分类升级。重要库逐个验证，禁止 `npm audit fix --force`。

### 阶段 7：业务稳定性

在不改后端协议的前提下统一 Token 生命周期、401/403、响应拦截器、路由角色校验、环境选择、内容净化和上传校验。

### 阶段 8：最终验收

Node 24 干净安装、lint、测试、生产构建、dev 冒烟，以及登录、权限、Token、Wiki、Community、Member、Admin、编辑器、PDF、上传下载、三语言和代理验证。

## 8. 必须保持的行为契约

- API 路径、HTTP 方法、字段、响应读取路径和 Token header 在阶段 7 前不变。
- 路由 URL、query 名称、redirect 和返回登录前页面行为不变。
- localStorage key 在阶段 7 前不变。
- Markdown/富文本存储格式不变，已有内容必须可无损打开和再次保存。
- 上传字段、附件 URL、文件名和删除接口不变。
- UI 迁移不得改变信息层级、按钮含义、表格字段、Dialog 流程和响应式意图。
- 输出目录保持 `dist`，history 模式继续要求服务器 fallback 到 `index.html`。

## 9. 每阶段验证清单

1. Node/npm 和关键依赖实际版本。
2. 干净安装结果及锁文件预期差异。
3. lint、测试、生产构建。
4. 首页及直接访问嵌套路由。
5. 登录成功/失败、刷新恢复、退出、过期 Token。
6. 普通用户和管理员路由。
7. Wiki/Community 列表、详情、编辑、历史、评论、点赞、收藏。
8. Markdown/富文本、上传、下载和 PDF。
9. 中/英/韩及桌面/窄屏布局。
10. `git diff --check`、文件范围和本地提交编号。

## 10. 已知风险和决策

- **极高：Vuetify 2 -> 3。** 覆盖几乎全部页面，必须逐模块视觉回归。
- **高：富文本替代。** 可能改变保存 HTML，必须使用真实脱敏样本 round-trip。
- **高：compat 与 UI 库。** compat 不能保证 Vue 2 UI 库工作，所以 Vuetify 必须同步迁移。
- **高：阶段 0 未形成可重复安装基线。** 阶段 2 首要任务是锁文件，不是业务升级。
- **中：Router 直接到 5.x。** 官方说明非文件路由项目从 4 到 5无额外破坏变化；代码仍按 3 -> 4 规则迁移并完整验证。
- **中：Vuetify 4 暂不纳入。** 整体稳定后若有需要再单独立项。
- **待确认：IE11。** Vue 3 不支持 IE11；阶段 3 前必须确认业务不要求 IE11。
- **待确认：后端权限、HTTPS、CORS、生产 history fallback。** 前端仓库无法单独确认。

## 11. 调研依据

- Vue 3 migration build：<https://v3-migration.vuejs.org/migration-build>
- Vue 3 迁移指南：<https://v3-migration.vuejs.org/>
- Vue Router 3 -> 4：<https://router.vuejs.org/guide/migration/>
- Vue Router 4 -> 5：<https://router.vuejs.org/guide/migration/v4-to-v5>
- Vuex 3 -> 4：<https://vuex.vuejs.org/guide/migrating-to-4.0-from-3-x>
- Vuetify upgrade guide：<https://vuetifyjs.com/getting-started/upgrade-guide/>
- Vue CLI：<https://cli.vuejs.org/>
- v-md-editor：<https://www.npmjs.com/package/@kangc/v-md-editor>
- vue2-editor：<https://www.npmjs.com/package/vue2-editor>
- vuetify-confirm：<https://www.npmjs.com/package/vuetify-confirm>
- Vite：<https://www.npmjs.com/package/vite>
