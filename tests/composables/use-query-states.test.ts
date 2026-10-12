import { describe, expect, it, vi } from 'vitest';
import { isReactive, toRefs } from 'vue';
import { createTestingAdapter } from '@/adapters/testing';
import {
  createVueQs,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from '@/index';
import { flushPromises, withSetup } from '../helpers';

function setup(searchParams = '') {
  const onUrlUpdate = vi.fn();
  const adapter = createTestingAdapter({ searchParams, onUrlUpdate });
  return { adapter, onUrlUpdate, plugin: createVueQs({ adapter }) };
}

const coordinates = {
  lat: parseAsFloat.withDefault(0),
  lng: parseAsFloat.withDefault(0),
};

describe('useQueryStates', () => {
  it('reads every key with defaults', () => {
    const { plugin } = setup('?lat=1.5');
    const { result } = withSetup(() => useQueryStates(coordinates), [plugin]);
    expect(isReactive(result)).toBe(true);
    expect({ ...result }).toEqual({ lat: 1.5, lng: 0 });
  });

  it('writes when a property is assigned', async () => {
    const { plugin, onUrlUpdate } = setup();
    const { result } = withSetup(() => useQueryStates(coordinates), [plugin]);
    result.lat = 2;
    result.lng = 3;
    expect(result.lat).toBe(2);
    await flushPromises();
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?lat=2&lng=3');
  });

  it('toRefs returns writable refs (v-model friendly)', async () => {
    const { plugin, onUrlUpdate } = setup();
    const { result } = withSetup(() => toRefs(useQueryStates(coordinates)), [plugin]);
    expect(Object.keys(result)).toEqual(['lat', 'lng']);
    result.lat.value = 4;
    await flushPromises();
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?lat=4');
  });

  it('$set updates several keys in one URL update', async () => {
    const { plugin, onUrlUpdate } = setup('?lat=1&lng=1');
    const { result } = withSetup(() => useQueryStates(coordinates), [plugin]);
    const search = await result.$set({ lat: 5 });
    expect(search.toString()).toBe('lat=5&lng=1');
    expect(result.lng).toBe(1);
    await result.$set((current) => ({ lat: current.lat + 1, lng: current.lng + 1 }));
    expect({ ...result }).toEqual({ lat: 6, lng: 2 });
    expect(onUrlUpdate).toHaveBeenCalledTimes(2);
  });

  it('$set(null) clears every key', async () => {
    const { plugin, onUrlUpdate } = setup('?lat=1&lng=1&other=x');
    const { result } = withSetup(() => useQueryStates(coordinates), [plugin]);
    await result.$set(null);
    expect({ ...result }).toEqual({ lat: 0, lng: 0 });
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?other=x');
  });

  it('maps keys with urlKeys', async () => {
    const { plugin, onUrlUpdate } = setup('?y=1');
    const { result } = withSetup(
      () => useQueryStates(coordinates, { urlKeys: { lat: 'y', lng: 'x' } }),
      [plugin]
    );
    expect(result.lat).toBe(1);
    await result.$set({ lng: 2 });
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?y=1&x=2');
  });

  it('applies hook options, overridden by parser and call options', async () => {
    const { plugin, onUrlUpdate } = setup();
    const { result } = withSetup(
      () =>
        useQueryStates(
          { a: parseAsString, b: parseAsString.withOptions({ scroll: true }) },
          { history: 'push' }
        ),
      [plugin]
    );
    await result.$set({ a: 'x' });
    expect(onUrlUpdate.mock.calls[0]![0].options).toMatchObject({ history: 'push', scroll: false });
    await result.$set({ b: 'y' }, { history: 'replace' });
    expect(onUrlUpdate.mock.calls[1]![0].options).toMatchObject({
      history: 'replace',
      scroll: true,
    });
  });

  it('stays in sync with useQueryState on the same key', () => {
    const { plugin } = setup();
    const { result } = withSetup(
      () => ({
        states: useQueryStates({ page: parseAsInteger.withDefault(1) }),
        page: useQueryState('page', parseAsInteger.withDefault(1)),
      }),
      [plugin]
    );
    result.page.value = 3;
    expect(result.states.page).toBe(3);
    result.states.page = 4;
    expect(result.page.value).toBe(4);
  });

  it('follows external URL changes', () => {
    const { plugin, adapter } = setup();
    const { result } = withSetup(() => useQueryStates(coordinates), [plugin]);
    adapter.setSearchParams({ lat: '9' });
    expect(result.lat).toBe(9);
  });

  it('$set is not enumerable', () => {
    const { plugin } = setup();
    const { result } = withSetup(() => useQueryStates(coordinates), [plugin]);
    expect(Object.keys(result)).toEqual(['lat', 'lng']);
    expect(JSON.stringify(result)).toBe('{"lat":0,"lng":0}');
    expect(typeof result.$set).toBe('function');
  });
});
