import { parseQuery, readQuery, recordToSearchParams, type QueryRecord } from '@/lib/search-params';
import type { ParserMap, UrlKeys, Values } from '@/types';

/**
 * Anything search params can be read from: a URL (string or object),
 * a query string, `URLSearchParams`, a `Request`, or a record
 * such as Vue Router's `route.query` or H3's `getQuery(event)`.
 */
export type LoaderInput = string | URL | URLSearchParams | Request | QueryRecord;

/** Options for {@link createLoader}. */
export type CreateLoaderOptions<Parsers extends ParserMap> = {
  /** Map state keys to different URL keys */
  urlKeys?: UrlKeys<Parsers>;
};

/** Options for a loader call. */
export type LoaderOptions = {
  /** Throw instead of falling back to the default value when a value is invalid */
  strict?: boolean;
};

/** Function returned by {@link createLoader}. */
export type Loader<Parsers extends ParserMap> = {
  (input: LoaderInput, options?: LoaderOptions): Values<Parsers>;
  (input: Promise<LoaderInput>, options?: LoaderOptions): Promise<Values<Parsers>>;
};

function toSearchParams(input: LoaderInput): URLSearchParams {
  if (input instanceof URLSearchParams) {
    return input;
  }
  if (input instanceof URL) {
    return input.searchParams;
  }
  if (typeof Request !== 'undefined' && input instanceof Request) {
    return new URL(input.url).searchParams;
  }
  if (typeof input === 'string') {
    const withoutHash = input.split('#')[0] ?? '';
    const queryIndex = withoutHash.indexOf('?');
    if (queryIndex !== -1) {
      return new URLSearchParams(withoutHash.slice(queryIndex + 1));
    }
    // A bare query string (`a=1&b=2`) or a path without a query
    return withoutHash.includes('=') ? new URLSearchParams(withoutHash) : new URLSearchParams();
  }
  return recordToSearchParams(input as QueryRecord);
}

/**
 * Creates a function that parses search params into typed state,
 * outside of components: in Nuxt server routes, route middleware,
 * `useAsyncData`, or any server code.
 *
 * @example
 * ```ts
 * const loadSearchParams = createLoader({
 *   q: parseAsString.withDefault(''),
 *   page: parseAsInteger.withDefault(1),
 * })
 *
 * // Nuxt server route
 * export default defineEventHandler((event) => {
 *   const { q, page } = loadSearchParams(getQuery(event))
 * })
 * ```
 */
export function createLoader<Parsers extends ParserMap>(
  parsers: Parsers,
  options: CreateLoaderOptions<Parsers> = {}
): Loader<Parsers> {
  const { urlKeys } = options;

  function loadSync(input: LoaderInput, loaderOptions: LoaderOptions = {}): Values<Parsers> {
    const search = toSearchParams(input);
    const result: Record<string, unknown> = {};

    Object.entries(parsers).forEach(([key, parser]) => {
      const urlKey = urlKeys?.[key] ?? key;
      const query = readQuery(search, urlKey, parser.type);
      const parsed = parseQuery(parser, query);
      if (parsed === null && query !== null && loaderOptions.strict === true) {
        throw new Error(`[vue-qs] Invalid value for key "${urlKey}": ${JSON.stringify(query)}`);
      }
      const defaultValue = 'defaultValue' in parser ? parser.defaultValue : null;
      result[key] = parsed ?? defaultValue;
    });

    return result as Values<Parsers>;
  }

  function load(
    input: LoaderInput | Promise<LoaderInput>,
    loaderOptions?: LoaderOptions
  ): Values<Parsers> | Promise<Values<Parsers>> {
    if (input instanceof Promise) {
      return input.then((resolved) => loadSync(resolved, loaderOptions));
    }
    return loadSync(input, loaderOptions);
  }

  return load as Loader<Parsers>;
}
