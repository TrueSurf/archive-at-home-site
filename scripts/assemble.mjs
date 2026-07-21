/**
 * 组装可部署的静态站点：
 * 把 VitePress 构建产物复制到 apps/site/docs/，
 * 使 apps/site 成为一个完整的静态部署根目录。
 * 文档内 404 统一替换为主站 404.html，全站共用同一页面。
 */
import { cpSync, existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
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
// docs/ 子路径下把相对 assets 改成 ../assets
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

console.log(`已组装: ${target}`)
console.log(`已统一 404: ${docs404}`)
