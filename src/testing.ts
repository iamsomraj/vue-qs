/**
 * vue-qs/testing - Helpers to unit-test parsers, matching `nuqs/testing`.
 *
 * @example
 * ```ts
 * import { isParserBijective } from 'vue-qs/testing'
 *
 * it('round-trips', () => {
 *   expect(isParserBijective(parseAsStarRating, '★★★', 3)).toBe(true)
 * })
 * ```
 *
 * @packageDocumentation
 */

import type { Parser, ParserType } from '@/parsers';

type AnyParser<T> = Parser<T, ParserType>;

function format(value: unknown): string {
  return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
}

function parseRaw<T>(parser: AnyParser<T>, query: string | readonly string[]): T | null {
  if (parser.type === 'multi' && Array.isArray(query)) {
    return (parser as Parser<T, 'multi'>).parse(query);
  }
  if (parser.type !== 'multi' && typeof query === 'string') {
    return (parser as Parser<T>).parse(query);
  }
  return null;
}

function isSameQuery(
  queryA: string | readonly string[],
  queryB: string | readonly string[]
): boolean {
  if (typeof queryA === 'string' || typeof queryB === 'string') {
    return queryA === queryB;
  }
  return queryA.length === queryB.length && queryA.every((value, index) => value === queryB[index]);
}

/**
 * Tests that serializing a value, then parsing the result, gives back the same value
 * (compared with the parser's `eq`).
 *
 * @returns `true` when the test passes
 * @throws When the value does not round-trip
 *
 * @example
 * ```ts
 * expect(testSerializeThenParse(parseAsInteger, 42)).toBe(true)
 * ```
 */
export function testSerializeThenParse<T>(parser: AnyParser<T>, input: T): boolean {
  const serialized = parser.serialize(input);
  const parsed = parseRaw(parser, serialized);
  if (parsed === null) {
    throw new Error(
      `[vue-qs] testSerializeThenParse: parsed value is null (when parsing ${format(serialized)} serialized from ${format(input)})`
    );
  }
  if (!parser.eq(input, parsed)) {
    throw new Error(
      `[vue-qs] parser is not bijective (in testSerializeThenParse)
  Expected value:         ${format(input)}
  Received parsed value:  ${format(parsed)}
  Serialized as: '${format(serialized)}'`
    );
  }
  return true;
}

/**
 * Tests that parsing a query value, then serializing the result, gives back the same query.
 * Pass a string for single parsers, and an array of strings for multi parsers.
 *
 * @returns `true` when the test passes
 * @throws When the query does not round-trip
 *
 * @example
 * ```ts
 * expect(testParseThenSerialize(parseAsHex, 'ff')).toBe(true)
 * ```
 */
export function testParseThenSerialize<T>(
  parser: AnyParser<T>,
  input: string | readonly string[]
): boolean {
  const parsed = parseRaw(parser, input);
  if (parsed === null) {
    throw new Error(
      `[vue-qs] testParseThenSerialize: parsed value is null (when parsing ${format(input)})`
    );
  }
  const serialized = parser.serialize(parsed);
  if (!isSameQuery(serialized, input)) {
    throw new Error(
      `[vue-qs] parser is not bijective (in testParseThenSerialize)
  Expected query: '${format(input)}'
  Received query: '${format(serialized)}'
  Parsed value: ${format(parsed)}`
    );
  }
  return true;
}

/**
 * Tests that a parser is bijective: `serialized` parses to `input`, and `input`
 * serializes to `serialized`, in both directions.
 *
 * @param parser The parser to test
 * @param serialized The expected query value (an array of strings for multi parsers)
 * @param input The expected state value
 * @returns `true` when the test passes
 * @throws When either direction fails
 *
 * @example
 * ```ts
 * expect(isParserBijective(parseAsInteger, '42', 42)).toBe(true)
 * expect(() => isParserBijective(parseAsInteger, '42', 47)).toThrow()
 * ```
 */
export function isParserBijective<T>(
  parser: AnyParser<T>,
  serialized: string | readonly string[],
  input: T
): boolean {
  if ((parser.type === 'multi') !== Array.isArray(serialized)) {
    throw new Error('[vue-qs] isParserBijective: mismatched parser type and serialized value type');
  }
  testSerializeThenParse(parser, input);
  testParseThenSerialize(parser, serialized);
  const actualSerialized = parser.serialize(input);
  if (!isSameQuery(actualSerialized, serialized)) {
    throw new Error(
      `[vue-qs] parser.serialize does not match expected serialized value
  Expected: '${format(serialized)}'
  Received: '${format(actualSerialized)}'`
    );
  }
  const parsed = parseRaw(parser, serialized);
  if (parsed === null || !parser.eq(parsed, input)) {
    throw new Error(
      `[vue-qs] parser.parse does not match expected input value
  Expected: ${format(input)}
  Received: ${format(parsed)}`
    );
  }
  return true;
}
