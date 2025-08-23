export type AppCfg = { API_BASE: string };

export async function loadRuntimeConfig(): Promise<AppCfg> {
  try {
    const r = await fetch('/app-config.json', { cache: 'no-store' });
    if (r.ok) return r.json();
  } catch {}
  return { API_BASE: '/api/v1' };
}