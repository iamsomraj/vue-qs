import { reactive } from 'vue';
import { useQueryAdapter } from '@/adapters/context';
import { createKeyState, type KeyState } from '@/lib/key-state';
import { getRuntime } from '@/lib/runtime';
import { getOwn, getUrlKey } from '@/lib/url-keys';
import type { Options } from '@/options';
import type { Nullable, ParserMap, UrlKeys, Values } from '@/types';

/** Options for {@link useQueryStates}. */
export type UseQueryStatesOptions<Parsers extends ParserMap> = Options & {
  /** Map state keys to shorter or different URL keys */
  urlKeys?: UrlKeys<Parsers>;
};

/** New values for `QueryStates.$set`: a partial object, `null` to clear all keys, or an updater. */
export type SetQueryStatesValue<Parsers extends ParserMap> =
  | Partial<Nullable<Values<Parsers>>>
  | null
  | ((current: Values<Parsers>) => Partial<Nullable<Values<Parsers>>> | null);

/**
 * A reactive object bound to several URL query keys.
 * Assign properties (or `v-model` them through `toRefs`) to update the URL.
 */
export type QueryStates<Parsers extends ParserMap> = Values<Parsers> & {
  /**
   * Updates several keys in a single URL update.
   * Keys set to `null` are removed; passing `null` removes every key.
   * @returns The search params once written to the URL
   */
  readonly $set: (
    values: SetQueryStatesValue<Parsers>,
    options?: Options
  ) => Promise<URLSearchParams>;
};

/**
 * Binds several URL query keys to a reactive object. Updates made in the same
 * tick are batched into one URL update.
 *
 * @param parsers An object of parsers, keyed by state key
 * @param options URL update options, and `urlKeys` to rename keys in the URL
 *
 * @example
 * ```ts
 * const coords = useQueryStates(
 *   { lat: parseAsFloat.withDefault(0), lng: parseAsFloat.withDefault(0) },
 *   { urlKeys: { lat: 'y', lng: 'x' } }
 * )
 *
 * coords.lat = 48.85                             // ?y=48.85
 * await coords.$set({ lat: 0, lng: 0 })          // one URL update for both keys
 * const { lat, lng } = toRefs(coords)            // v-model friendly refs
 * ```
 */
export function useQueryStates<Parsers extends ParserMap>(
  parsers: Parsers,
  options: UseQueryStatesOptions<Parsers> = {}
): QueryStates<Parsers> {
  const { urlKeys, ...hookOptions } = options;
  const adapter = useQueryAdapter();
  const runtime = getRuntime(adapter);

  const states = new Map<string, KeyState>();
  const raw: Record<string, unknown> = {};
  Object.entries(parsers).forEach(([key, parser]) => {
    const state = createKeyState(adapter, runtime, getUrlKey(urlKeys, key), parser, hookOptions);
    states.set(key, state);
    raw[key] = state.ref;
  });

  function current(): Values<Parsers> {
    const values: Record<string, unknown> = {};
    states.forEach((state, key) => {
      values[key] = state.current();
    });
    return values as Values<Parsers>;
  }

  async function $set(
    values: SetQueryStatesValue<Parsers>,
    callOptions: Options = {}
  ): Promise<URLSearchParams> {
    const next = typeof values === 'function' ? values(current()) : values;
    const updates: Array<Promise<URLSearchParams>> = [];
    states.forEach((state, key) => {
      if (next === null) {
        updates.push(state.set(null, callOptions));
      } else {
        const value = getOwn(next as Record<string, unknown>, key);
        if (value !== undefined) {
          updates.push(state.set(value, callOptions));
        }
      }
    });
    if (updates.length === 0) {
      return new URLSearchParams(adapter.getSearchParams());
    }
    const results = await Promise.all(updates);
    return results[results.length - 1] ?? new URLSearchParams(adapter.getSearchParams());
  }

  Object.defineProperty(raw, '$set', { value: $set, enumerable: false });
  return reactive(raw) as unknown as QueryStates<Parsers>;
}
