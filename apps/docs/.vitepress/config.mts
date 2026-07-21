import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Archive at Home 文档',
  description: 'Archive at Home 使用指南、节点部署与 API 文档',
  // 部署在主站 /docs 路径下；本地 dev 同样以 /docs/ 为前缀
  base: '/docs/',
  cleanUrls: true,
  // 使用自定义 data-theme，与主站共用 aah-theme
  appearance: false,
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  head: [
    [
      'script',
      {},
      `try{var k='aah-theme';var s=localStorage.getItem(k);var d=s==='dark'||(!s&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.setAttribute('data-theme','dark')}catch(e){}`,
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
    // 字符串形式不会被 withBase 处理；点 logo 回文档首页
    logoLink: '/docs/',
    siteTitle: 'Archive at Home 文档',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 「首页 / 返回主站」由主题插槽注入（同域根路径不能走 withBase）
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

    socialLinks: [
      { icon: 'telegram', link: 'https://t.me/ArchiveAtHome' },
    ],
  },
})
