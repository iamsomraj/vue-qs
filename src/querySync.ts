import { reactive } from 'vue';
import type { QueryAdapter, RuntimeEnv } from '@/types';

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getRuntimeEnv(): RuntimeEnv {
  return {
    isClient: isClient(),
    win: isClient() ? window : null,
  };
}

function parseSearch(search: string): Record<string, string> {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const out: Record<string, string> = {};
  params.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

function stringifySearch(query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v != null) params.set(k, v);
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

export type QuerySync = {
  /** SSR-safe adapter backed by history API */
  adapter: QueryAdapter;
};

export function createQuerySync(): QuerySync {
  const env = getRuntimeEnv();
  const state = reactive<{ cache: Record<string, string | undefined> }>({ cache: {} });

  const adapter: QueryAdapter = {
    getQuery() {
      if (!env.isClient || !env.win) return { ...state.cache };
      const { search } = env.win.location;
      return parseSearch(search);
    },
    setQuery(next, options) {
      if (!env.isClient || !env.win) {
        state.cache = { ...state.cache, ...next };
        return;
      }
      const url = new URL(env.win.location.href);
      const current = parseSearch(url.search);
      const merged: Record<string, string | undefined> = { ...current, ...next };
      // Remove undefined keys
      for (const k of Object.keys(merged)) {
        if (merged[k] == null) delete merged[k];
      }
      const search = stringifySearch(merged);
      url.search = search;
      const path = `${url.pathname}${url.search}${url.hash}`;
      const history = options?.history ?? 'replace';
      if (history === 'push') env.win.history.pushState({}, '', path);
      else env.win.history.replaceState({}, '', path);
      // Fallback for environments where History API doesn't reflect on location (e.g., test DOM)
      if (env.win.location.search !== search) {
        try {
          env.win.location.href = path;
        } catch {
          // ignore
        }
      }
    },
  };

  return { adapter };
}
