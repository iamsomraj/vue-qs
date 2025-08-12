import type { Router } from 'vue-router';
import type { QueryAdapter } from '@/types';

/**
 * Wrap a Vue Router instance so the library can read / write query params
 * without depending directly on router APIs inside every hook.
 */
export function createVueRouterQueryAdapter(router: Router): QueryAdapter {
  return {
    getQuery() {
      // router.currentRoute.value.query can have arrays; take the first value to keep things simple
      const routeQuery = router.currentRoute.value.query;
      const flat: Record<string, string | undefined> = {};
      for (const [key, val] of Object.entries(routeQuery)) {
        flat[key] = Array.isArray(val)
          ? (val[0] as string | undefined)
          : (val as string | undefined);
      }
      return flat;
    },
    setQuery(next, options) {
      const route = router.currentRoute.value;
      const merged: Record<string, any> = { ...route.query };
      // Apply changes (undefined removes the key)
      for (const [key, val] of Object.entries(next)) {
        if (val == null) delete merged[key];
        else merged[key] = val;
      }

      // Normalize both current and new queries to detect if anything actually changed
      const normalize = (obj: Record<string, any>) => {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(obj)) {
          if (Array.isArray(v)) out[k] = (v[0] ?? '') as string;
          else if (v != null) out[k] = String(v);
        }
        return out;
      };
      const oldNorm = normalize(route.query as any);
      const newNorm = normalize(merged);
      const unchanged =
        Object.keys(oldNorm).length === Object.keys(newNorm).length &&
        Object.keys(oldNorm).every((k) => oldNorm[k] === newNorm[k]);
      if (unchanged) return;

      const navigate = options?.history === 'push' ? router.push : router.replace;
      navigate.call(router, { query: merged });
    },
    subscribe(cb) {
      // Run callback after each navigation so two-way mode can re-parse
      return router.afterEach(() => cb());
    },
  };
}
