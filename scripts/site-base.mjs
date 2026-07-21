/**
 * 站点公共路径前缀。
 * - 本地 / 自定义域名根路径：SITE_BASE 为空 → docs base = /docs/
 * - GitHub Project Pages：SITE_BASE=/archive-at-home-site → docs base = /archive-at-home-site/docs/
 */
export function normalizeSiteBase(raw) {
  if (raw == null || raw === '' || raw === '/') return ''
  let s = String(raw).trim().replace(/\\/g, '/')
  if (!s.startsWith('/')) s = `/${s}`
  s = s.replace(/\/+$/, '')
  return s
}

export function getSiteBase() {
  return normalizeSiteBase(process.env.SITE_BASE)
}

/** 始终以 / 结尾，如 /docs/ 或 /archive-at-home-site/docs/ */
export function getDocsBase() {
  return `${getSiteBase()}/docs/`
}

/** 主站首页路径，如 / 或 /archive-at-home-site/ */
export function getMainHome() {
  const b = getSiteBase()
  return b ? `${b}/` : '/'
}
