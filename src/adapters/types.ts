import type { HistoryOptions } from '@/options';

/** Options passed to {@link QueryAdapter.updateUrl}, resolved from all batched updates. */
export type UpdateUrlOptions = {
  history: HistoryOptions;
  scroll: boolean;
  shallow: boolean;
};

/**
 * Connects vue-qs to a source of truth for the URL (browser History API,
 * Vue Router, an in-memory store for tests…).
 *
 * @example
 * ```ts
 * const adapter = createAdapter({
 *   getSearchParams: () => new URLSearchParams(location.search),
 *   updateUrl: (search, { history }) => { ... },
 *   subscribe: (onChange) => { ...; return () => {} },
 * })
 * ```
 */
export type QueryAdapter = {
  /** Returns the current search params. Callers must not mutate the result. */
  getSearchParams(): URLSearchParams;
  /**
   * Writes new search params to the URL. May return a promise for async navigation.
   * Return (or resolve) `false` when the URL did not take the update, e.g. a cancelled
   * or redirected navigation: composables then re-read the URL.
   */
  updateUrl(
    search: URLSearchParams,
    options: UpdateUrlOptions
  ): void | false | Promise<void | false>;
  /** Calls `onChange` when the URL changes from outside vue-qs. Returns an unsubscribe function. */
  subscribe(onChange: () => void): () => void;
  /** Multiplier applied to throttle delays (`0` disables throttling, e.g. in tests). */
  rateLimitFactor?: number;
};

/**
 * Defines a custom adapter with type checking.
 */
export function createAdapter(adapter: QueryAdapter): QueryAdapter {
  return adapter;
}
