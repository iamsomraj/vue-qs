import { applyQuery, serializeQuery } from '@/lib/search-params';
import { renderQueryString } from '@/lib/url-encoding';
import type { Nullable, ParserMap, UrlKeys, Values } from '@/types';

/** Options for {@link createSerializer}. */
export type CreateSerializerOptions<Parsers extends ParserMap> = {
  /** Remove keys whose value equals their default (default: `true`) */
  clearOnDefault?: boolean;
  /** Map state keys to different URL keys */
  urlKeys?: UrlKeys<Parsers>;
};

/** Base to merge serialized values into: a URL, a path with a query string, or search params. */
export type SerializerBase = string | URL | URLSearchParams;

/** Function returned by {@link createSerializer}. */
export type Serializer<Parsers extends ParserMap> = {
  (values: Partial<Nullable<Values<Parsers>>>): string;
  (base: SerializerBase, values: Partial<Nullable<Values<Parsers>>> | null): string;
};

function splitBase(base: SerializerBase): [prefix: string, search: URLSearchParams, hash: string] {
  if (base instanceof URLSearchParams) {
    return ['', new URLSearchParams(base), ''];
  }
  if (base instanceof URL) {
    return [`${base.origin}${base.pathname}`, new URLSearchParams(base.search), base.hash];
  }
  const hashIndex = base.indexOf('#');
  const hash = hashIndex === -1 ? '' : base.slice(hashIndex);
  const withoutHash = hashIndex === -1 ? base : base.slice(0, hashIndex);
  const queryIndex = withoutHash.indexOf('?');
  if (queryIndex === -1) {
    return [withoutHash, new URLSearchParams(), hash];
  }
  return [
    withoutHash.slice(0, queryIndex),
    new URLSearchParams(withoutHash.slice(queryIndex + 1)),
    hash,
  ];
}

/**
 * Creates a type-safe function that renders state into a query string,
 * e.g. to build links.
 *
 * @example
 * ```ts
 * const serialize = createSerializer({ q: parseAsString, page: parseAsInteger.withDefault(1) })
 * serialize({ q: 'vue', page: 2 })             // '?q=vue&page=2'
 * serialize('/search?lang=en', { q: 'vue' })   // '/search?lang=en&q=vue'
 * serialize('/search?q=vue', null)            // '/search' (clears known keys)
 * ```
 */
export function createSerializer<Parsers extends ParserMap>(
  parsers: Parsers,
  options: CreateSerializerOptions<Parsers> = {}
): Serializer<Parsers> {
  const { clearOnDefault = true, urlKeys } = options;

  function serialize(
    baseOrValues: SerializerBase | Partial<Nullable<Values<Parsers>>>,
    maybeValues?: Partial<Nullable<Values<Parsers>>> | null
  ): string {
    const hasBase =
      typeof baseOrValues === 'string' ||
      baseOrValues instanceof URL ||
      baseOrValues instanceof URLSearchParams;
    const [prefix, search, hash] = hasBase
      ? splitBase(baseOrValues)
      : ['', new URLSearchParams(), ''];
    const values = (hasBase ? maybeValues : baseOrValues) as Record<string, unknown> | null;

    Object.entries(parsers).forEach(([key, parser]) => {
      const urlKey = urlKeys?.[key] ?? key;
      if (values === null) {
        search.delete(urlKey);
        return;
      }
      if (!(key in values) || values[key] === undefined) {
        return;
      }
      const query = serializeQuery(parser, values[key], parser.clearOnDefault ?? clearOnDefault);
      applyQuery(search, urlKey, query);
    });

    return `${prefix}${renderQueryString(search)}${hash}`;
  }

  return serialize;
}
