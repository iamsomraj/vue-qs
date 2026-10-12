import type { QueryAdapter, UpdateUrlOptions } from '@/adapters/types';
import { recordToSearchParams, type QueryRecord } from '@/lib/search-params';
import { renderQueryString } from '@/lib/url-encoding';

export type { QueryAdapter, UpdateUrlOptions } from '@/adapters/types';

/** Event passed to `onUrlUpdate`. */
export type UrlUpdateEvent = {
  /** The new search params */
  searchParams: URLSearchParams;
  /** The rendered query string, with a leading `?` (or empty) */
  queryString: string;
  /** Options resolved for this update */
  options: UpdateUrlOptions;
};

/** Options for {@link createTestingAdapter}. */
export type TestingAdapterOptions = {
  /** Initial search params */
  searchParams?: string | URLSearchParams | QueryRecord;
  /** Called on each URL update, e.g. with a `vi.fn()` spy */
  onUrlUpdate?: (event: UrlUpdateEvent) => void;
  /** Keep URL updates in memory, so composables read them back (default: `false`) */
  hasMemory?: boolean;
  /** Multiplier for throttle delays (default: `0`, updates flush on the next microtask) */
  rateLimitFactor?: number;
};

/** A testing adapter, with helpers to inspect and drive the in-memory URL. */
export type TestingAdapter = QueryAdapter & {
  /** Simulates a URL change made outside vue-qs (e.g. a navigation) */
  setSearchParams(search: string | URLSearchParams | QueryRecord): void;
};

function toSearchParams(
  input: string | URLSearchParams | QueryRecord | undefined
): URLSearchParams {
  if (input === undefined) {
    return new URLSearchParams();
  }
  if (typeof input === 'string' || input instanceof URLSearchParams) {
    return new URLSearchParams(input);
  }
  return recordToSearchParams(input);
}

/**
 * Creates an in-memory adapter for unit tests.
 *
 * @example
 * ```ts
 * const onUrlUpdate = vi.fn()
 * mount(Component, {
 *   global: {
 *     plugins: [createVueQs({ adapter: createTestingAdapter({ searchParams: '?page=2', onUrlUpdate }) })],
 *   },
 * })
 * await page.set(3)
 * expect(onUrlUpdate.mock.calls[0][0].queryString).toBe('?page=3')
 * ```
 */
export function createTestingAdapter(options: TestingAdapterOptions = {}): TestingAdapter {
  const { onUrlUpdate, hasMemory = false, rateLimitFactor = 0 } = options;
  let current = toSearchParams(options.searchParams);
  const listeners = new Set<() => void>();

  return {
    rateLimitFactor,
    getSearchParams() {
      return current;
    },
    updateUrl(search, updateOptions) {
      const searchParams = new URLSearchParams(search);
      if (hasMemory) {
        current = searchParams;
        listeners.forEach((listener) => listener());
      }
      onUrlUpdate?.({
        searchParams,
        queryString: renderQueryString(searchParams),
        options: updateOptions,
      });
    },
    subscribe(onChange) {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
    setSearchParams(search) {
      current = toSearchParams(search);
      listeners.forEach((listener) => listener());
    },
  };
}
