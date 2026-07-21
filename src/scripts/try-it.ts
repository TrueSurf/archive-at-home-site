/**
 * API 文档页的「试一试」：在文档里直接调真实接口。
 * 与网页版解析工具共用本地保存的 API Key；未登录时引导去 /use。
 *
 * 用法（在 .astro 里声明，脚本自动绑定）：
 *   <div class="tryit" data-method="POST" data-path="/api/v1/parse" data-client="web/aah-docs">
 *     <input data-field="gallery_id" ...>   ← 进入请求体
 *     <input type="checkbox" data-field="force" ...>
 *     <button class="tryit-run">发送请求</button>
 *     <pre class="result-json"></pre>
 *   </div>
 * 可选 data-confirm="确认文案"（危险操作先弹确认）、
 *      data-save-key（响应里的 api_key 写回本地存储，用于 reset-key）。
 */

import { apiFetch, getApiKey, setApiKey } from './api-client';

function bindTryIt(root: HTMLElement) {
  const runBtn = root.querySelector<HTMLButtonElement>('.tryit-run');
  const output = root.querySelector<HTMLElement>('.result-json');
  if (!runBtn || !output) return;

  runBtn.addEventListener('click', async () => {
    if (!getApiKey()) {
      output.style.color = '';
      output.textContent = '还没有 API Key。请先到「使用方式」页用 Telegram 登录，Key 会保存在本浏览器，这里直接共用。';
      return;
    }

    const confirmText = root.dataset.confirm;
    if (confirmText && !window.confirm(confirmText)) return;

    const body: Record<string, unknown> = {};
    root.querySelectorAll<HTMLInputElement>('[data-field]').forEach((input) => {
      const name = input.dataset.field!;
      if (input.type === 'checkbox') {
        body[name] = input.checked;
      } else if (input.value.trim() !== '') {
        body[name] = input.value.trim();
      }
    });

    runBtn.disabled = true;
    const original = runBtn.textContent;
    runBtn.textContent = '请求中…';
    output.style.color = '';
    output.textContent = '';

    try {
      const data = await apiFetch(root.dataset.path!, {
        method: root.dataset.method ?? 'GET',
        client: root.dataset.client || 'web/aah-docs',
        body: root.dataset.method === 'GET' ? undefined : body,
      });
      output.textContent = JSON.stringify(data, null, 2);

      if (root.hasAttribute('data-save-key') && typeof (data as { api_key?: unknown }).api_key === 'string') {
        setApiKey((data as { api_key: string }).api_key);
        output.textContent += '\n\n// 新 Key 已保存到本浏览器，旧 Key 已失效';
      }
    } catch (err) {
      output.style.color = '#e8b0a7';
      output.textContent = (err as Error).message;
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = original;
    }
  });
}

document.querySelectorAll<HTMLElement>('.tryit').forEach(bindTryIt);
