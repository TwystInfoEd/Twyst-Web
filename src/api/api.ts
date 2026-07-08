export const API_BASE: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchJson<T = any>(path: string, opts?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const r = await fetch(url, opts);
  const t = await r.text();
  let p: any = {};
  try {
    p = JSON.parse(t);
  } catch {
    p = { raw: t };
  }
  if (!r.ok) throw new Error(p.detail || p.message || r.statusText);
  return p as T;
}

export function fv(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "—";
  if (Math.abs(v) >= 1000) return v.toFixed(0);
  if (Math.abs(v) >= 100) return v.toFixed(1);
  return v.toFixed(3);
}

export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}
