import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingAdapter } from '@/adapters/testing';
import { UpdateQueue } from '@/lib/queue';
import { debounce, throttle } from '@/options';
import { flushPromises } from '../helpers';

function createQueue(rateLimitFactor = 1) {
  const onUrlUpdate = vi.fn();
  const adapter = createTestingAdapter({ onUrlUpdate, hasMemory: true, rateLimitFactor });
  return { queue: new UpdateQueue(adapter), onUrlUpdate, adapter };
}

describe('UpdateQueue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('flushes the first update on the next microtask', async () => {
    const { queue, onUrlUpdate } = createQueue();
    const promise = queue.push('a', '1', {});
    expect(queue.getPendingQuery('a')).toBe('1');
    await flushPromises();
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    await expect(promise).resolves.toEqual(new URLSearchParams('a=1'));
    expect(queue.getPendingQuery('a')).toBeUndefined();
  });

  it('throttles following updates', async () => {
    const { queue, onUrlUpdate } = createQueue();
    void queue.push('a', '1', {});
    await flushPromises();
    void queue.push('a', '2', { limitUrlUpdates: throttle(100) });
    void queue.push('a', '3', {});
    await flushPromises();
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(100);
    expect(onUrlUpdate).toHaveBeenCalledTimes(2);
    expect(onUrlUpdate.mock.calls[1]![0].queryString).toBe('?a=3');
  });

  it('supports the deprecated throttleMs option', async () => {
    const { queue, onUrlUpdate } = createQueue();
    void queue.push('a', '1', {});
    await flushPromises();
    void queue.push('a', '2', { throttleMs: 500 });
    await vi.advanceTimersByTimeAsync(499);
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(onUrlUpdate).toHaveBeenCalledTimes(2);
  });

  it('applies the rate limit factor', async () => {
    const { queue, onUrlUpdate } = createQueue(0);
    void queue.push('a', '1', {});
    await flushPromises();
    void queue.push('a', '2', { limitUrlUpdates: throttle(1000) });
    await flushPromises();
    expect(onUrlUpdate).toHaveBeenCalledTimes(2);
  });

  it('debounces updates per key', async () => {
    const { queue, onUrlUpdate } = createQueue();
    const first = queue.push('q', 'a', { limitUrlUpdates: debounce(200) });
    await vi.advanceTimersByTimeAsync(100);
    const second = queue.push('q', 'ab', { limitUrlUpdates: debounce(200) });
    expect(queue.getPendingQuery('q')).toBe('ab');
    await vi.advanceTimersByTimeAsync(199);
    expect(onUrlUpdate).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?q=ab');
    await expect(first).resolves.toEqual(new URLSearchParams('q=ab'));
    await expect(second).resolves.toEqual(new URLSearchParams('q=ab'));
  });

  it('a throttled update cancels a pending debounce on the same key', async () => {
    const { queue, onUrlUpdate } = createQueue();
    const debounced = queue.push('q', 'slow', { limitUrlUpdates: debounce(500) });
    void queue.push('q', 'fast', {});
    await flushPromises();
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    expect(onUrlUpdate.mock.calls[0]![0].queryString).toBe('?q=fast');
    await expect(debounced).resolves.toEqual(new URLSearchParams('q=fast'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
  });

  it('keeps other keys and removes null ones', async () => {
    const { queue, adapter } = createQueue();
    adapter.setSearchParams('?keep=1&drop=2');
    await queue.push('drop', null, {});
    expect(adapter.getSearchParams().toString()).toBe('keep=1');
  });

  it('resolves even when the adapter throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const adapter = createTestingAdapter({
      onUrlUpdate: () => {
        throw new Error('boom');
      },
    });
    const queue = new UpdateQueue(adapter);
    await expect(queue.push('a', '1', {})).resolves.toBeInstanceOf(URLSearchParams);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
