/**
 * 共享 API 客户端：API Key 的本地存储 + 统一请求封装。
 * 解析工具与 API 文档页的「试一试」共用同一份 Key 与同套逻辑。
 */

import { site } from '../data/site';

const KEY_STORAGE = 'aah.apiKey';

export const KEY_CHANGED_EVENT = 'aah:key-changed';

export function getApiKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
}

/** 保存或清除（传 '' / null）API Key，并广播变更事件 */
export function setApiKey(key: string | null): void {
  try {
    if (key) {
      localStorage.setItem(KEY_STORAGE, key);
    } else {
      localStorage.removeItem(KEY_STORAGE);
    }
  } catch {
    /* 隐私模式等场景下静默失败，页面逻辑仍可用内存态 */
  }
  window.dispatchEvent(new CustomEvent(KEY_CHANGED_EVENT, { detail: key ?? '' }));
}

export interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  /** X-Client 来源标记，格式 大类/应用标识 */
  client?: string;
  /** 临时指定 Key（如验证尚未保存的 Key），不读写本地存储 */
  authKey?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** 发起一次 API 请求，自动附带 Key；失败时抛出带服务端信息的 ApiError */
export async function apiFetch<T = Record<string, unknown>>(
  path: string,
  { method = 'GET', body, client, authKey }: ApiRequestOptions = {},
): Promise<T> {
  const key = authKey ?? getApiKey();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (key) headers['Authorization'] = `Bearer ${key}`;
  if (client) headers['X-Client'] = client;

  let res: Response;
  try {
    res = await fetch(`${site.apiBase}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('网络请求失败，请检查网络后重试', 0);
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      (typeof data.error === 'string' && data.error) ||
      (typeof data.message === 'string' && data.message) ||
      `请求失败（HTTP ${res.status}）`;
    throw new ApiError(message, res.status);
  }
  return data as T;
}

export interface UserProfile {
  user: {
    id: string;
    nickname?: string;
    provider: string;
    level: number;
    created_at?: string;
    [k: string]: unknown;
  };
  balance: number;
}

export interface ParseResult {
  cached?: boolean;
  gp_cost?: number;
  archive_url?: string;
  error?: string;
}

/** 从用户输入中识别画廊：支持完整画廊链接，或「gid token」直填 */
export function parseGalleryInput(raw: string): { galleryId: string; galleryKey: string } | null {
  const input = raw.trim();
  const urlMatch = input.match(/\/g\/(\d+)\/([0-9a-zA-Z]+)/);
  if (urlMatch) return { galleryId: urlMatch[1], galleryKey: urlMatch[2] };
  const pairMatch = input.match(/^(\d{3,})[\s/_-]+([0-9a-zA-Z]{6,})$/);
  if (pairMatch) return { galleryId: pairMatch[1], galleryKey: pairMatch[2] };
  return null;
}
