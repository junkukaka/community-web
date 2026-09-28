# AGENTS.md

## 1. Project Overview

This is a legacy frontend project that has recently been migrated from Vue 2 to Vue 3.

The current modernization goals are:

1. Stabilize the Vue 3 migration.
2. Upgrade outdated dependencies to modern stable versions.
3. Remove deprecated Vue 2-era APIs and libraries.
4. Refactor legacy code gradually.
5. Improve maintainability without changing existing business behavior.
6. Keep the existing UI layout and user workflow unless explicitly requested.

This is an existing production business system, not a greenfield project.

Business compatibility is more important than architectural purity.

---

## 2. Primary Rules

Before modifying code:

1. Inspect the existing project structure.
2. Inspect package.json and lock files.
3. Inspect current Vue, router, state management, build tool, UI libraries and major dependencies.
4. Search the project for usage of a dependency before upgrading or removing it.
5. Identify breaking changes before changing a major dependency.
6. Understand the affected business flow before refactoring it.

Do NOT blindly upgrade all packages at once.

Do NOT assume that "latest" automatically means "compatible".

Prefer the latest stable release that is compatible with the project's current architecture.

Do not use alpha, beta, RC, canary or experimental versions unless explicitly requested.

---

## 3. Vue 3 Rules

The project must remain Vue 3.

Do not introduce Vue 2 compatibility code unless temporarily required to complete migration.

Gradually remove Vue 2 patterns including, where applicable:

- Vue.extend
- filters
- $listeners
- $children
- $scopedSlots legacy usage
- old slot syntax
- .native modifiers
- deprecated lifecycle hooks
- Vue 2 plugin initialization patterns
- Vue 2-specific event bus implementations
- deprecated Vue Router APIs
- deprecated Vuex patterns

Use Vue 3 native patterns.

Prefer:

- Composition API for newly refactored complex components
- `<script setup>` for new components when appropriate
- composables for reusable stateful logic
- Vue 3 emits / props definitions
- Vue Router 4 APIs
- modern async/await code

However:

Do NOT rewrite every Options API component simply for stylistic consistency.

Existing stable components may remain Options API unless refactoring provides a concrete benefit.

---

## 4. Dependency Upgrade Policy

When upgrading dependencies:

### Step 1 - Audit

Classify dependencies into:

- framework
- router
- state management
- UI libraries
- HTTP/network
- utility libraries
- build tools
- testing tools
- lint/format tools
- development-only dependencies
- obsolete dependencies

For every major-version upgrade, check:

- breaking changes
- required Node version
- required Vue version
- changed APIs
- changed configuration
- removed APIs
- peer dependencies

### Step 2 - Upgrade

Upgrade in logical groups.

Preferred order:

1. Node / package manager compatibility
2. build tooling
3. Vue ecosystem
4. router/state
5. UI framework/components
6. HTTP and utility libraries
7. lint / formatting / testing
8. minor utility packages

Do not perform unrelated major upgrades in the same change if they make failures difficult to isolate.

### Step 3 - Cleanup

After replacing or removing a dependency:

- search the entire project for references
- remove unused imports
- remove obsolete configuration
- remove unused packages
- remove compatibility hacks that are no longer required

Do not keep obsolete dependencies "just in case".

---

## 5. Node and Package Manager

The Node.js version used by the project must be explicitly documented.

Before changing Node:

1. inspect package.json engines
2. inspect lock files
3. inspect build tooling requirements
4. inspect CI/CD requirements

Do not confuse the Node runtime used internally by Codex with the Node version required by this project.

If newer dependencies require a newer Node version:

- explain why
- update the documented project Node version
- update package.json engines when appropriate
- update .nvmrc or equivalent if the project uses one

Do not silently change the runtime requirement.

---

## 6. Refactoring Rules

Refactoring must preserve behavior.

Before refactoring a module:

1. Understand its purpose.
2. Identify its callers.
3. Identify API/server interactions.
4. Identify shared state.
5. Identify route dependencies.
6. Identify DOM/CSS dependencies.
7. Identify side effects.

Refactor incrementally.

Prefer:

small safe changes
over
large rewrites.

Do NOT rewrite working business logic simply because another implementation is cleaner.

Do NOT rename business fields, backend parameters, API fields or route parameters unless required.

---

## 7. Component Refactoring

When a component is too large, it may be split into:

- presentation components
- composables
- service/API modules
- utility functions
- business-domain modules

Extract reusable logic only when reuse or complexity justifies it.

Avoid excessive abstraction.

Do not create unnecessary wrapper components.

Do not turn simple logic into multiple layers purely for architectural style.

---

## 8. API Layer

API behavior must remain compatible with the backend.

Do not change:

- API URL
- HTTP method
- request field names
- response assumptions
- authentication mechanism
- headers
- backend data format

unless the task explicitly requires it.

Prefer centralizing duplicated request logic into the existing API/service layer.

Do not introduce a new networking library without a clear reason.

---

## 9. UI / CSS Rules

Existing layouts are considered part of the required behavior.

Dependency upgrades and refactoring must not unintentionally change:

- positioning
- spacing
- component size
- fonts
- table layout
- dialog layout
- form layout
- responsive behavior
- colors
- user workflow

Do not redesign pages unless explicitly requested.

When a library upgrade causes visual differences, adapt the implementation so that the existing intended layout is preserved.

Avoid large global CSS changes.

Prefer scoped/localized fixes.

