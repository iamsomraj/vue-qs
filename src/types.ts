import type { Ref } from 'vue';

export type Parser<T> = (value: string | null) => T;
export type Serializer<T> = (value: T) => string | null;
export type QueryCodec<T> = { parse: Parser<T>; serialize: Serializer<T> };

export type ParamOption<T> = {
  default?: T;
  parse?: Parser<T>;
  serialize?: Serializer<T>;
  /**
   * Custom equality to compare with `default` when deciding to omit from URL.
   * Defaults to Object.is.
   */
  equals?: (a: T, b: T) => boolean;
  /**
   * If true, will not write to URL when value equals default.
   * Defaults to true.
   */
  omitIfDefault?: boolean;
  /**
   * If true, updates to multiple params can be batched without multiple history entries
   */
  batchKey?: string;
};

export type ParamSchema = Record<string, ParamOption<any>>;

export type UseQueryRefOptions<T> = ParamOption<T> & {
  /**
   * History strategy when updating the URL
   * - 'replace': replaceState (default)
   * - 'push': pushState
   */
  history?: 'replace' | 'push';
  /** Optional adapter override (e.g., Vue Router adapter) */
  adapter?: QueryAdapter;
  /**
   * If true, also listen to window popstate and rehydrate the ref from the URL.
   * Defaults to false
   */
  twoWay?: boolean;
};

export type UseQueryRefReturn<T> = Ref<T> & {
  /** Immediately write the current value to the URL */
  sync(): void;
};

export type UseQueryReactiveReturn<TSchema extends ParamSchema> = {
  state: { [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never };
  /**
   * Batch update multiple params in a single history entry.
   */
  batch(
    update: Partial<{ [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never }>,
    options?: { history?: 'replace' | 'push' }
  ): void;
  /** Immediately write the current state to the URL */
  sync(): void;
};

export type UseQueryReactiveOptions = {
  history?: 'replace' | 'push';
  adapter?: QueryAdapter;
  /**
   * If true, also listen to window popstate and rehydrate the state from the URL.
   * Defaults to false
   */
  twoWay?: boolean;
};

export type QueryAdapter = {
  /** Read current query params as a plain object. Values are strings or undefined. */
  getQuery(): Record<string, string | undefined>;
  /** Replace the query params, merging with existing by default. */
  setQuery(
    next: Record<string, string | undefined>,
    options?: { history?: 'replace' | 'push' }
  ): void;
  /**
   * Optional: subscribe to external query changes (e.g., router nav, popstate).
   * Returns an unsubscribe. Not required by all adapters; if absent, callers can fallback to window popstate.
   */
  subscribe?(cb: () => void): () => void;
};

export type RuntimeEnv = {
  isClient: boolean;
  /** Safe access to window if on client */
  win: Window | null;
};
