/**
 * 组装可部署的静态站点：
 * 把 VitePress 构建产物复制到 apps/site/docs/，
 * 使 apps/site 成为一个完整的静态部署根目录。
 * 文档内 404 统一替换为主站 404.html，全站共用同一页面。
 * 为 GitHub Pages 生成 clean URL 目录（foo.html -> foo/index.html）。
 * 修正 VitePress alpha 的 preload stylesheet，确保 CSS 一定被应用。
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = fileURLToPath(new URL('../apps/site', import.meta.url))
const docsDist = fileURLToPath(new URL('../apps/docs/.vitepress/dist', import.meta.url))
const target = join(siteRoot, 'docs')
const site404 = join(siteRoot, '404.html')
const docs404 = join(target, '404.html')

if (!existsSync(docsDist)) {
  console.error('未找到 docs 构建产物，请先运行 npm run docs:build')
  process.exit(1)
}

rmSync(target, { recursive: true, force: true })
cpSync(docsDist, target, { recursive: true })

// 全站共用主站 404（覆盖 VitePress 自带 404）
if (!existsSync(site404)) {
  console.error('未找到主站 404.html')
  process.exit(1)
}
{
  let html = readFileSync(site404, 'utf8')
  html = html
    .replaceAll('href="assets/', 'href="../assets/')
    .replaceAll("href='assets/", "href='../assets/")
    .replaceAll('href="/assets/', 'href="../assets/')
    .replaceAll('src="assets/', 'src="../assets/')
    .replaceAll("src='assets/", "src='../assets/")
    .replaceAll('src="/assets/', 'src="../assets/')
  writeFileSync(docs404, html)
}

/**
 * VitePress 2 alpha 生成 rel="preload stylesheet" ... as="style"
 * 部分浏览器/预览环境只 preload 不应用样式。改为标准 stylesheet。
 */
function fixStylesheetLinks(html) {
  return html.replace(
    /<link\s+rel="preload stylesheet"\s+href="([^"]+)"\s+as="style"\s*\/?>/g,
    '<link rel="stylesheet" href="$1">',
  )
}

/**
 * GitHub Pages 不会把 /docs/node 映射到 node.html。
 * 将除 index/404 外的 *.html 复制为 name/index.html。
 */
function promoteCleanUrlDirs(dir) {
  const entries = readdirSync(dir)
  for (const name of entries) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      promoteCleanUrlDirs(full)
      continue
    }
    if (extname(name) !== '.html') continue
    if (name === 'index.html' || name === '404.html') continue

    const page = basename(name, '.html')
    const destDir = join(dir, page)
    mkdirSync(destDir, { recursive: true })
    let html = readFileSync(full, 'utf8')
    html = fixStylesheetLinks(html)
    writeFileSync(join(destDir, 'index.html'), html)
    // 同步修正原 html，避免 /docs/node.html 也无样式
    writeFileSync(full, html)
  }
}

// 先修正根下所有 html 的 stylesheet
function fixAllHtml(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      fixAllHtml(full)
      continue
    }
    if (extname(name) !== '.html') continue
    if (name === '404.html') continue
    let html = readFileSync(full, 'utf8')
    const next = fixStylesheetLinks(html)
    if (next !== html) writeFileSync(full, next)
  }
}

fixAllHtml(target)
promoteCleanUrlDirs(target)

writeFileSync(join(siteRoot, '.nojekyll'), '')

console.log('已组装: ' + target)
console.log('已统一 404: ' + docs404)
console.log('已修正 stylesheet 引用 / 生成 clean URL 目录')
console.log('已写入 apps/site/.nojekyll')