---

## 10. State Management

Do not migrate state management solely because a newer library exists.

First inspect the current implementation.

If migration is justified, migrate incrementally.

Business behavior and state lifecycle must remain unchanged.

Do not duplicate global state inside local components.

---

## 11. JavaScript / TypeScript

Do not convert the entire project from JavaScript to TypeScript unless explicitly requested.

For JavaScript code:

prefer modern ES syntax where it improves readability.

Avoid unnecessary syntax rewrites.

For existing TypeScript code:

preserve and improve type safety.

Do not use `any` simply to bypass migration errors unless unavoidable and documented.

---

## 12. Build Tooling

Do not change build systems merely for fashion.

If the project already uses a modern supported build system and works correctly, improve it rather than replacing it.

If migration is necessary:

1. analyze current configuration
2. identify plugins
3. identify environment variables
4. identify proxy configuration
5. identify production build behavior
6. identify deployment assumptions

Production output compatibility must be preserved.

---

## 13. Verification

After each meaningful change, perform relevant checks.

At minimum, when available:

- install dependencies
- build
- lint
- unit tests
- type checking
- application startup

Do not consider a task complete only because package installation succeeds.

The application must compile successfully.

For UI-related changes, inspect the affected page logic and CSS for likely regressions.

If automated browser testing is available, use it for important flows.

---

## 14. Error Handling

Do not fix errors by disabling validation globally.

Do not solve dependency conflicts using unsafe flags as the default solution.

Avoid:

- --force
- --legacy-peer-deps

unless there is a documented unavoidable compatibility reason.

Fix the underlying version incompatibility whenever practical.

---

## 15. Removal Policy

Before deleting:

- components
- JS files
- CSS
- dependencies
- routes
- utilities
- APIs

search the entire codebase for references.

If usage is uncertain, do not delete it.

---

## 16. Work Strategy

For large modernization tasks:

Phase 1:
Analyze only.

Phase 2:
Create migration plan.

Phase 3:
Upgrade dependency groups.

Phase 4:
Fix compatibility problems.

Phase 5:
Refactor legacy implementation.

Phase 6:
Remove obsolete code.

Phase 7:
Run verification.

Phase 8:
Produce final report.

Do not mix all phases into one uncontrolled rewrite.

---

## 17. Git / Change Safety

Keep changes logically grouped.

Avoid modifying unrelated files.

Do not perform destructive Git operations.

Do not delete user changes.

Do not reset the repository unless explicitly requested.

Before large changes, understand the current git status.

---

## 18. Documentation

When modernization changes important project requirements, update relevant documentation.

Record:

- Node version
- package manager
- build command
- development command
- important dependency changes
- removed legacy dependencies
- remaining technical debt

---

## 19. Decision Principle

When choosing between:

A. cleaner architecture with higher regression risk

and

B. slightly less elegant architecture with strong compatibility

prefer B for existing business functionality.

Modernization must be incremental, testable and reversible.

---

## 20. Final Report

After completing a modernization task, report:

### Upgraded
List upgraded major dependencies.

### Removed
List obsolete dependencies and legacy code removed.

### Refactored
List important modules/components refactored.

### Compatibility fixes
Describe Vue 3 or dependency compatibility changes.

### Verification
Report:

- install result
- build result
- lint result
- test result
- runtime result

### Remaining issues
List unresolved technical debt or risky areas.

Do not hide warnings or unresolved failures.


## UI Framework / Vuetify Rules

Vuetify is the official UI framework for this project.

The project must continue using Vuetify.

The modernization target is the latest stable Vuetify version that is compatible
with the project's Vue and build environment.

Current target:
- Vue 3
- latest stable Vuetify
- do not use beta, RC, nightly or experimental releases

Do NOT:

- remove Vuetify
- replace Vuetify with another UI framework
- replace Vuetify components with custom HTML/CSS without a concrete reason
- introduce Element Plus, Naive UI, Quasar, Ant Design Vue or another UI framework
- keep Vuetify 2 compatibility code permanently
- blindly replace Vuetify components without checking migration differences

When upgrading Vuetify:

1. Inspect the currently installed Vuetify version.
2. Identify all Vuetify components used by the project.
3. Identify deprecated or removed Vuetify APIs.
4. Identify changed component props, events, slots and CSS classes.
5. Identify theme/configuration changes.
6. Identify layout/grid changes.
7. Identify icon configuration.
8. Identify date/input/table/dialog/navigation component changes.
9. Migrate incrementally.
10. Verify affected pages after each major migration group.

Prefer native modern Vuetify components and APIs.

Do not create custom implementations when Vuetify already provides an appropriate
maintained component.

However, preserving existing business behavior and layout is more important than
forcing every page to use a newer Vuetify component.

---

## Vuetify Layout Compatibility

Existing page layout must remain visually compatible unless a redesign is explicitly requested.

Vuetify upgrades must not unintentionally change:

- page width
- container width
- grid layout
- spacing
- margins
- padding
- form alignment
- button sizes
- table dimensions
- dialog dimensions
- navigation layout
- typography
- responsive breakpoints

When Vuetify's new defaults cause visual differences, explicitly configure
Vuetify or local component styles to preserve the intended existing layout.

Do not solve layout differences using large global CSS overrides unless necessary.

Prefer:

1. Vuetify props/configuration
2. Vuetify utility classes
3. component-scoped styles
4. narrowly targeted global styles

in that order.