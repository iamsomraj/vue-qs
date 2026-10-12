import { describe, expect, it } from 'vitest';
import {
  createMultiParser,
  createParser,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsHex,
  parseAsIndex,
  parseAsInteger,
  parseAsIsoDate,
  parseAsIsoDateTime,
  parseAsJson,
  parseAsNativeArrayOf,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringEnum,
  parseAsStringLiteral,
  parseAsTimestamp,
  type StandardSchemaV1,
} from '@/server';

describe('parsers', () => {
  it('parseAsString', () => {
    expect(parseAsString.parse('')).toBe('');
    expect(parseAsString.parse('foo')).toBe('foo');
    expect(parseAsString.serialize('foo')).toBe('foo');
  });

  it('parseAsInteger', () => {
    expect(parseAsInteger.parse('1')).toBe(1);
    expect(parseAsInteger.parse('3.14')).toBe(3);
    expect(parseAsInteger.parse('-7')).toBe(-7);
    expect(parseAsInteger.parse('')).toBeNull();
    expect(parseAsInteger.parse('abc')).toBeNull();
    expect(parseAsInteger.serialize(3.14)).toBe('3');
    expect(parseAsInteger.serialize(3.5)).toBe('4');
  });

  it('parseAsIndex', () => {
    expect(parseAsIndex.parse('1')).toBe(0);
    expect(parseAsIndex.parse('foo')).toBeNull();
    expect(parseAsIndex.serialize(0)).toBe('1');
  });

  it('parseAsHex', () => {
    expect(parseAsHex.parse('ff')).toBe(255);
    expect(parseAsHex.parse('zz')).toBeNull();
    expect(parseAsHex.serialize(15)).toBe('0f');
    expect(parseAsHex.serialize(255)).toBe('ff');
    expect(parseAsHex.serialize(256)).toBe('0100');
  });

  it('parseAsFloat', () => {
    expect(parseAsFloat.parse('3.14')).toBe(3.14);
    expect(parseAsFloat.parse('-1e3')).toBe(-1000);
    expect(parseAsFloat.parse('nope')).toBeNull();
    expect(parseAsFloat.serialize(3.14)).toBe('3.14');
  });

  it('parseAsBoolean', () => {
    expect(parseAsBoolean.parse('true')).toBe(true);
    expect(parseAsBoolean.parse('TRUE')).toBe(true);
    expect(parseAsBoolean.parse('false')).toBe(false);
    expect(parseAsBoolean.parse('1')).toBe(false);
    expect(parseAsBoolean.serialize(true)).toBe('true');
    expect(parseAsBoolean.serialize(false)).toBe('false');
  });

  it('parseAsTimestamp', () => {
    expect(parseAsTimestamp.parse('0')).toEqual(new Date(0));
    expect(parseAsTimestamp.parse('nope')).toBeNull();
    expect(parseAsTimestamp.serialize(new Date(1234))).toBe('1234');
    expect(parseAsTimestamp.eq(new Date(1), new Date(1))).toBe(true);
  });

  it('parseAsIsoDateTime', () => {
    const iso = '2025-01-02T03:04:05.000Z';
    expect(parseAsIsoDateTime.parse(iso)).toEqual(new Date(iso));
    expect(parseAsIsoDateTime.parse('nope')).toBeNull();
    expect(parseAsIsoDateTime.serialize(new Date(iso))).toBe(iso);
  });

  it('parseAsIsoDate', () => {
    expect(parseAsIsoDate.parse('2025-01-02')).toEqual(new Date('2025-01-02'));
    expect(parseAsIsoDate.parse('2025-01-02T12:00:00Z')).toEqual(new Date('2025-01-02'));
    expect(parseAsIsoDate.parse('nope')).toBeNull();
    expect(parseAsIsoDate.serialize(new Date('2025-01-02T23:00:00Z'))).toBe('2025-01-02');
  });

  it('parseAsStringEnum', () => {
    enum Direction {
      up = 'UP',
      down = 'DOWN',
    }
    const parser = parseAsStringEnum<Direction>(Object.values(Direction));
    expect(parser.parse('UP')).toBe(Direction.up);
    expect(parser.parse('up')).toBeNull();
    expect(parser.serialize(Direction.down)).toBe('DOWN');
  });

  it('parseAsStringLiteral', () => {
    const parser = parseAsStringLiteral(['asc', 'desc'] as const);
    expect(parser.parse('asc')).toBe('asc');
    expect(parser.parse('other')).toBeNull();
  });

  it('parseAsNumberLiteral', () => {
    const parser = parseAsNumberLiteral([1, 2, 3] as const);
    expect(parser.parse('2')).toBe(2);
    expect(parser.parse('4')).toBeNull();
    expect(parser.serialize(3)).toBe('3');
  });

  describe('parseAsJson', () => {
    type Point = { x: number; y: number };
    const isPoint = (value: unknown): Point | null =>
      typeof value === 'object' &&
      value !== null &&
      typeof (value as Point).x === 'number' &&
      typeof (value as Point).y === 'number'
        ? (value as Point)
        : null;

    it('parses and validates with a function', () => {
      const parser = parseAsJson(isPoint);
      expect(parser.parse('{"x":1,"y":2}')).toEqual({ x: 1, y: 2 });
      expect(parser.parse('{"x":1}')).toBeNull();
      expect(parser.parse('not json')).toBeNull();
      expect(parser.serialize({ x: 1, y: 2 })).toBe('{"x":1,"y":2}');
      expect(parser.eq({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
    });

    it('validates with a Standard Schema', () => {
      const schema: StandardSchemaV1<unknown, Point> = {
        '~standard': {
          version: 1,
          vendor: 'test',
          validate: (value) => {
            const point = isPoint(value);
            return point ? { value: point } : { issues: [{ message: 'not a point' }] };
          },
        },
      };
      const parser = parseAsJson(schema);
      expect(parser.parse('{"x":1,"y":2}')).toEqual({ x: 1, y: 2 });
      expect(parser.parse('{"x":"1","y":2}')).toBeNull();
    });
  });

  describe('parseAsArrayOf', () => {
    it('parses and serializes with the default separator', () => {
      const parser = parseAsArrayOf(parseAsInteger);
      expect(parser.parse('1,2,3')).toEqual([1, 2, 3]);
      expect(parser.parse('')).toEqual([]);
      expect(parser.parse('1,x,3')).toEqual([1, 3]);
      expect(parser.serialize([1, 2, 3])).toBe('1,2,3');
    });

    it('escapes the separator inside items', () => {
      const parser = parseAsArrayOf(parseAsString);
      const serialized = parser.serialize(['a,b', 'c']);
      expect(serialized).toBe('a%2Cb,c');
      expect(parser.parse(serialized)).toEqual(['a,b', 'c']);
    });

    it('supports a custom separator', () => {
      const parser = parseAsArrayOf(parseAsString, ';');
      expect(parser.parse('a;b')).toEqual(['a', 'b']);
      expect(parser.serialize(['a', 'b'])).toBe('a;b');
    });

    it('compares arrays item by item', () => {
      const parser = parseAsArrayOf(parseAsInteger);
      expect(parser.eq([1, 2], [1, 2])).toBe(true);
      expect(parser.eq([1, 2], [2, 1])).toBe(false);
    });
  });

  it('parseAsNativeArrayOf', () => {
    const parser = parseAsNativeArrayOf(parseAsInteger);
    expect(parser.type).toBe('multi');
    expect(parser.defaultValue).toEqual([]);
    expect(parser.parse(['1', '2', 'x'])).toEqual([1, 2]);
    expect(parser.serialize([1, 2])).toEqual(['1', '2']);
  });

  describe('builder', () => {
    it('withDefault exposes the default and applies it server-side', () => {
      const parser = parseAsInteger.withDefault(1);
      expect(parser.defaultValue).toBe(1);
      expect(parser.parseServerSide(undefined)).toBe(1);
      expect(parser.parseServerSide('nope')).toBe(1);
      expect(parser.parseServerSide('5')).toBe(5);
      expect(parser.parseServerSide(['7', '8'])).toBe(7);
    });

    it('parseServerSide returns null without a default', () => {
      expect(parseAsInteger.parseServerSide(undefined)).toBeNull();
      expect(parseAsInteger.parseServerSide('3')).toBe(3);
    });

    it('withOptions keeps the default value and stacks options', () => {
      const parser = parseAsInteger
        .withDefault(1)
        .withOptions({ history: 'push' })
        .withOptions({ scroll: true });
      expect(parser.defaultValue).toBe(1);
      expect(parser.history).toBe('push');
      expect(parser.scroll).toBe(true);
    });

    it('does not mutate the original parser', () => {
      parseAsInteger.withOptions({ history: 'push' });
      expect(parseAsInteger.history).toBeUndefined();
    });

    it('createParser catches parse errors and uses custom eq', () => {
      const parser = createParser({
        parse: (value: string) => {
          if (value === 'throw') {
            throw new Error('boom');
          }
          return value.toUpperCase();
        },
        serialize: (value: string) => value.toLowerCase(),
        eq: (a, b) => a.toLowerCase() === b.toLowerCase(),
      });
      expect(parser.parse('abc')).toBe('ABC');
      expect(parser.parse('throw')).toBeNull();
      expect(parser.eq('A', 'a')).toBe(true);
    });

    it('createMultiParser parses repeated values server-side', () => {
      const parser = createMultiParser({
        parse: (values) => values.join('+'),
        serialize: (value: string) => value.split('+'),
      });
      expect(parser.parseServerSide(['a', 'b'])).toBe('a+b');
      expect(parser.parseServerSide('a')).toBe('a');
      expect(parser.parseServerSide(undefined)).toBeNull();
    });
  });
});
