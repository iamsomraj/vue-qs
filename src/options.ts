/**
 * How the URL update is recorded in the browser history.
 * - `replace` (default): replaces the current history entry
 * - `push`: creates a new history entry, so the Back button restores the previous state
 */
export type HistoryOptions = 'replace' | 'push';

/**
 * Rate-limiting strategy applied to URL updates.
 * Create one with {@link throttle} or {@link debounce}.
 */
export type LimitUrlUpdates = {
  method: 'throttle' | 'debounce';
  timeMs: number;
};

/**
 * Options controlling how state updates are written to the URL.
 *
 * They can be set on a parser (`parser.withOptions()`), on a composable,
 * or per call (`state.set(value, options)`).
 */
export type Options = {
  /** History mode for URL updates (default: `'replace'`) */
  history?: HistoryOptions;
  /** Scroll to the top of the page after the URL update (default: `false`) */
  scroll?: boolean;
  /**
   * Update the URL without triggering a full router navigation (default: `true`).
   * Adapters that cannot update the URL without navigating ignore this option.
   */
  shallow?: boolean;
  /**
   * Maximum rate of URL updates, in milliseconds.
   * @deprecated Use `limitUrlUpdates: throttle(ms)` instead.
   */
  throttleMs?: number;
  /** Throttle or debounce URL updates (default: `throttle(50)`) */
  limitUrlUpdates?: LimitUrlUpdates;
  /** Remove the key from the URL when the value equals the default (default: `true`) */
  clearOnDefault?: boolean;
};

/** Default interval between two URL updates, in milliseconds. */
export const DEFAULT_THROTTLE_MS = 50;

/**
 * Emits URL updates at most once every `timeMs` milliseconds.
 * State updates stay instant; only URL writes are rate-limited.
 *
 * @example
 * ```ts
 * const q = useQueryState('q', parseAsString.withOptions({ limitUrlUpdates: throttle(300) }))
 * ```
 */
export function throttle(timeMs: number): LimitUrlUpdates {
  return { method: 'throttle', timeMs };
}

/**
 * Delays the URL update until no new update happened for `timeMs` milliseconds.
 * Useful for search inputs that drive server requests.
 *
 * @example
 * ```ts
 * await q.set(value, { limitUrlUpdates: debounce(500) })
 * ```
 */
export function debounce(timeMs: number): LimitUrlUpdates {
  return { method: 'debounce', timeMs };
}

/** Default rate limit applied to URL updates. */
export const defaultRateLimit: LimitUrlUpdates = throttle(DEFAULT_THROTTLE_MS);

const OPTION_KEYS = [
  'history',
  'scroll',
  'shallow',
  'throttleMs',
  'limitUrlUpdates',
  'clearOnDefault',
] as const;

/**
 * Merges option sources, the first defined value winning for each key.
 * @internal
 */
export function resolveOptions(...sources: Array<Options | undefined>): Options {
  const resolved: Record<string, unknown> = {};
  for (const key of OPTION_KEYS) {
    for (const source of sources) {
      const value = source?.[key];
      if (value !== undefined) {
        resolved[key] = value;
        break;
      }
    }
  }
  return resolved;
}

/**
 * Resolves the rate limit to apply from options.
 * @internal
 */
export function resolveRateLimit(options: Options): LimitUrlUpdates {
  if (options.limitUrlUpdates) {
    return options.limitUrlUpdates;
  }
  if (options.throttleMs !== undefined) {
    return throttle(options.throttleMs);
  }
  return defaultRateLimit;
}
