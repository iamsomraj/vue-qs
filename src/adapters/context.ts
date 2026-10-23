import {
  defineComponent,
  hasInjectionContext,
  inject,
  provide,
  type App,
  type InjectionKey,
  type Plugin,
  type PropType,
} from 'vue';
import type { QueryAdapter } from '@/adapters/types';
import type { Options } from '@/options';

/** Injection key holding the query adapter. */
export const QUERY_ADAPTER_KEY: InjectionKey<QueryAdapter> = Symbol.for('vue-qs:adapter');

/** Injection key holding the options provided with the adapter. */
export const QUERY_OPTIONS_KEY: InjectionKey<VueQsOptions> = Symbol.for('vue-qs:options');

/** URL update options that can be set app-wide with {@link VueQsOptions.defaultOptions}. */
export type DefaultOptions = Pick<
  Options,
  'history' | 'scroll' | 'shallow' | 'clearOnDefault' | 'limitUrlUpdates'
>;

/** Settings provided together with an adapter. */
export type VueQsOptions = {
  /** Defaults for URL update options, overridden by parser, composable and call options */
  defaultOptions?: DefaultOptions;
  /**
   * Transforms the search params right before each URL update,
   * e.g. to sort keys for canonical URLs. May mutate and return its argument.
   */
  processUrlSearchParams?: (search: URLSearchParams) => URLSearchParams;
};

/** Options for {@link createVueQs}. */
export type VueQsPluginOptions = VueQsOptions & {
  /** The adapter used by every composable in the app */
  adapter: QueryAdapter;
};

/**
 * Creates the vue-qs plugin, providing an adapter to the whole app.
 *
 * @example
 * ```ts
 * import { createVueQs } from 'vue-qs'
 * import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router'
 *
 * app.use(createVueQs({ adapter: createVueRouterAdapter(router) }))
 *
 * // With app-wide settings
 * app.use(
 *   createVueQs({
 *     adapter,
 *     defaultOptions: { history: 'push' },
 *     processUrlSearchParams: (search) => { search.sort(); return search },
 *   })
 * )
 * ```
 */
export function createVueQs(options: VueQsPluginOptions): Plugin {
  const { adapter, ...settings } = options;
  return {
    install(app: App) {
      app.provide(QUERY_ADAPTER_KEY, adapter);
      app.provide(QUERY_OPTIONS_KEY, settings);
    },
  };
}

/**
 * Provides an adapter, and its settings, to the current component and its descendants.
 * Must be called inside `setup()`.
 */
export function provideQueryAdapter(adapter: QueryAdapter, options: VueQsOptions = {}): void {
  provide(QUERY_ADAPTER_KEY, adapter);
  provide(QUERY_OPTIONS_KEY, options);
}

/**
 * Returns the settings provided with the adapter.
 * @internal
 */
export function useQueryOptions(): VueQsOptions {
  return inject(QUERY_OPTIONS_KEY, {});
}

/**
 * Returns the adapter provided by {@link createVueQs}, {@link provideQueryAdapter}
 * or {@link VueQsAdapter}.
 *
 * @throws When called outside an injection context or without a provided adapter
 */
export function useQueryAdapter(): QueryAdapter {
  const adapter = hasInjectionContext() ? inject(QUERY_ADAPTER_KEY, null) : null;
  if (!adapter) {
    throw new Error(
      '[vue-qs] No adapter found. Install the plugin with `app.use(createVueQs({ adapter }))` ' +
        'and call composables inside `setup()` (or `app.runWithContext()`). ' +
        'See https://iamsomraj.github.io/vue-qs/guide/adapters'
    );
  }
  return adapter;
}

/**
 * Provides an adapter to its default slot, as an alternative to the plugin.
 *
 * @example
 * ```vue
 * <VueQsAdapter :adapter="adapter">
 *   <App />
 * </VueQsAdapter>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/naming-convention -- Vue components are PascalCase
export const VueQsAdapter = defineComponent({
  name: 'VueQsAdapter',
  props: {
    adapter: {
      type: Object as PropType<QueryAdapter>,
      required: true,
    },
    defaultOptions: {
      type: Object as PropType<DefaultOptions>,
      default: undefined,
    },
    processUrlSearchParams: {
      type: Function as PropType<VueQsOptions['processUrlSearchParams']>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    provideQueryAdapter(props.adapter, {
      defaultOptions: props.defaultOptions,
      processUrlSearchParams: props.processUrlSearchParams,
    });
    return () => slots.default?.();
  },
});
