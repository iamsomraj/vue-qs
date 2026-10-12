import type { LocationQueryRaw, Router } from 'vue-router';
import type { QueryAdapter } from '@/adapters/types';
import { debug } from '@/lib/debug';
import { recordToSearchParams } from '@/lib/search-params';

export type { QueryAdapter, UpdateUrlOptions } from '@/adapters/types';

function toLocationQuery(search: URLSearchParams): LocationQueryRaw {
  const query: Record<string, string | string[]> = {};
  search.forEach((_, key) => {
    if (key in query) {
      return;
    }
    const values = search.getAll(key);
    query[key] = values.length === 1 ? (values[0] ?? '') : values;
  });
  return query;
}

/**
 * Creates an adapter backed by Vue Router. State follows every navigation,
 * including `router.push()`, `<RouterLink>` and Back/Forward.
 * Also used in Nuxt (see the Nuxt guide).
 *
 * URL updates go through `router.push` / `router.replace`,
 * so navigation guards run for each flushed update.
 *
 * @example
 * ```ts
 * import { createVueQs } from 'vue-qs'
 * import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router'
 *
 * app.use(router)
 * app.use(createVueQs({ adapter: createVueRouterAdapter(router) }))
 * ```
 */
export function createVueRouterAdapter(router: Router): QueryAdapter {
  return {
    getSearchParams() {
      return recordToSearchParams(router.currentRoute.value.query);
    },
    async updateUrl(search, { history, scroll }) {
      const navigate = history === 'push' ? router.push : router.replace;
      const failure = await navigate.call(router, {
        query: toLocationQuery(search),
        hash: router.currentRoute.value.hash,
      });
      if (failure) {
        debug('Navigation failed', failure);
        return;
      }
      if (scroll && typeof window !== 'undefined') {
        window.scrollTo({ top: 0 });
      }
    },
    subscribe(onChange) {
      return router.afterEach(() => onChange());
    },
  };
}
