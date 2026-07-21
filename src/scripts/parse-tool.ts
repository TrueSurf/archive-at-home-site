/**
 * 网页版解析工具：完整复刻油猴脚本「A@H 下载助手」的能力——
 * Telegram 登录 / 手动 Key、用户信息展示、画廊解析、强制重试、自动下载。
 *
 * 视图的登录态/未登录态两份 DOM 都在页面里，这里只做切换与数据填充。
 */

import {
  apiFetch,
  getApiKey,
  setApiKey,
  parseGalleryInput,
  KEY_CHANGED_EVENT,
  type UserProfile,
  type ParseResult,
} from './api-client';
import { telegramLoginUrl } from '../data/site';

const AUTO_DOWNLOAD_STORAGE = 'aah.autoDownload';
const X_CLIENT = 'web/aah-site';

function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`#${id} 不存在`);
  return el as T;
}

function setMsg(el: HTMLElement, text: string, type: 'info' | 'success' | 'error' | '' = '') {
  el.textContent = text;
  el.className = type ? `msg msg-${type}` : 'msg';
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

/* ---------- 登录回跳：/use?key=sk-xxx ---------- */

function absorbKeyFromUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  const key = params.get('key');
  if (!key) return false;
  setApiKey(key.trim());
  params.delete('key');
  const rest = params.toString();
  history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : ''));
  return true;
}

/* ---------- 用户信息 ---------- */

async function loadProfile() {
  const box = $('pt-profile');
  box.innerHTML = '<dt>状态</dt><dd>正在读取…</dd>';
  try {
    const data = await apiFetch<UserProfile>('/api/v1/me');
    box.innerHTML = '';
    const rows: Array<[string, string]> = [
      ['昵称', data.user.nickname || '（未设置）'],
      ['用户 ID', data.user.id],
      ['余额', `${data.balance} GP`],
      ['等级', data.user.level >= 1 ? `${data.user.level}（加速补充）` : '0（普通）'],
    ];
    for (const [k, v] of rows) {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      box.append(dt, dd);
    }
  } catch (err) {
    // Key 失效时回到登录态
    if ((err as { status?: number }).status === 401) {
      setApiKey(null);
      setMsg($('pt-login-msg'), '保存的 Key 已失效，请重新登录。', 'error');
      return;
    }
    box.innerHTML = '';
    const dt = document.createElement('dt');
    dt.textContent = '读取失败';
    const dd = document.createElement('dd');
    dd.textContent = (err as Error).message;
    box.append(dt, dd);
  }
}

/* ---------- 解析 ---------- */

let lastResult: ParseResult | null = null;

async function runParse(force: boolean) {
  const msgEl = $('pt-parse-msg');
  const resultEl = $('pt-result');
  const input = ($('pt-gallery') as HTMLInputElement).value;

  const gallery = parseGalleryInput(input);
  if (!gallery) {
    setMsg(msgEl, '没有识别出画廊。请粘贴完整的画廊链接（e-hentai.org/g/…），或直接填「画廊ID 密钥」。', 'error');
    return;
  }

  resultEl.innerHTML = '';
  setMsg(msgEl, force ? '正在强制重新解析…' : '正在解析，节点处理中…', 'info');
  lastResult = null;

  try {
    const data = await apiFetch<ParseResult>('/api/v1/parse', {
      method: 'POST',
      client: X_CLIENT,
      body: { gallery_id: gallery.galleryId, gallery_key: gallery.galleryKey, force },
    });
    lastResult = data;
    renderResult(data);
    setMsg(msgEl, '', '');
    loadProfile(); // 余额有变化，顺手刷新
    if (($('pt-autodl') as HTMLInputElement).checked && data.archive_url) {
      window.location.assign(data.archive_url);
    }
  } catch (err) {
    setMsg(msgEl, (err as Error).message || '解析失败', 'error');
  }
}

