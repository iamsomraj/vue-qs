import { inject, provide, type App } from 'vue';
import { QUERY_ADAPTER_INJECTION_KEY } from '@/core/injection-keys';
import type { QueryAdapter } from '@/types';

/**
 * Provides a query adapter to the component tree using dependency injection
 * This makes the adapter available to all child components
 *
 * @param queryAdapter The query adapter instance to provide
 *
 * @example
 * ```typescript
 * import { provideQueryAdapter, createHistoryAdapter } from 'vue-qs';
 *
 * // In a parent component
 * const historyAdapter = createHistoryAdapter();
 * provideQueryAdapter(historyAdapter);
 * ```
 */
export function provideQueryAdapter(queryAdapter: QueryAdapter): void {
  try {
    provide(QUERY_ADAPTER_INJECTION_KEY, queryAdapter);
  } catch (error) {
    console.warn('Failed to provide query adapter:', error);
  }
}

/**
 * Retrieves the nearest provided query adapter from the component tree
 * Returns undefined if no adapter has been provided
 *
 * @returns The injected query adapter or undefined
 *
 * @example
 * ```typescript
 * import { useQueryAdapter } from 'vue-qs';
 *
 * // In a child component
 * const queryAdapter = useQueryAdapter();
 * if (queryAdapter) {
 *   // Use the adapter
 * }
 * ```
 */
export function useQueryAdapter(): QueryAdapter | undefined {
  try {
    return inject<QueryAdapter>(QUERY_ADAPTER_INJECTION_KEY);
  } catch (error) {
    console.warn('Failed to inject query adapter:', error);
    return undefined;
  }
}

/**
 * Configuration options for the Vue.js plugin
 */
export interface VueQueryPluginOptions {
  /** The query adapter to use throughout the application */
  queryAdapter: QueryAdapter;
}

/**
 * Creates a Vue.js plugin for vue-qs that automatically provides the query adapter
 *
 * @param options Plugin configuration options
 * @returns Vue plugin object
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue';
 * import { createVueQsPlugin, createHistoryAdapter } from 'vue-qs';
 *
 * const app = createApp();
 * const historyAdapter = createHistoryAdapter();
 * const vueQueryPlugin = createVueQsPlugin({ queryAdapter: historyAdapter });
 *
 * app.use(vueQueryPlugin);
 * ```
 */
export function createVueQsPlugin(options: VueQueryPluginOptions): {
  install: (app: App) => void;
} {
  const { queryAdapter } = options;

  return {
    install(app: App): void {
      try {
        app.provide(QUERY_ADAPTER_INJECTION_KEY, queryAdapter);
      } catch (error) {
        console.error('Failed to install vue-qs plugin:', error);
      }
    },
  };
}
