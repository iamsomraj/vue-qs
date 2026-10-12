import type { QueryAdapter } from '@/adapters/types';
import { UpdateQueue } from '@/lib/queue';
import type { QueryValue } from '@/types';

type SyncListener = (query: QueryValue) => void;

/**
 * Shares in-flight state between composables bound to the same key,
 * so they update together before the URL is written.
 * @internal
 */
export class SyncEmitter {
  private readonly listeners = new Map<string, Set<SyncListener>>();

  on(key: string, listener: SyncListener): () => void {
    let set = this.listeners.get(key);
    if (!set) {
      set = new Set();
      this.listeners.set(key, set);
    }
    set.add(listener);
    return () => {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  emit(key: string, query: QueryValue, source: SyncListener): void {
    this.listeners.get(key)?.forEach((listener) => {
      if (listener !== source) {
        listener(query);
      }
    });
  }
}

/** @internal */
export type Runtime = {
  queue: UpdateQueue;
  emitter: SyncEmitter;
};

const runtimes = new WeakMap<QueryAdapter, Runtime>();

/**
 * Returns the queue and emitter of an adapter, so state is scoped
 * per adapter (per app, per SSR request, per test).
 * @internal
 */
export function getRuntime(adapter: QueryAdapter): Runtime {
  let runtime = runtimes.get(adapter);
  if (!runtime) {
    runtime = { queue: new UpdateQueue(adapter), emitter: new SyncEmitter() };
    runtimes.set(adapter, runtime);
  }
  return runtime;
}
