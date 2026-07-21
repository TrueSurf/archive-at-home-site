/**
 * 站点级配置：导航、外部链接、API 地址。
 * 改这里即可全站生效，不要在页面里硬编码链接。
 */

export const site = {
  name: 'Archive at Home',
  shortName: 'A@H',
  slogan: '提交解析任务，由志愿者节点用自己的账号配额完成解析',
  description:
    'Archive at Home 是一个分布式的 E-Hentai 归档链接公益解析网络：' +
    '用户提交解析任务，由志愿者部署的节点用自己的账号配额完成解析。',
  apiBase: 'https://api.archive-at-home.org',
} as const;

export const links = {
  telegramChannel: 'https://t.me/ArchiveAtHome',
  telegramBot: 'https://t.me/ArchiveAtHome_bot',
  githubOrg: 'https://github.com/Archive-At-Home',
  repoMain: 'https://github.com/Archive-At-Home/archive-at-home',
  repoUserscript: 'https://github.com/Archive-At-Home/archive-at-home.user.js',
  repoBot: 'https://github.com/Archive-At-Home/archive-at-home-bot',
  userscriptInstall:
    'https://raw.githubusercontent.com/Archive-At-Home/archive-at-home.user.js/main/archive-at-home.user.js',
  jhentai: 'https://github.com/jiangtian616/JHenTai',
  jhentaiDownload: 'https://github.com/jiangtian616/JHenTai/releases',
  jhentaiApiBase: 'https://api.archive-at-home.org/jhentai',
} as const;

export const nav = [
  { href: '/', label: '首页' },
  { href: '/use', label: '使用方式' },
  { href: '/api', label: 'API 文档' },
  { href: '/node', label: '贡献节点' },
  { href: '/tools', label: '工具与资源' },
] as const;

/** Telegram 登录中转页，登录成功后带 key 跳回本站 */
export function telegramLoginUrl(redirectUrl: string): string {
  const url = new URL('/auth/telegram/login', site.apiBase);
  url.searchParams.set('redirect_url', redirectUrl);
  url.searchParams.set('param_name', 'key');
  return url.toString();
}
