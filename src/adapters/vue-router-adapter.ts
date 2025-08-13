import type { Router, LocationQuery } from 'vue-router';
import type { QueryAdapter } from '@/types';

/**
 * Configuration options for the Vue Router adapter
 */
export interface VueRouterAdapterOptions {
  /** Whether to log warnings for array query parameters (default: true) */
  warnOnArrayParams?: boolean;
}

/**
 * Creates a query adapter that integrates with Vue Router
 * This adapter reads and writes query parameters through Vue Router's API
 *
 * @param vueRouter The Vue Router instance to integrate with
 * @param options Configuration options for the adapter
 * @returns QueryAdapter that works with Vue Router
 *
 * @example
 * ```typescript
 * import { createRouter } from 'vue-router';
 * import { createVueRouterAdapter } from 'vue-qs';
 *
 * const router = createRouter({ ... });
 * const routerAdapter = createVueRouterAdapter(router);
 *
 * // Use with the plugin
 * app.use(createVueQsPlugin({ queryAdapter: routerAdapter }));
 * ```
 */
export function createVueRouterAdapter(
  vueRouter: Router,
  options: VueRouterAdapterOptions = {}
): QueryAdapter {
  const { warnOnArrayParams = true } = options;

  /**
   * Normalizes Vue Router query parameters to simple string values
   * Vue Router can store arrays, but we flatten them to strings
   */
  function normalizeRouterQuery(routerQuery: LocationQuery): Record<string, string | undefined> {
    const normalizedQuery: Record<string, string | undefined> = {};

    try {
      Object.entries(routerQuery).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Take the first value from arrays and warn if configured to do so
          const firstValue = value[0];
          normalizedQuery[key] =
            typeof firstValue === 'string' && firstValue.length > 0
              ? String(firstValue)
              : undefined;

          if (warnOnArrayParams && value.length > 1) {
            console.warn(
              `Query parameter "${key}" has multiple values. Only the first value will be used.`,
              { key, values: value }
            );
          }
        } else if (typeof value === 'string' && value.length > 0) {
          normalizedQuery[key] = String(value);
        } else {
          normalizedQuery[key] = undefined;
        }
      });

      return normalizedQuery;
    } catch (error) {
      console.warn('Error normalizing router query:', error);
      return {};
    }
  }

  /**
   * Checks if two query objects are equivalent
   * Used to avoid unnecessary navigation when query hasn't changed
   */
  function areQueriesEqual(queryA: LocationQuery, queryB: LocationQuery): boolean {
    try {
      const normalizedA = normalizeRouterQuery(queryA);
      const normalizedB = normalizeRouterQuery(queryB);

      const keysA = Object.keys(normalizedA);
      const keysB = Object.keys(normalizedB);

      if (keysA.length !== keysB.length) {
        return false;
      }

      return keysA.every((key) => normalizedA[key] === normalizedB[key]);
    } catch (error) {
      console.warn('Error comparing queries:', error);
      return false;
    }
  }

  const queryAdapter: QueryAdapter = {
    getCurrentQuery() {
      try {
        const currentRoute = vueRouter.currentRoute.value;
        return normalizeRouterQuery(currentRoute.query);
      } catch (error) {
        console.warn('Error getting current query from Vue Router:', error);
        return {};
      }
    },

    updateQuery(queryUpdates, updateOptions) {
      try {
        const currentRoute = vueRouter.currentRoute.value;
        const currentQuery = { ...currentRoute.query };

        // Apply updates to the current query
        Object.entries(queryUpdates).forEach(([key, value]) => {
          if (value === undefined) {
            delete currentQuery[key];
          } else {
            currentQuery[key] = value;
          }
        });

        // Check if query actually changed to avoid unnecessary navigation
        if (areQueriesEqual(currentRoute.query, currentQuery)) {
          return;
        }

        const historyStrategy = updateOptions?.historyStrategy ?? 'replace';
        const navigationMethod = historyStrategy === 'push' ? vueRouter.push : vueRouter.replace;

        // Navigate with the updated query
        navigationMethod
          .call(vueRouter, {
            query: currentQuery,
          })
          .catch((error) => {
            // Handle navigation errors (e.g., navigation cancelled)
            if (error?.name !== 'NavigationDuplicated') {
              console.warn('Vue Router navigation error:', error);
            }
          });
      } catch (error) {
        console.warn('Error updating query in Vue Router:', error);
      }
    },

    onQueryChange(callback) {
      try {
        // Use Vue Router's afterEach hook to detect navigation changes
        const unsubscribeHook = vueRouter.afterEach(() => {
          try {
            callback();
          } catch (error) {
            console.warn('Error in Vue Router query change callback:', error);
          }
        });

        return unsubscribeHook;
      } catch (error) {
        console.warn('Error setting up Vue Router query change listener:', error);
        return (): void => {
          // No-op: Error occurred during setup, nothing to cleanup
        };
      }
    },
  };

  return queryAdapter;
}
