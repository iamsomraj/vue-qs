import type { Ref } from 'vue';

/**
 * Function that parses a raw query string value into a typed value
 * @template T The expected output type
 * @param rawValue The raw string value from the URL query parameter, or null if the parameter is missing
 * @returns The parsed typed value
 * @example
 * ```ts
 * const numberParser: QueryParser<number> = (rawValue) => {
 *   if (!rawValue) return 0;
 *   const parsed = Number(rawValue);
 *   return isNaN(parsed) ? 0 : parsed;
 * };
 * ```
 */
export type QueryParser<T> = (rawValue: string | null) => T;

/**
 * Function that serializes a typed value into a string for the URL query
 * @template T The input type to serialize
 * @param typedValue The typed value to serialize
 * @returns The serialized string value, or null if the value should be omitted from the URL
 * @example
 * ```ts
 * const numberSerializer: QuerySerializer<number> = (value) => {
 *   return value === 0 ? null : String(value);
 * };
 * ```
 */
export type QuerySerializer<T> = (typedValue: T) => string | null;

/**
 * A codec that combines both parse and serialize functions for a given type
 * @template T The type this codec handles
 * @example
 * ```ts
 * const numberCodec: QueryCodec<number> = {
 *   parse: (raw) => raw ? Number(raw) : 0,
 *   serialize: (value) => value === 0 ? null : String(value)
 * };
 * ```
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
 * @example
 * ```ts
 * const pageOptions: QueryParameterOptions<number> = {
 *   defaultValue: 1,
 *   codec: numberCodec,
 *   shouldOmitDefault: true,
 *   isEqual: (a, b) => a === b
 * };
 * ```
 */
export type QueryParameterOptions<T> = {
  /** Default value to use when parameter is missing or invalid */
  defaultValue?: T;
  /** Combined codec with both parse and serialize functions */
  codec?: QueryCodec<T>;
  /** Custom parser function (overrides codec.parse if provided) */
  parse?: QueryParser<T>;
  /** Custom serializer function (overrides codec.serialize if provided) */
  serializeFunction?: QuerySerializer<T>;
  /** Custom equality function to compare values (defaults to Object.is) */
  isEqual?: (valueA: T, valueB: T) => boolean;
  /** Whether to omit the parameter from URL when value equals default (default: true) */
  shouldOmitDefault?: boolean;
};

/**
 * Schema defining multiple query parameters with their configurations
 * @example
 * ```ts
 * const schema: QueryParameterSchema = {
 *   search: { defaultValue: '' },
 *   page: { defaultValue: 1, codec: numberCodec },
 *   filters: { defaultValue: {}, codec: jsonCodec }
 * };
 * ```
 */
export type QueryParameterSchema = Record<string, QueryParameterOptions<any>>;

/**
 * Options for queryRef composable
 * @template T The type of the query parameter value
 * @example
 * ```ts
 * const options: QueryRefOptions<number> = {
 *   defaultValue: 1,
 *   codec: numberCodec,
 *   historyStrategy: 'replace',
 *   shouldOmitDefault: true
 * };
 * ```
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
export type QueryRefReturn<T> = Ref<T>;

/**
 * Reactive state object for queryReactive
 * @template TSchema The parameter schema type
 * @example
 * ```ts
 * const schema = {
 *   search: { defaultValue: '' },
 *   page: { defaultValue: 1 }
 * } as const;
 *
 * type State = ReactiveQueryState<typeof schema>;
 * // State = { search: string; page: number }
 * ```
 */
export type ReactiveQueryState<TSchema extends QueryParameterSchema> = {
  [K in keyof TSchema]: TSchema[K] extends QueryParameterOptions<infer T> ? T : never;
};

/**
 * Return type from queryReactive composable
 * @template TSchema The parameter schema type
 */
export type QueryReactiveReturn<TSchema extends QueryParameterSchema> = ReactiveQueryState<TSchema>;

/**
 * Options for queryReactive composable
 * @example
 * ```ts
 * const options: QueryReactiveOptions = {
 *   historyStrategy: 'replace',
 *   queryAdapter: customAdapter
 * };
 * ```
 */
export type QueryReactiveOptions = {
  /** History strategy when updating the URL */
  historyStrategy?: 'replace' | 'push';
  /** Optional custom query adapter to use */
  queryAdapter?: QueryAdapter;
};

/**
 * Abstraction for reading and writing query parameters
 * This interface allows for different implementations (History API, Vue Router, etc.)
 * @example
 * ```ts
 * const adapter: QueryAdapter = {
 *   getCurrentQuery: () => ({ page: '1', search: 'test' }),
 *   updateQuery: (updates) => {
 *     // Update URL with new query parameters
 *   },
 *   isUpdating: () => false
 * };
 * ```
 */
export type QueryAdapter = {
  /** Read current query parameters as a plain object */
  getCurrentQuery(): Record<string, string | undefined>;
  /** Update query parameters in the URL */
  updateQuery(
    queryUpdates: Record<string, string | undefined>,
    options?: { historyStrategy?: 'replace' | 'push' }
  ): void;
  /** Check if currently updating to prevent infinite loops */
  isUpdating?(): boolean;
};

/**
 * Runtime environment information
 * Used to determine if we're running in a browser or server environment
 * @example
 * ```ts
 * const env: RuntimeEnvironment = {
 *   isBrowser: true,
 *   windowObject: window
 * };
 * ```
 */
export type RuntimeEnvironment = {
  /** Whether we're running in a browser environment */
  isBrowser: boolean;
  /** Window object if available */
  windowObject: Window | null;
};

/**
 * Environment flags used by the default History API adapter
 * @deprecated Use RuntimeEnvironment instead
 */
export type RuntimeEnv = {
  isClient: boolean;
  /** Safe access to window if on client */
  win: Window | null;
};
