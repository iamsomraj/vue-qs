import { describe, expect, it } from 'vitest';
import {
  createMultiParser,
  createParser,
  parseAsInteger,
  parseAsIsoDate,
  parseAsNativeArrayOf,
} from '@/server';
import { isParserBijective, testParseThenSerialize, testSerializeThenParse } from '@/testing';

describe('vue-qs/testing', () => {
  it('passes for bijective parsers', () => {
    expect(isParserBijective(parseAsInteger, '42', 42)).toBe(true);
    expect(isParserBijective(parseAsIsoDate, '2025-01-02', new Date('2025-01-02'))).toBe(true);
    expect(isParserBijective(parseAsNativeArrayOf(parseAsInteger), ['1', '2'], [1, 2])).toBe(true);
  });

  it('throws when the expected value or query does not match', () => {
    expect(() => isParserBijective(parseAsInteger, '42', 47)).toThrow(
      'parser.serialize does not match'
    );
    expect(() => isParserBijective(parseAsInteger, ['42'], 42)).toThrow('mismatched parser type');
  });

  it('testSerializeThenParse detects lossy parsers', () => {
    const lossy = createParser({
      parse: (value) => Number(value),
      serialize: (value: number) => value.toFixed(0),
    });
    expect(testSerializeThenParse(lossy, 2)).toBe(true);
    expect(() => testSerializeThenParse(lossy, 2.5)).toThrow('not bijective');
    expect(() => testSerializeThenParse(parseAsInteger, Number.NaN)).toThrow(
      'parsed value is null'
    );
  });

  it('testParseThenSerialize detects non-canonical queries', () => {
    expect(testParseThenSerialize(parseAsInteger, '42')).toBe(true);
    expect(() => testParseThenSerialize(parseAsInteger, '042')).toThrow('not bijective');
    expect(() => testParseThenSerialize(parseAsInteger, 'abc')).toThrow('parsed value is null');
    const multi = createMultiParser({
      parse: (values) => values.map(Number),
      serialize: (values: number[]) => values.map(String),
    });
    expect(testParseThenSerialize(multi, ['1', '2'])).toBe(true);
    expect(() => testParseThenSerialize(multi, ['01'])).toThrow('not bijective');
  });
});
