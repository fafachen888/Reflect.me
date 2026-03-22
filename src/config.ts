/**

API 客户端配置

USE_REAL_API = false  → Demo/Mock 模式（当前默认）
USE_REAL_API = true   → 连接真实后端
*/
export const API_CONFIG = {
  USE_REAL_API: false,
  BASE_URL: 'http://localhost:3001',
  TOKEN_KEY: 'jingyu_token',
};

export function getToken(): string | null {
  try { return localStorage.getItem(API_CONFIG.TOKEN_KEY); } catch { return null; }
}
export function setToken(t: string) { try { localStorage.setItem(API_CONFIG.TOKEN_KEY, t); } catch {} }
export function clearToken() { try { localStorage.removeItem(API_CONFIG.TOKEN_KEY); } catch {} }

export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: any = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(`${API_CONFIG.BASE_URL}${path}`, { ...options, headers });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || `HTTP ${resp.status}`);
  return data;
}
