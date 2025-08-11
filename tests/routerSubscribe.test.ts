import { describe, it, expect } from 'vitest';
import { useQueryRef, useQueryReactive } from '@/index';
import { createVueRouterQueryAdapter } from '@/routerAdapter';

function createMockRouter() {
  let query: Record<string, any> = {};
  const listeners: Array<() => void> = [];
  return {
    currentRoute: { value: { query } },
    push({ query: q }: { query: Record<string, any> }) {
      query = { ...q };
      (this.currentRoute as any).value = { query };
      listeners.forEach((l) => l());
      return Promise.resolve();
    },
    replace({ query: q }: { query: Record<string, any> }) {
      query = { ...q };
      (this.currentRoute as any).value = { query };
      listeners.forEach((l) => l());
      return Promise.resolve();
    },
    afterEach(cb: () => void) {
      listeners.push(cb);
      return () => {
        const i = listeners.indexOf(cb);
        if (i >= 0) listeners.splice(i, 1);
      };
    },
  } as any;
}

describe('router adapter subscribe behavior', () => {
  it('useQueryRef twoWay updates state when router query changes', async () => {
    const router = createMockRouter();
    const adapter = createVueRouterQueryAdapter(router);

    const page = useQueryRef<number>('p', {
      default: 1,
      parse: Number,
      serialize: (n) => String(n),
      twoWay: true,
      adapter,
    });

    expect(page.value).toBe(1);
    await router.push({ query: { p: '5' } });
    // adapter subscription should update ref
    expect(page.value).toBe(5);
  });

  it('useQueryReactive twoWay updates state when router query changes', async () => {
    const router = createMockRouter();
    const adapter = createVueRouterQueryAdapter(router);

    const { state } = useQueryReactive(
      {
        q: { default: '', parse: String },
        n: { default: 0, parse: Number },
      },
      { twoWay: true, adapter }
    );

    expect(state.q).toBe('');
    expect(state.n).toBe(0);

    await router.replace({ query: { q: 'hello', n: '9' } });
    expect(state.q).toBe('hello');
    expect(state.n).toBe(9);
  });
});
