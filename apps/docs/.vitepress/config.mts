import { defineConfig } from 'vitepress'
import { getDocsBase, getMainHome, getSiteBase } from '../../../scripts/site-base.mjs'

const siteBase = getSiteBase()
const docsBase = getDocsBase()
const mainHome = getMainHome()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Archive at Home 文档',
  description: 'Archive at Home 使用指南、节点部署与 API 文档',
  // 本地默认 /docs/；GitHub Project Pages 为 /archive-at-home-site/docs/
  base: docsBase,
  cleanUrls: true,
  appearance: false,
  transformPageData(pageData) {
    pageData.frontmatter.navbar = false
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'site-navbar' || tag === 'site-footer',
      },
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  head: [
    [
      'script',
      {},
      "try{var d=matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.toggleAttribute('data-theme',d)}catch(e){}",
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        href:
          'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;600;700&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],
  themeConfig: {
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    // 供主题读取主站根路径（返回主站按钮）
    mainHome,
    siteBase,
    docsBase,

    nav: [
      { text: '使用指南', link: '/use' },
      { text: '节点部署', link: '/node' },
      { text: 'API 文档', link: '/api/server' },
    ],

    sidebar: [
      {
        text: '文档目录',
        items: [
          { text: '使用指南', link: '/use' },
          { text: '节点部署', link: '/node' },
          { text: 'Server API', link: '/api/server' },
        ],
      },
    ],
  },
})
