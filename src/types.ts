import type { Ref } from 'vue';

/**
 * Function that parses a raw query string value into a typed value
 * @template T The expected output type
 * @param rawValue The raw string value from the URL query parameter
 * @returns The parsed typed value
 */
export type QueryParser<T> = (rawValue: string | null) => T;

/**
 * Function that serializes a typed value into a string for the URL query
 * @template T The input type to serialize
 * @param typedValue The typed value to serialize
 * @returns The serialized string value or null if the value should be omitted
 */
export type QuerySerializer<T> = (typedValue: T) => string | null;

/**
 * A codec that combines both parse and serialize functions for a given type
 * @template T The type this codec handles
 */
export type QueryCodec<T> = {
  /** Function to parse string values from URL into typed values */
  parse: QueryParser<T>;
  /** Function to serialize typed values back to URL strings */
  serialize: QuerySerializer<T>;
};

/**
 * Configuration options for a single query parameter
 * @template T The type of the parameter value
 */
export type QueryParameterOptions<T> = {
  /** Default value to use when parameter is missing or invalid */
  defaultValue?: T;
  /** Combined codec with both parse and serialize functions */
  codec?: QueryCodec<T>;
  /** Custom parser function (overrides codec.parse if provided) */
  parseFunction?: QueryParser<T>;
  /** Custom serializer function (overrides codec.serialize if provided) */
  serializeFunction?: QuerySerializer<T>;
  /** Custom equality function to compare values (defaults to Object.is) */
  isEqual?: (valueA: T, valueB: T) => boolean;
  /** Whether to omit the parameter from URL when value equals default (default: true) */
  shouldOmitDefault?: boolean;
  /** Optional batch key for grouping parameter updates */
  batchKey?: string;
};

/**
 * Schema defining multiple query parameters with their configurations
 */
export type QueryParameterSchema = Record<string, QueryParameterOptions<any>>;

/**
 * Options for queryRef composable
 * @template T The type of the query parameter value
 */
export type QueryRefOptions<T> = QueryParameterOptions<T> & {
  /** History strategy when updating the URL ('replace' | 'push') */
  historyStrategy?: 'replace' | 'push';
  /** Optional custom query adapter to use */
  queryAdapter?: QueryAdapter;
};

/**
 * Return type from queryRef composable
 * @template T The type of the query parameter value
 */
export type QueryRefReturn<T> = Ref<T> & {
  /** Manually sync the current value to the URL */
  syncToUrl(): void;
};

/**
 * Reactive state object for queryReactive
 * @template TSchema The parameter schema type
 */
export type ReactiveQueryState<TSchema extends QueryParameterSchema> = {
  [K in keyof TSchema]: TSchema[K] extends QueryParameterOptions<infer T> ? T : never;
};

/**
 * Options for batch updates in queryReactive
 */
export type QueryBatchUpdateOptions = {
  /** History strategy for the batch update */
  historyStrategy?: 'replace' | 'push';
};

/**
 * Return type from queryReactive composable
 * @template TSchema The parameter schema type
 */
export type QueryReactiveReturn<TSchema extends QueryParameterSchema> = {
  /** Reactive state object with typed parameter values */
  queryState: ReactiveQueryState<TSchema>;
  /** Update multiple parameters in a single operation */
  updateBatch(
    updates: Partial<ReactiveQueryState<TSchema>>,
    options?: QueryBatchUpdateOptions
  ): void;
  /** Manually sync all current values to the URL */
  syncAllToUrl(): void;
};

/**
 * Options for queryReactive composable
 */
export type QueryReactiveOptions = {
  /** History strategy when updating the URL */
  historyStrategy?: 'replace' | 'push';
  /** Optional custom query adapter to use */
  queryAdapter?: QueryAdapter;
};

/**
 * Abstraction for reading and writing query parameters
 */
export type QueryAdapter = {
  /** Read current query parameters as a plain object */
  getCurrentQuery(): Record<string, string | undefined>;
  /** Update query parameters in the URL */
  updateQuery(
    queryUpdates: Record<string, string | undefined>,
    options?: { historyStrategy?: 'replace' | 'push' }
  ): void;
  /** Subscribe to external query changes (returns unsubscribe function) */
  onQueryChange?(callback: () => void): () => void;
};

/**
 * Runtime environment information
 */
export type RuntimeEnvironment = {
  /** Whether we're running in a browser environment */
  isBrowser: boolean;
  /** Window object if available */
  windowObject: Window | null;
};

/** Environment flags used by the default History API adapter. */
export type RuntimeEnv = {
  isClient: boolean;
  /** Safe access to window if on client */
  win: Window | null;
};
