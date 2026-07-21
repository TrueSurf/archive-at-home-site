/**
 * 主站静态文件服务器（零依赖，仅本地开发用）。
 * - 服务 apps/site 下的静态文件
 * - 目录自动补 index.html，扩展名可省略（clean URL）
 * - 未命中时统一返回站点根目录 404.html（状态码 404）
 * - 默认端口 4321；被占用时自动尝试后续端口
 */
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../apps/site', import.meta.url))
const preferredPort = Number(process.env.PORT ?? 4321)
const notFoundPage = join(root, '404.html')

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '')
  let file = join(root, safe)
  if (!file.startsWith(root)) return null // 防目录穿越

  // 所有未命中统一走根 404；不单独使用 docs/404.html
  if (existsSync(file) && statSync(file).isDirectory()) {
    const index = join(file, 'index.html')
    if (existsSync(index) && statSync(index).isFile()) return index
    return null
  }
  if (!existsSync(file) && !extname(file) && existsSync(file + '.html')) {
    file += '.html'
  }
  // 若命中的是 docs 内置 404，仍回落到站点统一 404
  if (existsSync(file) && statSync(file).isFile()) {
    const rel = file.slice(root.length).replace(/\\/g, '/')
    if (rel === '/docs/404.html' || rel === 'docs/404.html') return null
    return file
  }
  return null
}

function createAppServer() {
  return createServer((req, res) => {
    const urlPath = new URL(req.url ?? '/', 'http://localhost').pathname
    const file = resolveFile(urlPath)
    const target = file ?? notFoundPage
    const status = file ? 200 : 404
    res.writeHead(status, {
      'Content-Type': mime[extname(target)] ?? 'application/octet-stream',
    })
    createReadStream(target).pipe(res)
  })
}

function listen(port, attemptsLeft) {
  const server = createAppServer()
  server.once('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const next = port + 1
      console.warn(`端口 ${port} 已被占用，尝试 ${next} …`)
      listen(next, attemptsLeft - 1)
      return
    }
    if (err && err.code === 'EADDRINUSE') {
      console.error(
        `无法启动：端口 ${preferredPort}–${port} 均被占用。\n` +
          `可先结束占用进程，或指定空闲端口：PORT=4330 npm run dev`,
      )
      process.exit(1)
    }
    console.error(err)
    process.exit(1)
  })
  server.listen(port, '127.0.0.1', () => {
    console.log(`主站开发服务器: http://127.0.0.1:${port}`)
  })
}

listen(preferredPort, 20)
