import type { AnyParserBuilder, ParserType } from '@/parsers';
import type { QueryValue } from '@/types';

/**
 * Reads the raw value of a key: `string[]` for multi parsers, `string` otherwise,
 * `null` when the key is absent.
 * @internal
 */
export function readQuery(search: URLSearchParams, key: string, type: ParserType): QueryValue {
  if (type === 'multi') {
    const values = search.getAll(key);
    return values.length > 0 ? values : null;
  }
  return search.get(key);
}

/**
 * Writes a raw value into search params, removing the key when `query` is `null`.
 * @internal
 */
export function applyQuery(search: URLSearchParams, key: string, query: QueryValue): void {
  if (query === null) {
    search.delete(key);
  } else if (Array.isArray(query)) {
    search.delete(key);
    query.forEach((value) => search.append(key, value));
  } else {
    // `set` keeps the key at its current position
    search.set(key, query);
  }
}

/**
 * Parses a raw value with a parser, without applying its default value.
 * @internal
 */
export function parseQuery(parser: AnyParserBuilder, query: QueryValue): unknown {
  if (query === null) {
    return null;
  }
  if (parser.type === 'multi') {
    return parser.parse(Array.isArray(query) ? query : [query]);
  }
  return parser.parse(Array.isArray(query) ? (query[0] ?? '') : query);
}

/**
 * Serializes a state value, returning `null` when the key should be removed from the URL.
 * @internal
 */
export function serializeQuery(
  parser: AnyParserBuilder,
  value: unknown,
  clearOnDefault: boolean
): QueryValue {
  if (value === null || value === undefined) {
    return null;
  }
  const defaultValue = 'defaultValue' in parser ? parser.defaultValue : undefined;
  if (clearOnDefault && defaultValue !== undefined && parser.eq(value, defaultValue)) {
    return null;
  }
  return parser.serialize(value);
}

/** A record of raw query values, as found in Vue Router or Nitro/H3 (`getQuery(event)`). */
export type QueryRecord = Record<string, string | ReadonlyArray<string | null> | null | undefined>;

/**
 * Converts a record of raw query values into search params.
 * @internal
 */
export function recordToSearchParams(record: QueryRecord): URLSearchParams {
  const search = new URLSearchParams();
  Object.entries(record).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    const values = typeof value === 'string' || value === null ? [value] : value;
    values.forEach((item) => search.append(key, item ?? ''));
  });
  return search;
}
