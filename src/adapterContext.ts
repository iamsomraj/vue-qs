import { inject, provide } from 'vue';
import type { App } from 'vue';
import type { QueryAdapter } from '@/types';

// Symbol used for dependency injection of the active query adapter
export const AdapterSymbol: unique symbol = Symbol.for('vue-qs:adapter');

// Manually provide an adapter inside a component tree (useful outside plugin usage)
export function provideQueryAdapter(adapter: QueryAdapter) {
  provide(AdapterSymbol, adapter);
}

// Access the nearest provided adapter (if any)
export function useQueryAdapter(): QueryAdapter | undefined {
  return inject<QueryAdapter>(AdapterSymbol);
}

// Vue plugin so users can write: app.use(createVueQs({ adapter }))
export function createVueQs(options: { adapter: QueryAdapter }) {
  const { adapter } = options;
  return {
    install(app: App) {
      app.provide(AdapterSymbol, adapter);
    },
  };
}
