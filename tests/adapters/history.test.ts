import { describe, expect, it, vi } from 'vitest';
import { createHistoryAdapter } from '@/adapters/history';
import { createVueQs, parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from '@/index';
import { flushPromises, withSetup } from '../helpers';

function mount<T>(composable: () => T) {
  return withSetup(composable, [createVueQs({ adapter: createHistoryAdapter() })]);
}

describe('createHistoryAdapter', () => {
  it('reads the initial value from location.search', () => {
    window.history.replaceState(null, '', '/page?q=hello');
    const { result } = mount(() => useQueryState('q'));
    expect(result.value).toBe('hello');
  });

  it('replaces the history entry by default, keeping path and hash', async () => {
    window.history.replaceState(null, '', '/items?keep=1#section');
    const length = window.history.length;
    const { result } = mount(() => useQueryState('page', parseAsInteger.withDefault(1)));
    await result.set(2);
    expect(window.location.pathname).toBe('/items');
    expect(window.location.search).toBe('?keep=1&page=2');
    expect(window.location.hash).toBe('#section');
    expect(window.history.length).toBe(length);
  });

  it('pushes a history entry with history: push', async () => {
    const length = window.history.length;
    const { result } = mount(() => useQueryState('q'));
    await result.set('a', { history: 'push' });
    expect(window.history.length).toBe(length + 1);
  });

  it('keeps readable separators in the URL', async () => {
    const { result } = mount(() => useQueryState('tags', parseAsArrayOf(parseAsString)));
    await result.set(['vue', 'nuxt']);
    expect(window.location.search).toBe('?tags=vue,nuxt');
  });

  it('syncs when other code calls pushState / replaceState', () => {
    const { result } = mount(() => useQueryState('q'));
    window.history.pushState(null, '', '/?q=external');
    expect(result.value).toBe('external');
    window.history.replaceState(null, '', '/');
    expect(result.value).toBeNull();
  });

  it('syncs on popstate (Back / Forward)', () => {
    const { result } = mount(() => useQueryState('q'));
    window.history.replaceState(null, '', '/?q=back');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(result.value).toBe('back');
  });

  it('scrolls to the top with scroll: true', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const { result } = mount(() => useQueryState('q'));
    await result.set('a', { scroll: true });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
    scrollTo.mockRestore();
  });

  it('removes listeners on unmount', async () => {
    const { result, unmount } = mount(() => useQueryState('q'));
    unmount();
    window.history.pushState(null, '', '/?q=after');
    await flushPromises();
    expect(result.value).toBeNull();
  });
});
