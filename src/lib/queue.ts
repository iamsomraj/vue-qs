import type { QueryAdapter, UpdateUrlOptions } from '@/adapters/types';
import { debug, warn } from '@/lib/debug';
import { applyQuery } from '@/lib/search-params';
import { resolveRateLimit, type Options } from '@/options';
import type { QueryValue } from '@/types';

type Resolver = (search: URLSearchParams) => void;

type DebouncedUpdate = {
  query: QueryValue;
  options: Options;
  timer: ReturnType<typeof setTimeout>;
  resolvers: Resolver[];
};

function defaultUpdateOptions(): UpdateUrlOptions {
  return { history: 'replace', scroll: false, shallow: true };
}

/**
 * Collects URL updates from all composables bound to one adapter and flushes
 * them as a single URL write, honouring throttle and debounce settings.
 * @internal
 */
export class UpdateQueue {
  private readonly pending = new Map<string, QueryValue>();
  private readonly debounced = new Map<string, DebouncedUpdate>();
  private inflight = new Map<string, QueryValue>();
  private options = defaultUpdateOptions();
  private throttleMs = 0;
  private resolvers: Resolver[] = [];
  private scheduled = false;
  private lastFlushedAt = 0;
  private flushing: Promise<void> = Promise.resolve();

  /**
   * @param adapter The adapter URL updates are written to
   * @param onRejected Called with the updated keys when the adapter did not apply an update
   */
  constructor(
    private readonly adapter: QueryAdapter,
    private readonly onRejected?: (keys: string[]) => void
  ) {}

  /** Returns the queued (not yet written) value of a key, or `undefined` if none. */
  getPendingQuery(key: string): QueryValue | undefined {
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }
    const debounced = this.debounced.get(key);
    if (debounced) {
      return debounced.query;
    }
    return this.inflight.get(key);
  }

  /** Queues an update and resolves with the search params once written to the URL. */
  push(key: string, query: QueryValue, options: Options): Promise<URLSearchParams> {
    const rateLimit = resolveRateLimit(options);
    if (rateLimit.method === 'debounce') {
      return this.pushDebounced(key, query, options, rateLimit.timeMs);
    }
    const cancelled = this.cancelDebounced(key);
    const promise = this.enqueue(key, query, options, rateLimit.timeMs);
    if (cancelled.length > 0) {
      void promise.then((search) => cancelled.forEach((resolve) => resolve(search)));
    }
    return promise;
  }

  private enqueue(
    key: string,
    query: QueryValue,
    options: Options,
    throttleMs: number
  ): Promise<URLSearchParams> {
    this.pending.set(key, query);
    if (options.history === 'push') {
      this.options.history = 'push';
    }
    if (options.scroll === true) {
      this.options.scroll = true;
    }
    if (options.shallow === false) {
      this.options.shallow = false;
    }
    this.throttleMs = Math.max(this.throttleMs, throttleMs * (this.adapter.rateLimitFactor ?? 1));
    const promise = new Promise<URLSearchParams>((resolve) => this.resolvers.push(resolve));
    this.schedule();
    return promise;
  }

  private pushDebounced(
    key: string,
    query: QueryValue,
    options: Options,
    timeMs: number
  ): Promise<URLSearchParams> {
    const resolvers = this.cancelDebounced(key);
    const promise = new Promise<URLSearchParams>((resolve) => resolvers.push(resolve));
    const timer = setTimeout(() => {
      this.debounced.delete(key);
      void this.enqueue(key, query, options, 0).then((search) =>
        resolvers.forEach((resolve) => resolve(search))
      );
    }, timeMs);
    this.debounced.set(key, { query, options, timer, resolvers });
    return promise;
  }

  private cancelDebounced(key: string): Resolver[] {
    const debounced = this.debounced.get(key);
    if (!debounced) {
      return [];
    }
    clearTimeout(debounced.timer);
    this.debounced.delete(key);
    return debounced.resolvers;
  }

  private schedule(): void {
    if (this.scheduled) {
      return;
    }
    this.scheduled = true;
    const delay = Math.max(0, this.lastFlushedAt + this.throttleMs - Date.now());
    if (delay === 0) {
      void Promise.resolve().then(() => this.flush());
    } else {
      setTimeout(() => this.flush(), delay);
    }
  }

  private flush(): void {
    this.scheduled = false;
    const updates = new Map(this.pending);
    const options = this.options;
    const resolvers = this.resolvers;
    this.pending.clear();
    this.options = defaultUpdateOptions();
    this.throttleMs = 0;
    this.resolvers = [];
    // Keep queued values visible to readers until the adapter has written them
    this.inflight = new Map([...this.inflight, ...updates]);

    this.flushing = this.flushing.then(async () => {
      const search = new URLSearchParams(this.adapter.getSearchParams());
      updates.forEach((query, key) => applyQuery(search, key, query));
      debug('Flushing %s with %o', search.toString(), options);
      let rejected: boolean;
      try {
        rejected = (await this.adapter.updateUrl(search, options)) === false;
      } catch (error) {
        warn('Failed to update the URL', error);
        rejected = true;
      } finally {
        updates.forEach((query, key) => {
          if (this.inflight.get(key) === query) {
            this.inflight.delete(key);
          }
        });
        this.lastFlushedAt = Date.now();
      }
      if (rejected) {
        debug('URL update rejected, resyncing %o', [...updates.keys()]);
        // Keys with a newer queued value keep it
        this.onRejected?.(
          [...updates.keys()].filter((key) => this.getPendingQuery(key) === undefined)
        );
      }
      const result = rejected ? new URLSearchParams(this.adapter.getSearchParams()) : search;
      resolvers.forEach((resolve) => resolve(result));
    });
  }
}
