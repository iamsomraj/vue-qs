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
      const method = options?.history === 'push' ? router.push : router.replace;
      method.call(router, { query: merged });
    },
  };
}
