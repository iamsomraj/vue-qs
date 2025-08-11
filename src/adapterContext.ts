import { inject, provide } from 'vue';
import type { App } from 'vue';
import type { QueryAdapter } from '@/types';

/** Injection symbol used to provide the active QueryAdapter. */
export const AdapterSymbol: unique symbol = Symbol.for('vue-qs:adapter');

/** Provide a {@link QueryAdapter} for child components. */
export function provideQueryAdapter(adapter: QueryAdapter) {
  provide(AdapterSymbol, adapter);
}

/** Retrieve the injected {@link QueryAdapter}, if any. */
export function useQueryAdapter(): QueryAdapter | undefined {
  return inject<QueryAdapter>(AdapterSymbol);
}

/** Create a Vue plugin that provides the given {@link QueryAdapter}. */
export function createVueQs(options: { adapter: QueryAdapter }) {
  const { adapter } = options;
  return {
    install(app: App) {
      app.provide(AdapterSymbol, adapter);
    },
  };
}
