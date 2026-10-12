import type { Ref } from 'vue';
import { useQueryAdapter } from '@/adapters/context';
import { createKeyState } from '@/lib/key-state';
import { getRuntime } from '@/lib/runtime';
import type { Options } from '@/options';
import {
  parseAsString,
  type AnyParserBuilder,
  type ParserBuilder,
  type ParserBuilderWithDefault,
  type ParserType,
} from '@/parsers';

/** New value for a query state: a value, `null` to remove the key, or an updater function. */
export type SetQueryStateValue<T> = T | null | ((current: T) => T | null);

/**
 * A writable ref bound to a URL query key.
 *
 * Assign `.value` (or use `v-model`) to update the URL, or call `.set()`
 * to pass options and await the URL update.
 */
export type QueryStateRef<T> = Ref<T> & {
  /**
   * Updates the state and queues a URL update.
   * Pass `null` to remove the key (the state falls back to the default value).
   * @returns The search params once written to the URL
   */
  set(value: SetQueryStateValue<T>, options?: Options): Promise<URLSearchParams>;
};

/** Options accepted by `useQueryState` when no parser is given (string state). */
export type UseQueryStateOptions = Options & {
  /** Value used when the key is missing from the URL */
  defaultValue?: string;
};

function isParser(input: unknown): input is AnyParserBuilder {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof (input as { parse?: unknown }).parse === 'function'
  );
}

/**
 * Binds a URL query key to a writable ref.
 *
 * @param key The query key in the URL
 * @param parser A parser (e.g. `parseAsInteger.withDefault(1)`), or options for a string state
 *
 * @example
 * ```ts
 * const q = useQueryState('q')                                        // Ref<string | null>
 * const page = useQueryState('page', parseAsInteger.withDefault(1))   // Ref<number>
 *
 * page.value++                                   // ?page=2
 * await page.set((p) => p + 1, { history: 'push' })
 * await page.set(null)                           // removes ?page, page.value === 1
 * ```
 *
 * ```vue
 * <input v-model="q" />
 * ```
 */
export function useQueryState<T, K extends ParserType>(
  key: string,
  parser: ParserBuilderWithDefault<T, K>
): QueryStateRef<NonNullable<T>>;
export function useQueryState<T, K extends ParserType>(
  key: string,
  parser: ParserBuilder<T, K>
): QueryStateRef<T | null>;
export function useQueryState(
  key: string,
  options: UseQueryStateOptions & { defaultValue: string }
): QueryStateRef<string>;
export function useQueryState(
  key: string,
  options?: UseQueryStateOptions
): QueryStateRef<string | null>;
export function useQueryState(
  key: string,
  parserOrOptions: AnyParserBuilder | UseQueryStateOptions = {}
): QueryStateRef<unknown> {
  const adapter = useQueryAdapter();
  let parser: AnyParserBuilder;
  if (isParser(parserOrOptions)) {
    parser = parserOrOptions;
  } else {
    const { defaultValue, ...options } = parserOrOptions;
    parser =
      defaultValue === undefined
        ? parseAsString.withOptions(options)
        : parseAsString.withDefault(defaultValue).withOptions(options);
  }

  const state = createKeyState(adapter, getRuntime(adapter), key, parser);
  return Object.assign(state.ref, { set: state.set }) as QueryStateRef<unknown>;
}
