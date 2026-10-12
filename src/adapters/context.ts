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

/** Injection key holding the query adapter. */
export const QUERY_ADAPTER_KEY: InjectionKey<QueryAdapter> = Symbol.for('vue-qs:adapter');

/** Options for {@link createVueQs}. */
export type VueQsPluginOptions = {
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
 * ```
 */
export function createVueQs(options: VueQsPluginOptions): Plugin {
  return {
    install(app: App) {
      app.provide(QUERY_ADAPTER_KEY, options.adapter);
    },
  };
}

/**
 * Provides an adapter to the current component and its descendants.
 * Must be called inside `setup()`.
 */
export function provideQueryAdapter(adapter: QueryAdapter): void {
  provide(QUERY_ADAPTER_KEY, adapter);
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
  },
  setup(props, { slots }) {
    provideQueryAdapter(props.adapter);
    return () => slots.default?.();
  },
});
