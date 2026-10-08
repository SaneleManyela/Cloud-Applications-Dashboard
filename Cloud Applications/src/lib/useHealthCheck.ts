import { useState, useCallback } from 'react';
import { supabase, type AppRecord, type HealthStatus } from '@/lib/supabase';

export function useHealthCheck() {
  const [healthMap, setHealthMap] = useState<Record<string, HealthStatus>>({});
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set());

  const checkHealth = useCallback(async (app: AppRecord) => {
    setCheckingIds((prev) => new Set(prev).add(app.id));

    try {
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-health?url=${encodeURIComponent(app.url)}`;
      const resp = await fetch(fnUrl, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => 'Unknown error');
        setHealthMap((prev) => ({
          ...prev,
          [app.id]: {
            url: app.url,
            status: null,
            ok: false,
            latencyMs: 0,
            checkedAt: new Date().toISOString(),
            error: `Health check failed: ${resp.status} — ${errText}`,
          },
        }));
        return;
      }

      const data: HealthStatus = await resp.json();
      setHealthMap((prev) => ({ ...prev, [app.id]: data }));
    } catch (err) {
      setHealthMap((prev) => ({
        ...prev,
        [app.id]: {
          url: app.url,
          status: null,
          ok: false,
          latencyMs: 0,
          checkedAt: new Date().toISOString(),
          error: err instanceof Error ? err.message : 'Network error',
        },
      }));
    } finally {
      setCheckingIds((prev) => {
        const next = new Set(prev);
        next.delete(app.id);
        return next;
      });
    }
  }, []);

  const checkAll = useCallback(async (apps: AppRecord[]) => {
    await Promise.all(apps.map((app) => checkHealth(app)));
  }, [checkHealth]);

  return { healthMap, checkingIds, checkHealth, checkAll };
}
