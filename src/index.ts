// Core Types
export type * from '@/types';

// Composables
export { queryRef } from '@/composables/use-query-ref';
export { queryReactive } from '@/composables/use-query-reactive';

// Adapters
export { createHistoryAdapter } from '@/adapters/history-adapter';
export type {  HistoryAdapterResult } from '@/adapters/history-adapter';
export { createVueRouterAdapter } from '@/adapters/vue-router-adapter';
export type { VueRouterAdapterOptions } from '@/adapters/vue-router-adapter';

// Context and Plugin
export { provideQueryAdapter, useQueryAdapter, createVueQsPlugin } from '@/adapter-context';
export type { VueQueryPluginOptions } from '@/adapter-context';

// Serializers
export {
  stringCodec,
  numberCodec,
  booleanCodec,
  dateISOCodec,
  createJsonCodec,
  createArrayCodec,
  createEnumCodec,
} from '@/serializers';

// Serializers namespace for convenience
export * as serializers from '@/serializers';

// Utilities
export {
  isBrowserEnvironment,
  createRuntimeEnvironment,
  parseSearchString,
  buildSearchString,
  areValuesEqual,
  mergeObjects,
  removeUndefinedValues,
} from '@/utils/core-helpers';
