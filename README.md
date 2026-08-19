# community-web

Runtime: Node.js 24 LTS. The pinned local version is recorded in `.nvmrc`.

## Project setup
```bash
npm ci
```

### Development server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Verification

```bash
npm run lint
npm run test:vue3
```

The development and preview server use port `8888`. Production files are written to `dist`.
Deployment servers must fall back unknown application routes to `index.html` because the router uses HTML5 history mode.


### 查看过期版本
```
npm outdated
```
### markdown 
https://code-farmer-i.github.io/vue-markdown-editor/quick-start.html#install
