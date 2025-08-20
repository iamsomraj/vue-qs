import type { RuntimeEnvironment } from '@/types';

/**
 * Safely checks if we're running in a browser environment
 * @returns true if running in a browser, false otherwise
 * @example
 * ```ts
 * if (isBrowserEnvironment()) {
 *   // Safe to use window, document, etc.
 *   console.log(window.location.href);
 * }
 * ```
 */
export function isBrowserEnvironment(): boolean {
  try {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Creates a runtime environment object with safe property access
 * @returns Runtime environment information
 * @example
 * ```ts
 * const env = createRuntimeEnvironment();
 * if (env.isBrowser && env.windowObject) {
 *   // Safe to use window
 *   console.log(env.windowObject.location.href);
 * }
 * ```
 */
export function createRuntimeEnvironment(): RuntimeEnvironment {
  const isBrowser = isBrowserEnvironment();

  return {
    isBrowser,
    windowObject: isBrowser ? window : null,
  };
}

/**
 * Safely converts a URL search string to a plain object
 * @param searchString The URL search string (with or without leading '?')
 * @returns Object with key-value pairs from the search string
 * @example
 * ```ts
 * parseSearchString('?page=1&search=test')
 * // Returns: { page: '1', search: 'test' }
 *
 * parseSearchString('page=1&search=test')
 * // Returns: { page: '1', search: 'test' }
 * ```
 */
export function parseSearchString(searchString: string): Record<string, string> {
  try {
    if (!searchString || typeof searchString !== 'string') {
      return {};
    }

    const urlParams = new URLSearchParams(
      searchString.startsWith('?') ? searchString : `?${searchString}`
    );

    const result: Record<string, string> = {};

    urlParams.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  } catch (error) {
    warn('Failed to parse search string:', error);
    return {};
  }
}

/**
 * Safely converts a query object to a URL search string
 * @param queryObject Object with key-value pairs
 * @returns URL search string with leading '?' or empty string
 * @example
 * ```ts
 * buildSearchString({ page: '1', search: 'test' })
 * // Returns: '?page=1&search=test'
 *
 * buildSearchString({ page: undefined, search: 'test' })
 * // Returns: '?search=test'
 * ```
 */
export function buildSearchString(queryObject: Record<string, string | undefined>): string {
  try {
    const urlParams = new URLSearchParams();

    Object.entries(queryObject).forEach(([key, value]) => {
      if (value !== undefined) {
        urlParams.set(key, String(value));
      }
    });

    const searchString = urlParams.toString();
    return searchString ? `?${searchString}` : '';
  } catch (error) {
    warn('Failed to build search string:', error);
    return '';
  }
}

/**
 * Safely compares two values for equality
 * @param valueA First value to compare
 * @param valueB Second value to compare
 * @param customEquals Optional custom equality function
 * @returns true if values are equal
 * @example
 * ```ts
 * // Default comparison
 * areValuesEqual(1, 1) // true
 * areValuesEqual({}, {}) // false (different objects)
 *
 * // Custom comparison
 * areValuesEqual({ id: 1 }, { id: 1 }, (a, b) => a.id === b.id) // true
 * ```
 */
export function areValuesEqual<T>(
  valueA: T,
  valueB: T,
  customEquals?: (a: T, b: T) => boolean
): boolean {
  try {
    if (customEquals) {
      return customEquals(valueA, valueB);
    }
    return Object.is(valueA, valueB);
  } catch (error) {
    warn('Error comparing values:', error);
    return false;
  }
}

/**
 * Safely merges two objects
 * @param baseObject Base object to merge into
 * @param updateObject Object with updates to apply
 * @returns New merged object
 * @example
 * ```ts
 * const base = { page: 1, search: 'old' };
 * const updates = { search: 'new', filter: 'active' };
 * mergeObjects(base, updates)
 * // Returns: { page: 1, search: 'new', filter: 'active' }
 * ```
 */
export function mergeObjects<T extends Record<string, unknown>>(
  baseObject: T,
  updateObject: Partial<T>
): T {
  try {
    return { ...baseObject, ...updateObject };
  } catch (error) {
    warn('Error merging objects:', error);
    return baseObject;
  }
}

/**
 * Safely removes undefined values from an object
 * @param sourceObject Object to clean
 * @returns New object without undefined values
 * @example
 * ```ts
 * removeUndefinedValues({ a: 1, b: undefined, c: 'test' })
 * // Returns: { a: 1, c: 'test' }
 * ```
 */
export function removeUndefinedValues<T extends Record<string, unknown>>(
  sourceObject: T
): Partial<T> {
  try {
    const cleanedObject: Partial<T> = {};

    Object.entries(sourceObject).forEach(([key, value]) => {
      if (value !== undefined) {
        (cleanedObject as Record<string, unknown>)[key] = value;
      }
    });

    return cleanedObject;
  } catch (error) {
    warn('Error removing undefined values:', error);
    return sourceObject;
  }
}

/**
 * Safely adds an event listener to a target
 * @param target The target to add the listener to
 * @param event The event name
 * @param handler The event handler
 * @param options Event listener options
 * @returns Function to remove the listener
 * @example
 * ```ts
 * const removeListener = useEventListener(
 *   window,
 *   'popstate',
 *   () => console.log('Navigation changed'),
 *   { passive: true }
 * );
 *
 * // Later, remove the listener
 * removeListener();
 * ```
 */
export function useEventListener(
  target: EventTarget | null | undefined,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): () => void {
  if (!target) {
    return () => {
      // No-op function when target is not available
    };
  }

  try {
    target.addEventListener(event, handler, options);

    return () => {
      target.removeEventListener(event, handler, options);
    };
  } catch (error) {
    warn('Error adding event listener:', error);
    return () => {
      // No-op function when listener couldn't be added
    };
  }
}

/**
 * Logs a warning message with the vue-qs prefix
 * @param args Arguments to log
 * @example
 * ```ts
 * warn('Parameter not found:', 'page');
 * // Outputs: [vue-qs]: Parameter not found: page
 * ```
 */
export function warn(...args: any[]): void {
  console.warn('[vue-qs]:', ...args);
}

/**
 * Logs an error message with the vue-qs prefix
 * @param args Arguments to log
 * @example
 * ```ts
 * error('Failed to parse URL:', error);
 * // Outputs: [vue-qs]: Failed to parse URL: [error details]
 * ```
 */
export function error(...args: any[]): void {
  console.error('[vue-qs]:', ...args);
}
