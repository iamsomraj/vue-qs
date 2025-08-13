import { describe, it, expect } from 'vitest';
import { createVueRouterAdapter } from '@/adapters/vue-router-adapter';
import { useQueryRef, useQueryReactive } from '@/index';

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
        if (i >= 0) {
          listeners.splice(i, 1);
        }
      };
    },
  } as any;
}

describe('router adapter subscribe behavior', () => {
  it('useQueryRef twoWay updates state when router query changes', async () => {
    const router = createMockRouter();
    const adapter = createVueRouterAdapter(router);

    const page = useQueryRef<number>('p', {
      defaultValue: 1,
      parseFunction: (value) => (value ? Number(value) : 1),
      serializeFunction: (n: number) => String(n),
      enableTwoWaySync: true,
      queryAdapter: adapter,
    });

    expect(page.value).toBe(1);
    await router.push({ query: { p: '5' } });
    // adapter subscription should update ref
    expect(page.value).toBe(5);
  });

  it('useQueryReactive twoWay updates state when router query changes', async () => {
    const router = createMockRouter();
    const adapter = createVueRouterAdapter(router);

    const { queryState } = useQueryReactive(
      {
        q: { defaultValue: '', parseFunction: (value: string | null) => value || '' },
        n: {
          defaultValue: 0,
          parseFunction: (value: string | null) => (value ? Number(value) : 0),
        },
      },
      { enableTwoWaySync: true, queryAdapter: adapter }
    );

    expect(queryState.q).toBe('');
    expect(queryState.n).toBe(0);

    await router.replace({ query: { q: 'hello', n: '9' } });
    expect(queryState.q).toBe('hello');
    expect(queryState.n).toBe(9);
  });
});
