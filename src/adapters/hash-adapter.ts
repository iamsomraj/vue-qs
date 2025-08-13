import { reactive } from 'vue';
import type { QueryAdapter, RuntimeEnvironment } from '@/types';
import {
  createRuntimeEnvironment,
  parseSearchString,
  buildSearchString,
  mergeObjects,
} from '@/utils/core-helpers';

/**
 * Hash mode types supported by the hash adapter
 */
export type HashMode = 'hash' | 'hash-params';

/**
 * Configuration options for the hash adapter
 */
export interface HashAdapterOptions {
  /** The hash mode to use (default: 'hash') */
  mode?: HashMode;
  /** Whether to suppress custom history events (default: false) */
  suppressHistoryEvents?: boolean;
}

/**
 * Result of creating a hash-based query adapter
 */
export interface HashAdapterResult {
  /** The query adapter instance */
  queryAdapter: QueryAdapter;
  /** Runtime environment information */
  runtimeEnvironment: RuntimeEnvironment;
  /** The hash mode being used */
  mode: HashMode;
}

// Global flag to track if history API has been patched
let isHashHistoryPatched = false;

/**
 * Patches the browser's History API to emit custom events for hash changes
 * This allows two-way sync to detect manual hash changes
 * @param windowObject The window object to patch
 */
function patchHashHistoryAPI(windowObject: Window): void {
  if (isHashHistoryPatched) {
    return;
  }

  try {
    isHashHistoryPatched = true;
    const { history } = windowObject;

    // Flag to suppress events during our own updates
    let shouldSuppressEvent = false;

    // Helper function to suppress the next event
    (
      history as History & { __vueQsHashSuppress?: (operation: () => void) => void }
    ).__vueQsHashSuppress = (operation: () => void): void => {
      shouldSuppressEvent = true;
      try {
        operation();
      } finally {
        shouldSuppressEvent = false;
      }
    };

    // Function to dispatch our custom event
    const dispatchHashChangeEvent = (): void => {
      try {
        windowObject.dispatchEvent(new Event('vue-qs:hash-change'));
      } catch (error) {
        console.warn('Failed to dispatch hash change event:', error);
      }
    };

    // Patch pushState and replaceState for hash mode
    const wrapHistoryMethod = <T extends keyof History>(methodName: T): void => {
      const originalMethod = history[methodName] as Function;

      history[methodName] = function (this: History, ...args: unknown[]) {
        try {
          const result = originalMethod.apply(this, args);

          if (!shouldSuppressEvent) {
            dispatchHashChangeEvent();
          }

          return result;
        } catch (error) {
          console.warn(`Error in patched hash ${methodName}:`, error);
          return originalMethod.apply(this, args);
        }
      } as History[T];
    };

    wrapHistoryMethod('pushState');
    wrapHistoryMethod('replaceState');
  } catch (error) {
    console.warn('Failed to patch hash history API:', error);
    isHashHistoryPatched = false;
  }
}

/**
 * Extracts query parameters from hash based on the specified mode
 * @param hash The current hash string
 * @param mode The hash mode to use
 * @returns Parsed query parameters
 */
function parseHashQuery(hash: string, mode: HashMode): Record<string, string> {
  try {
    if (!hash || hash === '#') {
      return {};
    }

    // Remove leading '#'
    const hashWithoutSharp = hash.substring(1);

    if (mode === 'hash-params') {
      // For hash-params mode, the entire hash is treated as query parameters
      return parseSearchString(hashWithoutSharp);
    } else {
      // For hash mode, extract query parameters after '?' in hash
      const questionIndex = hashWithoutSharp.indexOf('?');
      if (questionIndex === -1) {
        return {};
      }
      const queryPart = hashWithoutSharp.substring(questionIndex + 1);
      return parseSearchString(queryPart);
    }
  } catch (error) {
    console.warn('Error parsing hash query:', error);
    return {};
  }
}

/**
 * Builds a hash string from query parameters based on the specified mode
 * @param currentHash The current hash string
 * @param queryParams The query parameters to include
 * @param mode The hash mode to use
 * @returns The new hash string
 */
function buildHashString(
  currentHash: string,
  queryParams: Record<string, string | undefined>,
  mode: HashMode
): string {
  try {
    const queryString = buildSearchString(queryParams);

    if (mode === 'hash-params') {
      // For hash-params mode, the query becomes the entire hash
      return queryString ? `#${queryString.substring(1)}` : '#';
    } else {
      // For hash mode, preserve the route part and append/replace query
      const hashWithoutSharp = currentHash.substring(1) || '';
      const questionIndex = hashWithoutSharp.indexOf('?');

      const routePart =
        questionIndex === -1 ? hashWithoutSharp : hashWithoutSharp.substring(0, questionIndex);

      if (!queryString) {
        return routePart ? `#${routePart}` : '#';
      }

      return routePart ? `#${routePart}${queryString}` : `#${queryString}`;
    }
  } catch (error) {
    console.warn('Error building hash string:', error);
    return currentHash;
  }
}

