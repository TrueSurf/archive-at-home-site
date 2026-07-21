const SUPPORT_EMAIL = 'support@archive-at-home.org'
const GITHUB_REPO = 'https://github.com/Archive-At-Home/archive-at-home'
const TELEGRAM_URL = 'https://t.me/ArchiveAtHome'

const brandMark = `
  <svg class="brand-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1c.9 3.2 2 4.6 3.3 5.9C16.6 8.2 18 9.3 21.2 10.2c.4.1.4.7 0 .8-3.2.9-4.6 2-5.9 3.3C14 15.6 12.9 17 12 20.2c-.1.4-.7.4-.8 0-.9-3.2-2-4.6-3.3-5.9C6.6 13 5.2 11.9 2 11c-.4-.1-.4-.7 0-.8C5.2 9.3 6.6 8.2 7.9 6.9 9.2 5.6 10.3 4.2 11.2 1c.1-.4.7-.4.8 0Z"/>
    <circle cx="19" cy="18.5" r="2.2"/>
    <circle cx="5" cy="18.5" r="2.2"/>
  </svg>`

const telegramIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.5.5 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024q-.159.037-5.061 3.345q-.72.495-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789q.04-.324.893-.663q5.247-2.286 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635"/></svg>`
const mailIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>`
const githubIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
const menuIcon = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 5.5h14M3 10h14M3 14.5h14"/></svg>`

function normalizeBase(value, fallback) {
  const base = value || fallback
  return `${base.startsWith('/') ? base : `/${base}`.replace(/\/+/g, '/')}${base.endsWith('/') ? '' : '/'}`
}

function iconLink(href, label, icon, external = false) {
  return `<a class="nav-icon-link" href="${href}" title="${label}" aria-label="${label}"${external ? ' target="_blank" rel="noopener"' : ''}>${icon}</a>`
}

function syncDeviceTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const apply = () => {
    document.documentElement.classList.toggle('dark', media.matches)
    document.documentElement.toggleAttribute('data-theme', media.matches)
  }
  apply()
  media.addEventListener('change', apply)
}

class SiteNavbar extends HTMLElement {
  connectedCallback() {
    const docsMode = this.hasAttribute('docs-mode')
    const siteBase = normalizeBase(this.getAttribute('site-base'), '/')
    const docsBase = normalizeBase(this.getAttribute('docs-base'), `${siteBase}docs/`)
    const homeHref = docsMode ? docsBase : siteBase
    const path = window.location.pathname.replace(/\/+$/, '/')
    const navItems = [
      ['首页', homeHref],
      ['使用指南', `${docsBase}use`],
      ['节点部署', `${docsBase}node`],
      ['API 文档', `${docsBase}api/server`],
    ]
    const links = navItems.map(([label, href], index) => {
      const active = index === 0
        ? path === homeHref
        : path === href || path === `${href}/` || path === `${href}.html`
      return `<a href="${href}"${active ? ' class="active" aria-current="page"' : ''}>${label}</a>`
    }).join('')

    this.innerHTML = `
      <header class="site-header">
        <div class="site-header-inner">
          <a class="site-logo" href="${homeHref}">
            ${brandMark}
            <span>Archive at Home</span>
            ${docsMode ? '<span class="site-logo-section">文档</span>' : ''}
          </a>
          <div class="site-header-end">
            <button class="nav-toggle" type="button" aria-label="打开导航" aria-expanded="false">${menuIcon}</button>
            <nav class="site-nav" aria-label="主导航">
              ${links}
              ${docsMode ? `<a class="nav-home-link" href="${siteBase}" target="_self">回到主页</a>` : ''}
              <div class="nav-social">
                ${iconLink(TELEGRAM_URL, 'Telegram 频道', telegramIcon, true)}
                ${iconLink(`mailto:${SUPPORT_EMAIL}`, `发送邮件至 ${SUPPORT_EMAIL}`, mailIcon)}
                ${iconLink(GITHUB_REPO, 'GitHub', githubIcon, true)}
              </div>
            </nav>
          </div>
        </div>
      </header>`

    const toggle = this.querySelector('.nav-toggle')
    const nav = this.querySelector('.site-nav')
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open')
      toggle.setAttribute('aria-expanded', String(open))
      toggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航')
    })
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const docsMode = this.hasAttribute('docs-mode')
    const siteBase = normalizeBase(this.getAttribute('site-base'), '/')
    const docsBase = normalizeBase(this.getAttribute('docs-base'), `${siteBase}docs/`)
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-note">
            <p><strong>Archive at Home</strong> · 由志愿者维护的公益项目，与 E-Hentai 官方无关。</p>
            <p>解析能力来自志愿者节点共享的账号配额。有富余配额可<a href="${docsBase}node">部署节点</a>。</p>
            <p>© 2026 Archive at Home · 源代码以开源协议发布于 <a href="https://github.com/Archive-At-Home" target="_blank" rel="noopener">GitHub</a></p>
          </div>
          <nav class="footer-links" aria-label="页脚导航">
            <a href="https://t.me/ArchiveAtHome" target="_blank" rel="noopener">Telegram 频道</a>
            <a href="https://t.me/ArchiveAtHome_bot" target="_blank" rel="noopener">Telegram Bot</a>
            <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
            <a href="${GITHUB_REPO}" target="_blank" rel="noopener">主仓库（Server / Node）</a>
            <a href="${docsMode ? siteBase : `${docsBase}use`}">${docsMode ? '主站首页' : '文档'}</a>
            <a href="https://github.com/Archive-At-Home/archive-at-home.user.js" target="_blank" rel="noopener">油猴脚本</a>
          </nav>
        </div>
      </footer>`
  }
}

if (typeof window !== 'undefined') {
  syncDeviceTheme()
  if (!customElements.get('site-navbar')) customElements.define('site-navbar', SiteNavbar)
  if (!customElements.get('site-footer')) customElements.define('site-footer', SiteFooter)
}
