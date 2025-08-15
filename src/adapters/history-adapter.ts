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
  // Currently no options needed - keeping for future extensibility
}

/**
 * Result of creating a history-based query adapter
 */
export type HistoryAdapterResult = QueryAdapter;

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
        const historyMethod = historyStrategy === 'push' ? 'pushState' : 'replaceState';

        // Update browser history
        windowObject.history[historyMethod]({}, '', newPath);

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
  };

  return queryAdapter;
}
