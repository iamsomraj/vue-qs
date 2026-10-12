import type { QueryAdapter } from '@/adapters/types';
import { renderQueryString } from '@/lib/url-encoding';

export type { QueryAdapter, UpdateUrlOptions } from '@/adapters/types';

const listeners = new Set<() => void>();
const PATCH_MARKER = Symbol.for('vue-qs:history-patched');

function notify(): void {
  listeners.forEach((listener) => listener());
}

/**
 * Patches `history.pushState` / `replaceState` once, so that URL changes made
 * by other code (links, other libraries) are picked up.
 */
function patchHistory(history: History): void {
  const patchable = history as History & { [PATCH_MARKER]?: boolean };
  if (patchable[PATCH_MARKER] === true) {
    return;
  }
  patchable[PATCH_MARKER] = true;
  (['pushState', 'replaceState'] as const).forEach((method) => {
    const original = history[method].bind(history);
    history[method] = (...args: Parameters<History['pushState']>): void => {
      original(...args);
      notify();
    };
  });
  window.addEventListener('popstate', notify);
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.history !== 'undefined';
}

/**
 * Creates an adapter for apps without a router, backed by the browser History API.
 * On the server it reads empty search params.
 *
 * @example
 * ```ts
 * import { createVueQs } from 'vue-qs'
 * import { createHistoryAdapter } from 'vue-qs/adapters/history'
 *
 * app.use(createVueQs({ adapter: createHistoryAdapter() }))
 * ```
 */
export function createHistoryAdapter(): QueryAdapter {
  return {
    getSearchParams() {
      return isBrowser() ? new URLSearchParams(window.location.search) : new URLSearchParams();
    },
    updateUrl(search, { history, scroll }) {
      if (!isBrowser()) {
        return;
      }
      const { pathname, search: currentSearch, hash } = window.location;
      const query = renderQueryString(search);
      if (new URLSearchParams(currentSearch).toString() === search.toString()) {
        // Nothing changed: avoid duplicate history entries
        return;
      }
      const url = `${pathname}${query}${hash}`;
      const method = history === 'push' ? 'pushState' : 'replaceState';
      window.history[method](window.history.state, '', url);
      if (scroll) {
        window.scrollTo({ top: 0 });
      }
    },
    subscribe(onChange) {
      if (!isBrowser()) {
        return () => undefined;
      }
      patchHistory(window.history);
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
  };
}
