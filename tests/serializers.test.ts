import { describe, it, expect } from 'vitest';
import { serializers } from '@/index';

describe('serializers', () => {
  it('string', () => {
    expect(serializers.string.parse(null)).toBe('');
    expect(serializers.string.serialize('a')).toBe('a');
  });
  it('number', () => {
    expect(serializers.number.parse('42')).toBe(42);
    expect(serializers.number.serialize(42)).toBe('42');
  });
  it('boolean', () => {
    expect(serializers.boolean.parse('true')).toBe(true);
    expect(serializers.boolean.parse('1')).toBe(true);
    expect(serializers.boolean.parse('false')).toBe(false);
    expect(serializers.boolean.serialize(true)).toBe('true');
  });
  it('dateISO', () => {
    const d = new Date('2020-01-01T00:00:00.000Z');
    expect(serializers.dateISO.serialize(d)).toBe('2020-01-01T00:00:00.000Z');
    expect(serializers.dateISO.parse('2020-01-01T00:00:00.000Z').toISOString()).toBe(
      '2020-01-01T00:00:00.000Z'
    );
  });
  it('json', () => {
    const c = serializers.json<{ a: number }>();
    expect(c.serialize({ a: 1 })).toBe('{"a":1}');
    expect(c.parse('{"a":1}')).toEqual({ a: 1 });
  });
  it('arrayOf', () => {
    const a = serializers.arrayOf(serializers.number);
    expect(a.serialize([1, 2, 3])).toBe('1,2,3');
    expect(a.parse('1,2,3')).toEqual([1, 2, 3]);
  });
  it('enumOf', () => {
    const e = serializers.enumOf(['asc', 'desc'] as const);
    expect(e.parse('asc')).toBe('asc');
    expect(e.serialize('desc')).toBe('desc');
  });
});
