import { describe, it, expect } from 'vitest';
import { serializers } from '@/index';

describe('serializers', () => {
  it('stringCodec', () => {
    expect(serializers.stringCodec.parse(null)).toBe('');
    expect(serializers.stringCodec.serialize('a')).toBe('a');
  });
  it('numberCodec', () => {
    expect(serializers.numberCodec.parse('42')).toBe(42);
    expect(serializers.numberCodec.serialize(42)).toBe('42');
  });
  it('booleanCodec', () => {
    expect(serializers.booleanCodec.parse('true')).toBe(true);
    expect(serializers.booleanCodec.parse('1')).toBe(true);
    expect(serializers.booleanCodec.parse('false')).toBe(false);
    expect(serializers.booleanCodec.serialize(true)).toBe('true');
  });
  it('dateISOCodec', () => {
    const d = new Date('2020-01-01T00:00:00.000Z');
    expect(serializers.dateISOCodec.serialize(d)).toBe('2020-01-01T00:00:00.000Z');
    expect(serializers.dateISOCodec.parse('2020-01-01T00:00:00.000Z').toISOString()).toBe(
      '2020-01-01T00:00:00.000Z'
    );
  });
  it('jsonCodec', () => {
    const c = serializers.createJsonCodec<{ a: number }>();
    expect(c.serialize({ a: 1 })).toBe('{"a":1}');
    expect(c.parse('{"a":1}')).toEqual({ a: 1 });
  });
  it('arrayCodec', () => {
    const a = serializers.createArrayCodec(serializers.numberCodec);
    expect(a.serialize([1, 2, 3])).toBe('1,2,3');
    expect(a.parse('1,2,3')).toEqual([1, 2, 3]);
  });
  it('enumCodec', () => {
    const e = serializers.createEnumCodec(['asc', 'desc'] as const);
    expect(e.parse('asc')).toBe('asc');
    expect(e.serialize('desc')).toBe('desc');
  });
});