/**
 * Creates a query adapter that uses browser hash for parameter storage
 * Supports both 'hash' and 'hash-params' modes like VueUse
 *
 * @param options Configuration options for the adapter
 * @returns Hash adapter result with the adapter and runtime info
 *
 * @example
 * ```typescript
 * import { createHashAdapter } from 'vue-qs';
 *
 * // Hash mode: #/route?foo=bar&baz=qux
 * const { queryAdapter } = createHashAdapter({ mode: 'hash' });
 *
 * // Hash-params mode: #foo=bar&baz=qux
 * const { queryAdapter: hashParamsAdapter } = createHashAdapter({ mode: 'hash-params' });
 *
 * // Use with the plugin
 * app.use(createVueQsPlugin({ queryAdapter }));
 * ```
 */
export function createHashAdapter(options: HashAdapterOptions = {}): HashAdapterResult {
  const runtimeEnvironment = createRuntimeEnvironment();
  const { mode = 'hash', suppressHistoryEvents = false } = options;

  // Server-side reactive cache for SSR compatibility
  const serverCache = reactive<{ queryParams: Record<string, string | undefined> }>({
    queryParams: {},
  });

  const queryAdapter: QueryAdapter = {
    getCurrentQuery() {
      try {
        if (!runtimeEnvironment.isBrowser || !runtimeEnvironment.windowObject) {
          return { ...serverCache.queryParams };
        }

        const hash = runtimeEnvironment.windowObject.location.hash;
        return parseHashQuery(hash, mode);
      } catch (error) {
        console.warn('Error getting current hash query:', error);
        return {};
      }
    },

    updateQuery(queryUpdates, updateOptions) {
      try {
        // Server-side: update cache only
        if (!runtimeEnvironment.isBrowser || !runtimeEnvironment.windowObject) {
          serverCache.queryParams = mergeObjects(serverCache.queryParams, queryUpdates);
          return;
        }

        const windowObject = runtimeEnvironment.windowObject;
        const currentHash = windowObject.location.hash;
        const currentQuery = parseHashQuery(currentHash, mode);
        const mergedQuery = mergeObjects(currentQuery, queryUpdates);

        const newHash = buildHashString(currentHash, mergedQuery, mode);

        // Don't update if nothing changed
        if (currentHash === newHash) {
          return;
        }

        const currentUrl = new URL(windowObject.location.href);
        const newSearchString = buildSearchString(mergedQuery);

        // Update the URL search params and hash appropriately
        currentUrl.search = newSearchString;
        currentUrl.hash = newHash;

        const newPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
        const historyStrategy = updateOptions?.historyStrategy ?? 'replace';

        // Use the patched history methods to suppress our own events
        const historyMethod = historyStrategy === 'push' ? 'pushState' : 'replaceState';

        if (!suppressHistoryEvents) {
          // Use the custom suppression method if available
          const historyWithSuppression = windowObject.history as History & {
            __vueQsHashSuppress?: (fn: () => void) => void;
          };

          if (historyWithSuppression.__vueQsHashSuppress) {
            historyWithSuppression.__vueQsHashSuppress(() => {
              windowObject.history[historyMethod]({}, '', newPath);
            });
          } else {
            windowObject.history[historyMethod]({}, '', newPath);
          }
        } else {
          windowObject.history[historyMethod]({}, '', newPath);
        }

        // Fallback for test environments that don't reflect changes
        if (windowObject.location.hash !== newHash) {
          try {
            windowObject.location.hash = newHash;
          } catch (error) {
            console.warn('Failed to update hash directly:', error);
          }
        }
      } catch (error) {
        console.warn('Error updating hash query:', error);
      }
    },

    onQueryChange(callback) {
      try {
        if (!runtimeEnvironment.isBrowser || !runtimeEnvironment.windowObject) {
          // Return no-op unsubscribe function for server-side
          return (): void => {
            // No-op: Server-side cleanup not needed
          };
        }

        const windowObject = runtimeEnvironment.windowObject;

        // Patch history API if not suppressing events
        if (!suppressHistoryEvents) {
          patchHashHistoryAPI(windowObject);
        }

        const handleHashChange = (): void => {
          try {
            callback();
          } catch (error) {
            console.warn('Error in hash change callback:', error);
          }
        };

        // Listen for hash changes, popstate, and our custom events
        windowObject.addEventListener('hashchange', handleHashChange);
        windowObject.addEventListener('popstate', handleHashChange);

        if (!suppressHistoryEvents) {
          windowObject.addEventListener('vue-qs:hash-change', handleHashChange);
        }

        // Return unsubscribe function
        return () => {
          try {
            windowObject.removeEventListener('hashchange', handleHashChange);
            windowObject.removeEventListener('popstate', handleHashChange);

            if (!suppressHistoryEvents) {
              windowObject.removeEventListener('vue-qs:hash-change', handleHashChange);
            }
          } catch (error) {
            console.warn('Error unsubscribing from hash changes:', error);
          }
        };
      } catch (error) {
        console.warn('Error setting up hash change listener:', error);
        return (): void => {
          // No-op: Error occurred during setup, nothing to cleanup
        };
      }
    },
  };

  return {
    queryAdapter,
    runtimeEnvironment,
    mode,
  };
}
