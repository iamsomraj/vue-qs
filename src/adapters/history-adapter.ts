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
export function createHistoryAdapter(): QueryAdapter {
  const runtimeEnvironment = createRuntimeEnvironment();

  // Server-side reactive cache for SSR compatibility
  const serverCache = reactive<{ queryParams: Record<string, string | undefined> }>({
    queryParams: {},
  });

  let isUpdating = false;

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
        if (isUpdating) {
          return;
        }

        // Server-side: update cache only
        if (!runtimeEnvironment.isBrowser || !runtimeEnvironment.windowObject) {
          serverCache.queryParams = mergeObjects(serverCache.queryParams, queryUpdates);
          return;
        }

        isUpdating = true;

        const windowObject = runtimeEnvironment.windowObject;
        let currentUrl: URL;

        try {
          // Try to create URL from current href
          currentUrl = new URL(windowObject.location.href);
        } catch {
          // Fallback: construct URL from parts
          const href = windowObject.location.href || 'https://example.com/';
          const baseUrl = href.startsWith('http') ? href : `https://example.com${href}`;
          currentUrl = new URL(baseUrl);
        }

        const currentQuery = parseSearchString(currentUrl.search);
        const mergedQuery = mergeObjects(currentQuery, queryUpdates);

        const newSearchString = buildSearchString(mergedQuery);

        if (currentUrl.search === newSearchString) {
          isUpdating = false;
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
      } finally {
        isUpdating = false;
      }
    },

    isUpdating() {
      return isUpdating;
    },
  };

  return queryAdapter;
}
