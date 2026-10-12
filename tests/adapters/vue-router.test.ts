import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';
import { createVueRouterAdapter } from '@/adapters/vue-router';
import {
  createVueQs,
  parseAsInteger,
  parseAsNativeArrayOf,
  useQueryState,
  useQueryStates,
} from '@/index';
import { withSetup } from '../helpers';

const Empty = defineComponent({ render: () => h('div') });

async function createTestRouter(initial = '/'): Promise<Router> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Empty },
      { path: '/users/:id', name: 'user', component: Empty },
    ],
  });
  await router.push(initial);
  await router.isReady();
  return router;
}

function mount<T>(router: Router, composable: () => T) {
  return withSetup(composable, [router, createVueQs({ adapter: createVueRouterAdapter(router) })]);
}

describe('createVueRouterAdapter', () => {
  it('reads the initial value from the current route', async () => {
    const router = await createTestRouter('/?page=3');
    const { result } = mount(router, () => useQueryState('page', parseAsInteger.withDefault(1)));
    expect(result.value).toBe(3);
  });

  it('updates the route query, keeping path, params, other keys and hash', async () => {
    const router = await createTestRouter('/users/42?tab=info#top');
    const { result } = mount(router, () => useQueryState('page', parseAsInteger.withDefault(1)));
    await result.set(2);
    expect(router.currentRoute.value.fullPath).toBe('/users/42?tab=info&page=2#top');
    expect(router.currentRoute.value.params).toEqual({ id: '42' });
  });

  it('follows router.push from outside (regression for 0.1.x)', async () => {
    const router = await createTestRouter('/');
    const { result } = mount(router, () => useQueryState('q'));
    await router.push({ query: { q: 'from-router' } });
    expect(result.value).toBe('from-router');
    await router.push({ query: {} });
    expect(result.value).toBeNull();
  });

  it('follows Back navigation', async () => {
    const router = await createTestRouter('/?step=1');
    const { result } = mount(router, () => useQueryState('step', parseAsInteger.withDefault(0)));
    await result.set(2, { history: 'push' });
    expect(router.currentRoute.value.query.step).toBe('2');
    const done = new Promise<void>((resolve) => {
      const remove = router.afterEach(() => {
        remove();
        resolve();
      });
    });
    router.back();
    await done;
    expect(result.value).toBe(1);
  });

  it('batches several keys into one navigation', async () => {
    const router = await createTestRouter('/');
    let navigations = 0;
    router.afterEach(() => {
      navigations++;
    });
    const { result } = mount(router, () =>
      useQueryStates({ a: parseAsInteger.withDefault(0), b: parseAsInteger.withDefault(0) })
    );
    await result.$set({ a: 1, b: 2 });
    expect(navigations).toBe(1);
    expect(router.currentRoute.value.query).toEqual({ a: '1', b: '2' });
  });

  it('supports repeated keys', async () => {
    const router = await createTestRouter('/?id=1&id=2');
    const { result } = mount(router, () =>
      useQueryState('id', parseAsNativeArrayOf(parseAsInteger))
    );
    expect(result.value).toEqual([1, 2]);
    await result.set([3, 4]);
    expect(router.currentRoute.value.query.id).toEqual(['3', '4']);
    await result.set([5]);
    expect(router.currentRoute.value.query.id).toBe('5');
  });

  it('resolves even when a guard cancels the navigation', async () => {
    const router = await createTestRouter('/');
    router.beforeEach((to) => to.query.blocked === undefined);
    const { result } = mount(router, () => useQueryState('blocked'));
    await expect(result.set('yes')).resolves.toBeInstanceOf(URLSearchParams);
    expect(router.currentRoute.value.query.blocked).toBeUndefined();
  });
});
