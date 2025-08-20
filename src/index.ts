/**
 * vue-qs - Type-safe, reactive URL query parameters for Vue 3
 *
 * This package provides composables for managing URL query parameters
 * with full TypeScript support and Vue 3 Composition API integration.
 *
 * @example
 * ```ts
 * import { queryRef, queryReactive, numberCodec } from 'vue-qs';
 *
 * // Single parameter
 * const page = queryRef('page', {
 *   defaultValue: 1,
 *   codec: numberCodec
 * });
 *
 * // Multiple parameters
 * const queryState = queryReactive({
 *   search: { defaultValue: '' },
 *   page: { defaultValue: 1, codec: numberCodec }
 * });
 * ```
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type * from '@/types';

// ============================================================================
// COMPOSABLES
// ============================================================================

/**
 * Creates a reactive ref that syncs with a URL query parameter
 * @example
 * ```ts
 * const search = queryRef('q', { defaultValue: '' });
 * // URL: ?q=hello
 * // search.value = 'hello'
 * ```
 */
export { queryRef } from '@/composables/use-query-ref';

/**
 * Creates a reactive object that syncs multiple URL query parameters
 * @example
 * ```ts
 * const state = queryReactive({
 *   page: { defaultValue: 1, codec: numberCodec },
 *   search: { defaultValue: '' }
 * });
 * // URL: ?page=2&search=test
 * // state.page = 2, state.search = 'test'
 * ```
 */
export { queryReactive } from '@/composables/use-query-reactive';

// ============================================================================
// ADAPTERS
// ============================================================================

/**
 * Creates an adapter for browser History API (default)
 * @example
 * ```ts
 * const adapter = createHistoryAdapter();
 * ```
 */
export { createHistoryAdapter } from '@/adapters/history-adapter';
export type { HistoryAdapterResult } from '@/adapters/history-adapter';

/**
 * Creates an adapter for Vue Router integration
 * @example
 * ```ts
 * import { useRouter } from 'vue-router';
 * const router = useRouter();
 * const adapter = createVueRouterAdapter(router);
 * ```
 */
export { createVueRouterAdapter } from '@/adapters/vue-router-adapter';
export type { VueRouterAdapterOptions } from '@/adapters/vue-router-adapter';

// ============================================================================
// CONTEXT AND PLUGIN
// ============================================================================

/**
 * Provides query adapter context for dependency injection
 * @example
 * ```ts
 * // Global setup
 * app.use(createVueQsPlugin({
 *   queryAdapter: createVueRouterAdapter(router)
 * }));
 *
 * // Component usage
 * const adapter = useQueryAdapter();
 * ```
 */
export { provideQueryAdapter, useQueryAdapter, createVueQsPlugin } from '@/adapter-context';
export type { VueQueryPluginOptions } from '@/adapter-context';

// ============================================================================
// SERIALIZERS (CODECS)
// ============================================================================

/**
 * Built-in codecs for common data types
 * @example
 * ```ts
 * import { stringCodec, numberCodec, booleanCodec } from 'vue-qs';
 *
 * const name = queryRef('name', { codec: stringCodec });
 * const age = queryRef('age', { codec: numberCodec });
 * const active = queryRef('active', { codec: booleanCodec });
 * ```
 */
export {
  stringCodec,
  numberCodec,
  booleanCodec,
  dateISOCodec,
  createJsonCodec,
  createArrayCodec,
  createEnumCodec,
} from '@/serializers';

/**
 * Serializers namespace for convenience
 * @example
 * ```ts
 * import { serializers } from 'vue-qs';
 *
 * const page = queryRef('page', {
 *   codec: serializers.numberCodec
 * });
 * ```
 */
export * as serializers from '@/serializers';

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Utility functions for URL manipulation and environment detection
 * @example
 * ```ts
 * import { parseSearchString, buildSearchString } from 'vue-qs';
 *
 * const params = parseSearchString('?page=1&search=test');
 * const query = buildSearchString({ page: '1', search: 'test' });
 * ```
 */
export {
  isBrowserEnvironment,
  createRuntimeEnvironment,
  parseSearchString,
  buildSearchString,
  areValuesEqual,
  mergeObjects,
  removeUndefinedValues,
} from '@/utils/core-helpers';
