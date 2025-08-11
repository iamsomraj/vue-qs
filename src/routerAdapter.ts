import type { Router } from 'vue-router';
import type { QueryAdapter } from '@/types';

/** Create an adapter backed by Vue Router instance */
export function createVueRouterQueryAdapter(router: Router): QueryAdapter {
  return {
    getQuery() {
      const q = router.currentRoute.value.query;
      const out: Record<string, string | undefined> = {};
      for (const [k, v] of Object.entries(q)) {
        if (Array.isArray(v)) out[k] = v[0] ?? undefined;
        else out[k] = v as string | undefined;
      }
      return out;
    },
    setQuery(next, options) {
      const route = router.currentRoute.value;
      const merged: Record<string, any> = { ...route.query };
      for (const [k, v] of Object.entries(next)) {
        if (v == null) delete merged[k];
        else merged[k] = v;
      }
      const currentNorm: Record<string, string> = {};
      for (const [k, v] of Object.entries(route.query)) {
        if (Array.isArray(v)) currentNorm[k] = (v[0] ?? '') as string;
        else if (v != null) currentNorm[k] = String(v);
      }
      const mergedNorm: Record<string, string> = {};
      for (const [k, v] of Object.entries(merged)) {
        if (Array.isArray(v)) mergedNorm[k] = (v[0] ?? '') as string;
        else if (v != null) mergedNorm[k] = String(v);
      }
      const sameKeys =
        Object.keys(currentNorm).length === Object.keys(mergedNorm).length &&
        Object.keys(currentNorm).every((k) => currentNorm[k] === mergedNorm[k]);
      if (sameKeys) return;

      const method = options?.history === 'push' ? router.push : router.replace;
      method.call(router, { query: merged });
    },
    subscribe(cb) {
      const unregister = router.afterEach(() => {
        cb();
      });
      return () => unregister();
    },
  };
}
