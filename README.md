# Archive at Home 站点

主站为纯静态 HTML，文档由 VitePress 构建（Markdown 驱动），两边共用同一份主题样式表。

## 目录结构

- `apps/site` — 主站静态文件（`index.html`、`404.html`、`assets/theme.css`）
- `apps/site/404.template.html` — 404 模板（占位符，assemble 按 SITE_BASE 生成 `404.html`）
- `apps/site/assets/theme.css` — **唯一主题样式表**，主站直接引用，docs 主题从这里 `@import`
- `apps/site/assets/site-shell.js` — 导航/页脚自定义元素（构建期 SSR 安全；运行时按 URL 推断站点前缀）
- `apps/docs` — VitePress 文档（`*.md` 源文件，新增 `.md` 即自动解析成页面）
- `apps/docs/public/openapi/server.yaml` — OpenAPI 定义，API 文档页在运行时解析渲染
- `scripts/serve-site.mjs` — 主站本地开发服务器（零依赖，始终按根路径服务）
- `scripts/assemble.mjs` — 把 docs 构建产物组装进 `apps/site/docs/`
- `scripts/build-root.mjs` — 根路径构建（`npm run build`）
- `scripts/build-gh.mjs` — GitHub Project Pages 构建（`npm run build:gh`）

## 路由

### 根路径部署（`npm run build` / 本地 `npm run dev`）

- `/` — 主站首页
- `/404.html` — 404
- `/docs/` `/docs/use` `/docs/node` — VitePress 页面
- `/docs/api/server` — API 参考

### GitHub Project Pages（`npm run build:gh`）

站点挂在子路径，例如 `https://<user>.github.io/archive-at-home-site/`：

- `/archive-at-home-site/` — 主站
- `/archive-at-home-site/docs/...` — 文档

`SITE_BASE` 默认 `/archive-at-home-site`，可用环境变量覆盖。

## Scripts

```bash
npm install
npm run dev         # 主站本地 127.0.0.1:4321（根路径，纯静态）
npm run docs:dev    # 文档本地 127.0.0.1:5173（base=/docs/）
npm run build       # 根路径产物 → apps/site（自定义域名 / 站点根）
npm run build:gh    # GitHub Pages 子路径产物 → apps/site
```

**请勿混用：**

| 场景 | 命令 | SITE_BASE | VitePress base |
|------|------|-----------|----------------|
| 本地主站 | `npm run dev` | （无） | 不适用 |
| 本地文档 | `npm run docs:dev` | （无） | `/docs/` |
| 根 URL 部署 | `npm run build` | 强制清空 | `/docs/` |
| GitHub Pages | `npm run build:gh` | `/archive-at-home-site` | `/archive-at-home-site/docs/` |

部署：把 `apps/site/` 整个目录作为静态站点根目录即可（构建后内含 `/docs`）。CI 使用 `build:gh` 并上传 `apps/site`。
