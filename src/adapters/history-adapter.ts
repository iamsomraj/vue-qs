import { reactive } from 'vue';
import type { QueryAdapter } from '@/types';
import {
  buildSearchString,
  createRuntimeEnvironment,
  mergeObjects,
  parseSearchString,
  warn,
} from '@/utils/core-helpers';

/**
 * Configuration options for the history adapter
 */
export interface HistoryAdapterOptions {
  /** Whether to suppress custom history events (default: false) */
  suppressHistoryEvents?: boolean;
}

/**
 * Result of creating a history-based query adapter
 */
export type HistoryAdapterResult = QueryAdapter;
// Global flag to track if history API has been patched
let isHistoryPatched = false;

/**
 * Patches the browser's History API to emit custom events
 * This allows two-way sync to detect manual history changes
 * @param windowObject The window object to patch
 */
function patchHistoryAPI(windowObject: Window): void {
  if (isHistoryPatched) {
    return;
  }

  try {
    isHistoryPatched = true;
    const { history } = windowObject;

    // Flag to suppress events during our own updates
    let shouldSuppressEvent = false;

    // Helper function to suppress the next event
    (history as History & { __vueQsSuppress?: (operation: () => void) => void }).__vueQsSuppress = (
      operation: () => void
    ): void => {
      shouldSuppressEvent = true;
      try {
        operation();
      } finally {
        shouldSuppressEvent = false;
      }
    };

    // Function to dispatch our custom event
    const dispatchHistoryChangeEvent = (): void => {
      try {
        windowObject.dispatchEvent(new Event('vue-qs:history-change'));
      } catch (error) {
        warn('Failed to dispatch history change event:', error);
      }
    };

    // Patch pushState and replaceState
    const wrapHistoryMethod = <T extends keyof History>(methodName: T): void => {
      const originalMethod = history[methodName] as Function;

      history[methodName] = function (this: History, ...args: unknown[]) {
        try {
          const result = originalMethod.apply(this, args);

          if (!shouldSuppressEvent) {
            dispatchHistoryChangeEvent();
          }

          return result;
        } catch (error) {
          warn(`Error in patched ${methodName}:`, error);
          return originalMethod.apply(this, args);
        }
      } as History[T];
    };

    wrapHistoryMethod('pushState');
    wrapHistoryMethod('replaceState');
  } catch (error) {
    warn('Failed to patch history API:', error);
    isHistoryPatched = false;
  }
}

/**
 * Creates a query adapter that uses the browser's History API for URL parameters
 *
 * @param options Configuration options for the adapter
 * @returns Query adapter instance
 *
 * @example
 * ```typescript
 * import { createHistoryAdapter } from 'vue-qs';
 *
 * const queryAdapter = createHistoryAdapter();
 *
 * // Use with the plugin
 * app.use(createVueQsPlugin({ queryAdapter }));
 * ```
 */
export function createHistoryAdapter(options: HistoryAdapterOptions = {}): QueryAdapter {
  const runtimeEnvironment = createRuntimeEnvironment();
  const { suppressHistoryEvents = false } = options;

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

        const searchString = runtimeEnvironment.windowObject.location.search;
        return parseSearchString(searchString);
      } catch (error) {
        warn('Error getting current query:', error);
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
        const currentUrl = new URL(windowObject.location.href);
        const currentQuery = parseSearchString(currentUrl.search);
        const mergedQuery = mergeObjects(currentQuery, queryUpdates);

        const newSearchString = buildSearchString(mergedQuery);

        // Don't update if nothing changed
        if (currentUrl.search === newSearchString) {
          return;
        }

        currentUrl.search = newSearchString;
        const newPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
        const historyStrategy = updateOptions?.historyStrategy ?? 'replace';

        // Use the patched history methods to suppress our own events
        const historyMethod = historyStrategy === 'push' ? 'pushState' : 'replaceState';

        if (!suppressHistoryEvents) {
          // Use the custom suppression method if available
          const historyWithSuppression = windowObject.history as History & {
            __vueQsSuppress?: (fn: () => void) => void;
          };

          if (historyWithSuppression.__vueQsSuppress) {
            historyWithSuppression.__vueQsSuppress(() => {
              windowObject.history[historyMethod]({}, '', newPath);
            });
          } else {
            windowObject.history[historyMethod]({}, '', newPath);
          }
        } else {
          windowObject.history[historyMethod]({}, '', newPath);
        }

        // Fallback for test environments that don't reflect changes
        if (windowObject.location.search !== newSearchString) {
          try {
            windowObject.location.href = newPath;
          } catch (error) {
            warn('Failed to update location directly:', error);
          }
        }
      } catch (error) {
        warn('Error updating query:', error);
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
          patchHistoryAPI(windowObject);
        }

        const handleQueryChange = (): void => {
          try {
            callback();
          } catch (error) {
            warn('Error in query change callback:', error);
          }
        };

        // Listen for both browser navigation and our custom events
        windowObject.addEventListener('popstate', handleQueryChange);

        if (!suppressHistoryEvents) {
          windowObject.addEventListener('vue-qs:history-change', handleQueryChange);
        }

        // Return unsubscribe function
        return () => {
          try {
            windowObject.removeEventListener('popstate', handleQueryChange);

            if (!suppressHistoryEvents) {
              windowObject.removeEventListener('vue-qs:history-change', handleQueryChange);
            }
          } catch (error) {
            warn('Error unsubscribing from query changes:', error);
          }
        };
      } catch (error) {
        warn('Error setting up query change listener:', error);
        return (): void => {
          // No-op: Error occurred during setup, nothing to cleanup
        };
      }
    },
  };

  return queryAdapter;
}
