import {
  isNavigationFailure,
  NavigationFailureType,
  type LocationQueryRaw,
  type Router,
} from 'vue-router';
import type { QueryAdapter } from '@/adapters/types';
import { debug } from '@/lib/debug';
import { recordToSearchParams } from '@/lib/search-params';

export type { QueryAdapter, UpdateUrlOptions } from '@/adapters/types';

function sortedString(search: URLSearchParams): string {
  const copy = new URLSearchParams(search);
  copy.sort();
  return copy.toString();
}

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
      if (failure && !isNavigationFailure(failure, NavigationFailureType.duplicated)) {
        debug('Navigation failed', failure);
        return false;
      }
      const actual = recordToSearchParams(router.currentRoute.value.query);
      if (sortedString(actual) !== sortedString(search)) {
        debug('Navigation was redirected', router.currentRoute.value.fullPath);
        return false;
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
