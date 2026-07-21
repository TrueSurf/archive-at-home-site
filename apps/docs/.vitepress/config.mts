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
      "try{var k='aah-theme';var s=localStorage.getItem(k);var d=s==='dark'||(!s&&matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark')}}catch(e){}",
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
    logo: '/logo.svg',
    // 字符串不被 withBase 处理，需写完整 docs 根路径
    logoLink: docsBase,
    siteTitle: 'Archive at Home 文档',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    // 供主题读取主站根路径（返回主站按钮）
    mainHome,
    siteBase,

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
