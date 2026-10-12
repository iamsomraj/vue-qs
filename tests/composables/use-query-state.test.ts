import { describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, effectScope, h, nextTick } from 'vue';
import { createTestingAdapter } from '@/adapters/testing';
import {
  createVueQs,
  parseAsArrayOf,
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
  useQueryState,
} from '@/index';
import { flushPromises, withSetup } from '../helpers';

function setup(searchParams = '', hasMemory = false) {
  const onUrlUpdate = vi.fn();
  const adapter = createTestingAdapter({ searchParams, onUrlUpdate, hasMemory });
  return { adapter, onUrlUpdate, plugin: createVueQs({ adapter }) };
}

describe('useQueryState', () => {
  it('reads a string value from the URL', () => {
    const { plugin } = setup('?q=vue');
    const { result } = withSetup(() => useQueryState('q'), [plugin]);
    expect(result.value).toBe('vue');
  });

  it('returns null for a missing key without default', () => {
    const { plugin } = setup();
    const { result } = withSetup(() => useQueryState('q'), [plugin]);
    expect(result.value).toBeNull();
  });

  it('accepts a defaultValue option for strings', () => {
    const { plugin } = setup();
    const { result } = withSetup(() => useQueryState('q', { defaultValue: 'all' }), [plugin]);
    expect(result.value).toBe('all');
  });

  it('parses with a parser and default value', () => {
    const { plugin } = setup('?page=3');
    const { result } = withSetup(
      () => ({
        page: useQueryState('page', parseAsInteger.withDefault(1)),
        size: useQueryState('size', parseAsInteger.withDefault(20)),
        invalid: useQueryState('page', parseAsArrayOf(parseAsInteger)),
      }),
      [plugin]
    );
    expect(result.page.value).toBe(3);
    expect(result.size.value).toBe(20);
    expect(result.invalid.value).toEqual([3]);
  });

  it('falls back to the default for invalid values', () => {
    const { plugin } = setup('?page=abc');
    const { result } = withSetup(
      () => useQueryState('page', parseAsInteger.withDefault(1)),
      [plugin]
    );
    expect(result.value).toBe(1);
  });

  it('writes to the URL when the ref is assigned', async () => {
    const { plugin, onUrlUpdate } = setup();
    const { result } = withSetup(() => useQueryState('q'), [plugin]);
    result.value = 'hello world';
    expect(result.value).toBe('hello world');
    await flushPromises();
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?q=hello+world');
    expect(onUrlUpdate.mock.calls[0]![0].options).toEqual({
      history: 'replace',
      scroll: false,
      shallow: true,
    });
  });

  it('set() resolves with the new search params and supports updaters', async () => {
    const { plugin } = setup('?count=1');
    const { result } = withSetup(
      () => useQueryState('count', parseAsInteger.withDefault(0)),
      [plugin]
    );
    const search = await result.set((count) => count + 1);
    expect(result.value).toBe(2);
    expect(search.get('count')).toBe('2');
  });

  it('set(null) removes the key and resets to the default', async () => {
    const { plugin, onUrlUpdate } = setup('?page=5&other=x');
    const { result } = withSetup(
      () => useQueryState('page', parseAsInteger.withDefault(1)),
      [plugin]
    );
    await result.set(null);
    expect(result.value).toBe(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?other=x');
  });

  it('clears the key when set to the default value (clearOnDefault)', async () => {
    const { plugin, onUrlUpdate } = setup('?page=5');
    const { result } = withSetup(
      () => useQueryState('page', parseAsInteger.withDefault(1)),
      [plugin]
    );
    await result.set(1);
    expect(result.value).toBe(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('');
  });

  it('keeps the default in the URL with clearOnDefault: false', async () => {
    const { plugin, onUrlUpdate } = setup('?page=5');
    const { result } = withSetup(
      () =>
        useQueryState('page', parseAsInteger.withDefault(1).withOptions({ clearOnDefault: false })),
      [plugin]
    );
    await result.set(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?page=1');
  });

  it('call options override parser options', async () => {
    const { plugin, onUrlUpdate } = setup();
    const { result } = withSetup(
      () => useQueryState('q', parseAsString.withOptions({ history: 'push', scroll: true })),
      [plugin]
    );
    await result.set('a');
    expect(onUrlUpdate.mock.calls[0]![0].options).toMatchObject({ history: 'push', scroll: true });
    await result.set('b', { history: 'replace' });
    expect(onUrlUpdate.mock.calls[1]![0].options.history).toBe('replace');
  });

  it('batches updates from the same tick into a single URL update', async () => {
    const { plugin, onUrlUpdate } = setup();
    const { result } = withSetup(
      () => ({
        a: useQueryState('a'),
        b: useQueryState('b', parseAsInteger),
      }),
      [plugin]
    );
    result.a.value = 'x';
    result.b.value = 1;
    result.b.value = 2;
    await flushPromises();
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?a=x&b=2');
  });

  it('push wins when batched updates mix history modes', async () => {
    const { plugin, onUrlUpdate } = setup();
    const { result } = withSetup(
      () => ({ a: useQueryState('a'), b: useQueryState('b') }),
      [plugin]
    );
    void result.a.set('1');
    void result.b.set('2', { history: 'push' });
    await flushPromises();
    expect(onUrlUpdate.mock.calls[0]![0].options.history).toBe('push');
  });

  it('keeps composables bound to the same key in sync', async () => {
    const { plugin } = setup();
    const { result } = withSetup(
      () => ({
        first: useQueryState('count', parseAsInteger.withDefault(0)),
        second: useQueryState('count', parseAsInteger.withDefault(0)),
        raw: useQueryState('count'),
      }),
      [plugin]
    );
    result.first.value = 5;
    expect(result.second.value).toBe(5);
    expect(result.raw.value).toBe('5');
    await result.second.set(null);
    expect(result.first.value).toBe(0);
    expect(result.raw.value).toBeNull();
  });

  it('follows URL changes made outside vue-qs', async () => {
    const { plugin, adapter } = setup('?q=a');
    const { result } = withSetup(() => useQueryState('q'), [plugin]);
    adapter.setSearchParams('?q=b');
    expect(result.value).toBe('b');
    adapter.setSearchParams('');
    expect(result.value).toBeNull();
    await nextTick();
  });

  it('reads back its own updates with a memory adapter', async () => {
    const { plugin, adapter } = setup('', true);
    const { result } = withSetup(() => useQueryState('q'), [plugin]);
    await result.set('x');
    expect(adapter.getSearchParams().get('q')).toBe('x');
    expect(result.value).toBe('x');
  });

  it('supports repeated keys with parseAsNativeArrayOf', async () => {
    const { plugin, onUrlUpdate } = setup('?id=1&id=2');
    const { result } = withSetup(
      () => useQueryState('id', parseAsNativeArrayOf(parseAsInteger)),
      [plugin]
    );
    expect(result.value).toEqual([1, 2]);
    await result.set([3, 4, 5]);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?id=3&id=4&id=5');
    await result.set([]);
    expect(onUrlUpdate.mock.calls[1]![0].queryString).toBe('');
  });

  it('renders and binds with v-model in templates', async () => {
    const { plugin, onUrlUpdate } = setup('?q=a');
    const app = createApp(
      defineComponent({
        setup() {
          const q = useQueryState('q', { defaultValue: '' });
          return () => [
            h('input', {
              value: q.value,
              onInput: (event: Event) => {
                q.value = (event.target as HTMLInputElement).value;
              },
            }),
            h('span', q.value),
          ];
        },
      })
    );
    app.use(plugin);
    const root = document.createElement('div');
    app.mount(root);
    const input = root.querySelector('input')!;
    expect(input.value).toBe('a');
    input.value = 'typed';
    input.dispatchEvent(new Event('input'));
    await nextTick();
    expect(root.querySelector('span')!.textContent).toBe('typed');
    await flushPromises();
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?q=typed');
    app.unmount();
  });

  it('stops following the URL after unmount', () => {
    const { plugin, adapter } = setup('?q=a');
    const { result, unmount } = withSetup(() => useQueryState('q'), [plugin]);
    unmount();
    adapter.setSearchParams('?q=b');
    expect(result.value).toBe('a');
  });

  it('works inside an effect scope with app.runWithContext', () => {
    const { plugin, adapter } = setup('?q=a');
    const { app } = withSetup(() => null, [plugin]);
    const scope = effectScope();
    const q = app.runWithContext(() => scope.run(() => useQueryState('q')))!;
    expect(q.value).toBe('a');
    scope.stop();
    adapter.setSearchParams('?q=b');
    expect(q.value).toBe('a');
  });

  it('throws a helpful error without an adapter', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(() => withSetup(() => useQueryState('q'))).toThrow(/No adapter found/);
    warn.mockRestore();
  });
});
