import {
  computed,
  getCurrentScope,
  onScopeDispose,
  shallowRef,
  type WritableComputedRef,
} from 'vue';
import type { QueryAdapter } from '@/adapters/types';
import type { Runtime } from '@/lib/runtime';
import { parseQuery, readQuery, serializeQuery } from '@/lib/search-params';
import { resolveOptions, type Options } from '@/options';
import type { AnyParserBuilder } from '@/parsers';
import type { QueryValue } from '@/types';

/** @internal */
export type KeyState = {
  ref: WritableComputedRef<unknown>;
  current(): unknown;
  set(value: unknown, callOptions?: Options): Promise<URLSearchParams>;
};

/**
 * Binds one URL key to reactive state: reads it from the adapter, follows
 * external URL changes and sibling composables, and queues writes.
 * @internal
 */
export function createKeyState(
  adapter: QueryAdapter,
  runtime: Runtime,
  urlKey: string,
  parser: AnyParserBuilder,
  hookOptions: Options = {}
): KeyState {
  const { queue, emitter } = runtime;
  const defaultValue: unknown = 'defaultValue' in parser ? parser.defaultValue : null;

  function readFromUrl(): unknown {
    const pending = queue.getPendingQuery(urlKey);
    const query =
      pending !== undefined ? pending : readQuery(adapter.getSearchParams(), urlKey, parser.type);
    return parseQuery(parser, query);
  }

  function isEqual(valueA: unknown, valueB: unknown): boolean {
    if (valueA === null || valueB === null) {
      return valueA === valueB;
    }
    return parser.eq(valueA, valueB);
  }

  const internal = shallowRef<unknown>(readFromUrl());

  function sync(next: unknown): void {
    if (!isEqual(internal.value, next)) {
      internal.value = next;
    }
  }

  const onSiblingUpdate = (query: QueryValue): void => sync(parseQuery(parser, query));
  const offEmitter = emitter.on(urlKey, onSiblingUpdate);
  const unsubscribe = adapter.subscribe(() => sync(readFromUrl()));

  if (getCurrentScope()) {
    onScopeDispose(() => {
      offEmitter();
      unsubscribe();
    });
  }

  function current(): unknown {
    return internal.value ?? defaultValue;
  }

  function set(update: unknown, callOptions: Options = {}): Promise<URLSearchParams> {
    const next: unknown =
      typeof update === 'function' ? (update as (value: unknown) => unknown)(current()) : update;
    const options = resolveOptions(callOptions, parser, hookOptions);
    const query = serializeQuery(parser, next, options.clearOnDefault ?? true);
    internal.value = next ?? null;
    emitter.emit(urlKey, query, onSiblingUpdate);
    return queue.push(urlKey, query, options);
  }

  const ref = computed<unknown>({
    get: current,
    set: (value) => {
      void set(value);
    },
  });

  return { ref, current, set };
}
