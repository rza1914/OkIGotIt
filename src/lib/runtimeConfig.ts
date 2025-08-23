export type AppCfg = { API_BASE: string };

export async function loadRuntimeConfig(): Promise<AppCfg> {
  try {
    const r = await fetch('/app-config.json', { cache: 'no-store' });
    const ct = r.headers.get('content-type') || '';
    if (!r.ok || !ct.includes('application/json')) {
      throw new Error('cfg-not-json');
    }
    return await r.json();
  } catch (err) {
    console.warn('Failed to load app config:', err);
    return { API_BASE: '/api/v1' }; // پیش‌فرض امن
  }
}