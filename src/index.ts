/**
 * vue-qs - Type-safe search params state manager for Vue, a port of nuqs.
 *
 * @example
 * ```ts
 * import { useQueryState, parseAsInteger } from 'vue-qs'
 *
 * const page = useQueryState('page', parseAsInteger.withDefault(1))
 * page.value++ // ?page=2
 * ```
 *
 * @packageDocumentation
 */

export { useQueryState } from '@/composables/use-query-state';
export type {
  QueryStateRef,
  SetQueryStateValue,
  UseQueryStateOptions,
} from '@/composables/use-query-state';
export { useQueryStates } from '@/composables/use-query-states';
export type {
  QueryStates,
  SetQueryStatesValue,
  UseQueryStatesOptions,
} from '@/composables/use-query-states';

export {
  createVueQs,
  provideQueryAdapter,
  useQueryAdapter,
  VueQsAdapter,
  QUERY_ADAPTER_KEY,
} from '@/adapters/context';
export type { VueQsPluginOptions } from '@/adapters/context';
export { createAdapter } from '@/adapters/types';
export type { QueryAdapter, UpdateUrlOptions } from '@/adapters/types';

export * from '@/server';
