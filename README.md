# community-web

本项目按 Vue 2 / Vuetify 2 维护，项目运行使用 Node 16.20.2；全局保持 Node 26。

## Node 使用方式

以下命令在项目根目录执行，适用于 Windows PowerShell 或 CMD。

- **原生命令**：直接执行 `node` / `npm`，使用当前终端 PATH 中的版本。普通终端目前使用全局 Node 26，不会因为进入本项目目录而自动切换版本。
- **专门本地化 Node 16 命令**：通过 `.\node16.cmd` 执行，使用项目便携版 Node 16.20.2 / npm 8.19.4。只影响该命令及其子进程，不改变全局 Node 或父终端 PATH。

本项目开发推荐使用下表右侧的 Node 16 命令。

## 常用命令对照

| 用途 | 原生命令（普通终端使用全局 Node 26） | 专门本地化 Node 16 命令 |
| --- | --- | --- |
| 查看 Node 版本 | `node --version` | `.\node16.cmd node --version` |
| 查看 npm 版本 | `npm --version` | `.\node16.cmd npm --version` |
| 查看可用 scripts | `npm run` | `.\node16.cmd npm run` |
| 启动开发服务 | `npm run serve` | `.\node16.cmd npm run serve` |
| 生产构建 | `npm run build` | `.\node16.cmd npm run build` |
| 代码检查，不自动修复 | `npm run lint -- --no-fix` | `.\node16.cmd npm run lint -- --no-fix` |
| 查看过期依赖 | `npm outdated` | `.\node16.cmd npm outdated` |

`npm run lint` / `.\node16.cmd npm run lint` 未指定 `--no-fix` 时可能自动修改源码，日常维护使用表格中的检查命令。

当前 `package.json` 没有 `test` script，因此 `npm run test` 和 `.\node16.cmd npm run test` 均不可用。
开发服务、构建及 lint 需要现有依赖完整且与项目匹配；Node 16 入口不会安装或修复依赖。

## 进入项目专用 Node 16 终端

先执行：

```powershell
.\node16.cmd
```

此时进入项目根目录的 Node 16 CMD 子终端，可以直接使用原生命令写法：

```cmd
node --version
npm --version
npm run serve
```

在该子终端中，直接执行的 `node` / `npm` 也使用本地 Node 16。执行以下命令返回原终端，原终端继续使用原来的全局 Node 26：

```cmd
exit
```

## 安装及维护命令（需明确授权后执行）

以下为命令写法对照，不是日常启动步骤。按照 `AGENTS.md` 和 `codex_guid.md`，未经用户明确授权，不得安装、重装或升级依赖，也不得修改依赖及构建配置。

| 用途 | 原生命令 | 专门本地化 Node 16 命令 |
| --- | --- | --- |
| 安装依赖 | `npm install` | `.\node16.cmd npm install` |
| 使用 legacy peer dependencies 方式安装 | `npm install --legacy-peer-deps` | `.\node16.cmd npm install --legacy-peer-deps` |
| 强制清除 npm 缓存 | `npm cache clean --force` | `.\node16.cmd npm cache clean --force` |

安装命令可能改写依赖树或锁文件；清除缓存会删除所选 npm 使用的缓存，本地 Node 16 入口没有隔离 npm 缓存或用户配置。
发现包下架、版本冲突或依赖缺失时，应先说明原因，不能默认修改 `package.json`、安装依赖或清理缓存。

## 本地运行时目录

便携版运行时位于 `.tools/node16/node-v16.20.2-win-x64/`，该目录已加入 Git 忽略规则。
其他电脑需要另行准备 Windows x64 Node 16.20.2 便携包，并保留上述目录结构。

## 参考与维护规范

- [AGENTS.md](AGENTS.md)
- [codex_guid.md](codex_guid.md)
- [Vue CLI 配置参考](https://cli.vuejs.org/config/)
- [Markdown 编辑器文档](https://code-farmer-i.github.io/vue-markdown-editor/quick-start.html#install)

### Codex 任务命令

请读取当前项目根目录的 request.md，按照 AGENTS.md 和 codex_guid.md 的规范执行其中的任务。
