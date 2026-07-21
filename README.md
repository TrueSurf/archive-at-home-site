# Archive at Home 站点

主站为纯静态 HTML，文档由 VitePress 构建（Markdown 驱动），两边共用同一份主题样式表。

## 目录结构

- `apps/site` — 主站静态文件（`index.html`、`404.html`、`assets/theme.css`）
- `apps/site/assets/theme.css` — **唯一主题样式表**，主站直接引用，docs 主题从这里 `@import`
- `apps/docs` — VitePress 文档（`*.md` 源文件，新增 `.md` 即自动解析成页面）
- `apps/docs/public/openapi/server.yaml` — OpenAPI 定义，API 文档页在运行时解析渲染
- `scripts/serve-site.mjs` — 主站本地开发服务器（零依赖）
- `scripts/assemble.mjs` — 把 docs 构建产物组装进 `apps/site/docs/`

## 路由

- `/` — 主站首页（静态）
- `/404.html` — 404（无页脚）
- `/docs/` `/docs/use` `/docs/node` — VitePress Markdown 页面
- `/docs/api/server` — 动态解析 `openapi/server.yaml` 的接口参考

## Scripts

```bash
npm install
npm run dev         # 主站 127.0.0.1:4321（纯静态）
npm run docs:dev    # 文档 127.0.0.1:5173（前缀 /docs/）
npm run build       # 构建 docs 并组装到 apps/site/docs/
```

部署：把 `apps/site/` 整个目录作为静态站点根目录即可（构建后内含 `/docs`）。