function renderResult(data: ParseResult) {
  const resultEl = $('pt-result');
  resultEl.innerHTML = '';
  if (!data.archive_url) {
    setMsg($('pt-parse-msg'), data.error || '解析失败，未返回下载链接', 'error');
    return;
  }

  const head = document.createElement('div');
  head.className = 'pt-result-head';

  const badge = document.createElement('span');
  badge.className = data.cached ? 'badge badge-green' : 'badge badge-amber';
  badge.textContent = data.cached ? '缓存命中 · 未消耗 GP' : '新解析完成';
  head.appendChild(badge);

  if (data.gp_cost) {
    const cost = document.createElement('span');
    cost.className = 'badge badge-sky';
    cost.textContent = `消耗 ${data.gp_cost} GP`;
    head.appendChild(cost);
  }

  const link = document.createElement('a');
  link.className = 'pt-result-url';
  link.href = data.archive_url;
  link.textContent = data.archive_url;
  link.target = '_blank';
  link.rel = 'noopener';

  const row = document.createElement('div');
  row.className = 'btn-row';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'btn btn-ghost btn-sm';
  copyBtn.textContent = '复制链接';
  copyBtn.addEventListener('click', async () => {
    copyBtn.textContent = (await copyText(data.archive_url!)) ? '已复制 ✓' : '复制失败';
    setTimeout(() => (copyBtn.textContent = '复制链接'), 1500);
  });

  const dlBtn = document.createElement('a');
  dlBtn.className = 'btn btn-primary btn-sm';
  dlBtn.href = data.archive_url;
  dlBtn.textContent = '直接下载';

  row.append(copyBtn, dlBtn);
  resultEl.append(head, link, row);
}

/* ---------- 视图切换与事件绑定 ---------- */

function render() {
  const hasKey = Boolean(getApiKey());
  $('pt-view-login').hidden = hasKey;
  $('pt-view-main').hidden = !hasKey;
  if (hasKey) loadProfile();
}

export function initParseTool() {
  // Telegram 登录按钮的回跳地址必须带当前域名，运行时拼装
  ($('pt-tg-login') as HTMLAnchorElement).href = telegramLoginUrl(
    `${window.location.origin}/use`,
  );

  const cameBackWithKey = absorbKeyFromUrl();
  render();
  if (cameBackWithKey) {
    setMsg($('pt-parse-msg'), '登录成功，API Key 已保存到本地浏览器。', 'success');
  }

  // 手动保存 Key
  $('pt-save-key').addEventListener('click', saveManualKey);
  $('pt-key-input').addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') {
      e.preventDefault();
      saveManualKey();
    }
  });

  async function saveManualKey() {
    const input = $('pt-key-input') as HTMLInputElement;
    const msgEl = $('pt-login-msg');
    const key = input.value.trim();
    if (!key) {
      setMsg(msgEl, '请输入 API Key。', 'error');
      return;
    }
    setMsg(msgEl, '正在验证 Key…', 'info');
    try {
      await apiFetch('/api/v1/me', { authKey: key });
      setApiKey(key);
      setMsg(msgEl, '', '');
      input.value = '';
    } catch (err) {
      setMsg(msgEl, `Key 验证失败：${(err as Error).message}`, 'error');
    }
  }

  // 主界面事件
  $('pt-parse').addEventListener('click', () => runParse(false));
  $('pt-force').addEventListener('click', () => runParse(true));
  $('pt-refresh').addEventListener('click', loadProfile);
  $('pt-logout').addEventListener('click', () => {
    setApiKey(null);
    setMsg($('pt-login-msg'), '已退出登录，Key 已从本浏览器移除。', 'info');
  });

  const autodl = $('pt-autodl') as HTMLInputElement;
  try {
    autodl.checked = localStorage.getItem(AUTO_DOWNLOAD_STORAGE) === '1';
  } catch {
    /* 忽略 */
  }
  autodl.addEventListener('change', () => {
    try {
      localStorage.setItem(AUTO_DOWNLOAD_STORAGE, autodl.checked ? '1' : '0');
    } catch {
      /* 忽略 */
    }
  });

  // 跨组件同步（如 API 文档页重置 Key 后）
  window.addEventListener(KEY_CHANGED_EVENT, render);
}

initParseTool();
