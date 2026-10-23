import { describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { createTestingAdapter } from '@/adapters/testing';
import {
  createVueQs,
  debounce,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
  VueQsAdapter,
  type VueQsOptions,
} from '@/index';
import { flushPromises, withSetup } from '../helpers';

function setup(searchParams = '', settings: VueQsOptions = {}) {
  const onUrlUpdate = vi.fn();
  const adapter = createTestingAdapter({ searchParams, onUrlUpdate, hasMemory: true });
  return { adapter, onUrlUpdate, plugin: createVueQs({ adapter, ...settings }) };
}

describe('defaultOptions', () => {
  it('applies app-wide defaults', async () => {
    const { plugin, onUrlUpdate } = setup('', {
      defaultOptions: { history: 'push', scroll: true },
    });
    const { result } = withSetup(() => useQueryState('q'), [plugin]);
    await result.set('vue');
    expect(onUrlUpdate.mock.calls[0]![0].options).toEqual({
      history: 'push',
      scroll: true,
      shallow: true,
    });
  });

  it('is overridden by parser, composable and call options', async () => {
    const { plugin, onUrlUpdate } = setup('', { defaultOptions: { history: 'push' } });
    const { result } = withSetup(
      () => ({
        parser: useQueryState('a', parseAsString.withOptions({ history: 'replace' })),
        hook: useQueryStates({ b: parseAsString }, { history: 'replace' }),
        call: useQueryState('c'),
      }),
      [plugin]
    );
    await result.parser.set('1');
    await result.hook.$set({ b: '2' });
    await result.call.set('3', { history: 'replace' });
    expect(onUrlUpdate.mock.calls.map(([event]) => event.options.history)).toEqual([
      'replace',
      'replace',
      'replace',
    ]);
  });

  it('can keep default values in the URL', async () => {
    const { plugin, onUrlUpdate } = setup('', { defaultOptions: { clearOnDefault: false } });
    const { result } = withSetup(
      () => useQueryState('page', parseAsInteger.withDefault(1)),
      [plugin]
    );
    await result.set(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?page=1');
  });

  it('can debounce URL updates', async () => {
    vi.useFakeTimers();
    try {
      const { plugin, onUrlUpdate } = setup('', {
        defaultOptions: { limitUrlUpdates: debounce(200) },
      });
      const { result } = withSetup(() => useQueryState('q'), [plugin]);
      result.value = 'a';
      result.value = 'ab';
      await vi.advanceTimersByTimeAsync(100);
      expect(onUrlUpdate).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(200);
      expect(onUrlUpdate).toHaveBeenCalledTimes(1);
      expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?q=ab');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('processUrlSearchParams', () => {
  it('transforms the search params before each URL update', async () => {
    const { plugin, onUrlUpdate } = setup('?z=1', {
      processUrlSearchParams: (search) => {
        search.sort();
        return search;
      },
    });
    const { result } = withSetup(() => useQueryState('a'), [plugin]);
    await result.set('2');
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?a=2&z=1');
  });

  it('can return new search params', async () => {
    const { plugin, onUrlUpdate } = setup('', {
      processUrlSearchParams: (search) => new URLSearchParams([...search, ['v', '1']]),
    });
    const { result } = withSetup(() => useQueryState('a'), [plugin]);
    const search = await result.set('x');
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?a=x&v=1');
    expect(search.toString()).toBe('a=x&v=1');
  });

  it('discards the update and resyncs state when it throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { plugin, onUrlUpdate } = setup('?a=old', {
      processUrlSearchParams: () => {
        throw new Error('Boom');
      },
    });
    const { result } = withSetup(() => useQueryState('a'), [plugin]);
    await result.set('new');
    await flushPromises();
    expect(onUrlUpdate).not.toHaveBeenCalled();
    expect(result.value).toBe('old');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('VueQsAdapter', () => {
  it('provides settings to its subtree', async () => {
    const onUrlUpdate = vi.fn();
    const adapter = createTestingAdapter({ onUrlUpdate });
    let state!: ReturnType<typeof useQueryState>;
    const Child = defineComponent({
      setup() {
        state = useQueryState('q');
        return () => h('div');
      },
    });
    const app = createApp(() =>
      h(VueQsAdapter, { adapter, defaultOptions: { history: 'push' } }, () => h(Child))
    );
    app.mount(document.createElement('div'));
    await state.set('vue');
    expect(onUrlUpdate.mock.calls[0]![0].options.history).toBe('push');
    app.unmount();
  });
});
