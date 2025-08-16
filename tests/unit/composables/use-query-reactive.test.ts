import { describe, it, expect } from 'vitest';
import { queryReactive, serializers } from '@/index';

describe('queryReactive', () => {
  it('initializes from defaults and updates URL automatically', () => {
    const queryState = queryReactive({
      search: { defaultValue: '', parse: (value: string | null) => value || '' },
      sort: {
        defaultValue: 'asc' as 'asc' | 'desc',
        parse: (value: string | null) => (value === 'desc' ? 'desc' : 'asc'),
      },
    });

    expect(queryState.search).toBe('');
    expect(queryState.sort).toBe('asc');

    queryState.search = 'abc';
    queryState.sort = 'desc';

    const url = new URL(window.location.href);
    expect(url.searchParams.get('search')).toBe('abc');
    expect(url.searchParams.get('sort')).toBe('desc');
  });

  it('handles string, number, boolean, dateISO, json, array, enum in schema', () => {
    const jsonCodec = serializers.createJsonCodec<{ a: number }>();
    const arrCodec = serializers.createArrayCodec(serializers.numberCodec);
    const enumCodec = serializers.createEnumCodec(['asc', 'desc'] as const);

    const queryState = queryReactive({
      s: {
        defaultValue: '',
        parse: (value: string | null) => value || '',
        serializeFunction: (value: string) => value,
      },
      n: {
        defaultValue: 0,
        parse: (value: string | null) => (value ? Number(value) : 0),
        serializeFunction: (value: number) => String(value),
      },
      b: {
        defaultValue: false,
        parse: (value: string | null) => value === 'true' || value === '1',
        serializeFunction: (value: boolean) => String(value),
      },
      d: {
        defaultValue: new Date('2020-01-01T00:00:00.000Z'),
        codec: serializers.dateISOCodec,
      },
      j: { defaultValue: { a: 0 }, codec: jsonCodec },
      a: { defaultValue: [] as number[], codec: arrCodec },
      e: {
        defaultValue: 'asc' as 'asc' | 'desc',
        codec: enumCodec,
      },
    });

    // defaults applied
    expect(queryState.s).toBe('');
    expect(queryState.n).toBe(0);
    expect(queryState.b).toBe(false);
    expect(queryState.d.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    expect(queryState.j).toEqual({ a: 0 });
    expect(queryState.a).toEqual([]);
    expect(queryState.e).toBe('asc');

    // update values and check URL
    queryState.s = 'hi';
    queryState.n = 7;
    queryState.b = true;
    queryState.d = new Date('2020-01-02T00:00:00.000Z');
    queryState.j = { a: 2 };
    queryState.a = [3, 4];
    queryState.e = 'desc';

    const url = new URL(window.location.href);
    expect(url.searchParams.get('s')).toBe('hi');
    expect(url.searchParams.get('n')).toBe('7');
    expect(url.searchParams.get('b')).toBe('true');
    expect(url.searchParams.get('d')).toBe('2020-01-02T00:00:00.000Z');
    expect(url.searchParams.get('j')).toBe('{"a":2}');
    expect(url.searchParams.get('a')).toBe('3,4');
    expect(url.searchParams.get('e')).toBe('desc');

    // mutate to test default omission
    queryState.s = 'bye';
    queryState.n = 10;
    queryState.b = false; // default, should be omitted
    queryState.d = new Date('2020-01-03T00:00:00.000Z');
    queryState.j = { a: 5 };
    queryState.a = [9];
    queryState.e = 'asc'; // default, should be omitted

    const url2 = new URL(window.location.href);
    expect(url2.searchParams.get('s')).toBe('bye');
    expect(url2.searchParams.get('n')).toBe('10');
    // defaults are omitted when shouldOmitDefault=true (default)
    expect(url2.searchParams.get('b')).toBe(null);
    expect(url2.searchParams.get('d')).toBe('2020-01-03T00:00:00.000Z');
    expect(url2.searchParams.get('j')).toBe('{"a":5}');
    expect(url2.searchParams.get('a')).toBe('9');
    expect(url2.searchParams.get('e')).toBe(null);
  });

  it('supports codec field in schema for simpler DX', () => {
    const codec = serializers.createArrayCodec(serializers.stringCodec);
    const queryState = queryReactive({
      tags: { defaultValue: [], codec },
    });
    expect(queryState.tags).toEqual([]);
    queryState.tags = ['x', 'y'];
    expect(new URL(window.location.href).searchParams.get('tags')).toBe('x,y');
  });

  it('equals comparator omits deep-equal defaults in schema', () => {
    const jsonCodec = serializers.createJsonCodec<{ a: number }>();
    const queryState = queryReactive({
      obj: {
        defaultValue: { a: 1 },
        codec: jsonCodec,
        isEqual: (x: any, y: any) => x?.a === y?.a,
      },
    });
    // default, omitted
    expect(new URL(window.location.href).searchParams.get('obj')).toBe(null);
    // deep equal, still omitted
    queryState.obj = { a: 1 };
    expect(new URL(window.location.href).searchParams.get('obj')).toBe(null);
    // different -> written
    queryState.obj = { a: 3 };
    expect(new URL(window.location.href).searchParams.get('obj')).toBe('{"a":3}');
  });
});
