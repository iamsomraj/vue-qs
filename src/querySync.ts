import { reactive } from 'vue';
import type { QueryAdapter, RuntimeEnv } from '@/types';

// True only in a real browser environment (not during SSR)
function inBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// Gather runtime flags so other code does not directly touch global objects
function createRuntimeEnv(): RuntimeEnv {
  const client = inBrowser();
  return { isClient: client, win: client ? window : null };
}

// Ensure we patch the History API only once (in browser) to emit a custom event
// when pushState / replaceState are invoked so two-way sync can observe manual
// history mutations that do not trigger 'popstate'.
let historyPatched = false;
function patchHistoryOnce(win: Window) {
  if (historyPatched) return;
  historyPatched = true;
  const { history } = win;
  let suppressEvent = false;
  // Expose a helper so adapter can suppress dispatch for its own writes
  (history as any).__vueQsSuppressNext = (fn: () => void) => {
    suppressEvent = true;
    try {
      fn();
    } finally {
      suppressEvent = false;
    }
  };
  const dispatch = () => {
    // Custom event (namespaced to avoid collisions)
    win.dispatchEvent(new Event('vue-qs:historychange'));
  };
  const wrap = <T extends keyof History>(method: T) => {
    const original = history[method] as any;
    history[method] = function (this: History, ...args: any[]) {
      const ret = original.apply(this, args);
      if (!suppressEvent) {
        try {
          dispatch();
        } catch {
          /* ignore */
        }
      }
      return ret;
    } as any;
  };
  try {
    wrap('pushState');
    wrap('replaceState');
  } catch {
    // ignore if patching fails (e.g., read-only in some environments)
  }
}

// Turn a search string like "?a=1&b=2" into a plain object { a: '1', b: '2' }
function searchToObject(search: string): Record<string, string> {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// Build a search string from { a: '1', b: '2' } -> "?a=1&b=2" (omitting undefined)
function objectToSearch(query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value != null) params.set(key, value);
  const str = params.toString();
  return str ? `?${str}` : '';
}

/** Result of {@link createQuerySync}. */
export type QuerySync = {
  /** SSR-safe adapter backed by the History API. */
  adapter: QueryAdapter;
};

/**
 * Create a default query adapter using the History API.
 * SSR-safe: returns an in-memory cache on the server.
 */
export function createQuerySync(): QuerySync {
  const env = createRuntimeEnv();
  // On the server we keep an in-memory copy so reads still work during SSR
  const state = reactive<{ cache: Record<string, string | undefined> }>({ cache: {} });

  const adapter: QueryAdapter = {
    getQuery() {
      if (!env.isClient || !env.win) return { ...state.cache };
      return searchToObject(env.win.location.search);
    },
    setQuery(next, options) {
      // Server: patch the cache only
      if (!env.isClient || !env.win) {
        state.cache = { ...state.cache, ...next };
        return;
      }

      const url = new URL(env.win.location.href);
      const current = searchToObject(url.search);
      const merged: Record<string, string | undefined> = { ...current, ...next };
      // Drop undefined keys so they disappear from the URL
      for (const key of Object.keys(merged)) if (merged[key] == null) delete merged[key];

      const newSearch = objectToSearch(merged);
      if (url.search === newSearch) return; // nothing changed

      url.search = newSearch;
      const fullPath = `${url.pathname}${url.search}${url.hash}`;
      const mode = options?.history ?? 'replace';
      if (mode === 'push')
        (env.win.history as any).__vueQsSuppressNext?.(() =>
          env.win!.history.pushState({}, '', fullPath)
        );
      else
        (env.win.history as any).__vueQsSuppressNext?.(() =>
          env.win!.history.replaceState({}, '', fullPath)
        );

      // Some test environments may not reflect history changes on location
      if (env.win.location.search !== newSearch) {
        try {
          env.win.location.href = fullPath;
        } catch {
          /* ignore */
        }
      }
    },
    subscribe(cb) {
      if (!env.isClient || !env.win) return () => {};
      // Patch history so manual pushState / replaceState dispatch events
      patchHistoryOnce(env.win);
      const handler = () => cb();
      env.win.addEventListener('popstate', handler);
      env.win.addEventListener('vue-qs:historychange', handler);
      return () => {
        env.win?.removeEventListener('popstate', handler);
        env.win?.removeEventListener('vue-qs:historychange', handler);
      };
    },
  };

  return { adapter };
}
