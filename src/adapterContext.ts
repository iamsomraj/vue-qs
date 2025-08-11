import { inject, provide } from 'vue';
import type { App } from 'vue';
import type { QueryAdapter } from '@/types';

export const AdapterSymbol: unique symbol = Symbol.for('vue-qs:adapter');

export function provideQueryAdapter(adapter: QueryAdapter) {
  provide(AdapterSymbol, adapter);
}

export function useQueryAdapter(): QueryAdapter | undefined {
  return inject<QueryAdapter>(AdapterSymbol);
}

export function createVueQs(options: { adapter: QueryAdapter }) {
  const { adapter } = options;
  return {
    install(app: App) {
      app.provide(AdapterSymbol, adapter);
    },
  };
}
