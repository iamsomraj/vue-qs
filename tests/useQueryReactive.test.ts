import { describe, it, expect } from 'vitest';
import { useQueryReactive } from '../src/useQueryReactive';
import { serializers } from '../src';

describe('useQueryReactive', () => {
  it('initializes from defaults and batches updates', () => {
    const { state, batch } = useQueryReactive({
      search: { default: '', parse: String },
      sort: { default: 'asc' as 'asc' | 'desc', parse: String },
    });

    expect(state.search).toBe('');
    expect(state.sort).toBe('asc');

    batch({ search: 'abc', sort: 'desc' }, { history: 'replace' });

    const url = new URL(window.location.href);
    expect(url.searchParams.get('search')).toBe('abc');
    expect(url.searchParams.get('sort')).toBe('desc');
  });

  it('handles string, number, boolean, dateISO, json, array, enum in schema', () => {
    const jsonCodec = serializers.json<{ a: number }>();
    const arrCodec = serializers.arrayOf(serializers.number);
    const enumCodec = serializers.enumOf(['asc', 'desc'] as const);

    const { state, batch, sync } = useQueryReactive({
      s: { default: '', parse: serializers.string.parse, serialize: serializers.string.serialize },
      n: { default: 0, parse: serializers.number.parse, serialize: serializers.number.serialize },
      b: {
        default: false,
        parse: serializers.boolean.parse,
        serialize: serializers.boolean.serialize,
      },
      d: {
        default: new Date('2020-01-01T00:00:00.000Z'),
        parse: serializers.dateISO.parse,
        serialize: serializers.dateISO.serialize,
      },
      j: { default: { a: 0 }, parse: jsonCodec.parse, serialize: jsonCodec.serialize },
      a: { default: [] as number[], parse: arrCodec.parse, serialize: arrCodec.serialize },
      e: {
        default: 'asc' as 'asc' | 'desc',
        parse: enumCodec.parse,
        serialize: enumCodec.serialize,
      },
    });

    // defaults applied
    expect(state.s).toBe('');
    expect(state.n).toBe(0);
    expect(state.b).toBe(false);
    expect(state.d.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    expect(state.j).toEqual({ a: 0 });
    expect(state.a).toEqual([]);
    expect(state.e).toBe('asc');

    // batch update and check URL
    batch(
      {
        s: 'hi',
        n: 7,
        b: true,
        d: new Date('2020-01-02T00:00:00.000Z'),
        j: { a: 2 },
        a: [3, 4],
        e: 'desc',
      },
      { history: 'replace' }
    );

    const url = new URL(window.location.href);
    expect(url.searchParams.get('s')).toBe('hi');
    expect(url.searchParams.get('n')).toBe('7');
    expect(url.searchParams.get('b')).toBe('true');
    expect(url.searchParams.get('d')).toBe('2020-01-02T00:00:00.000Z');
    expect(url.searchParams.get('j')).toBe('{"a":2}');
    expect(url.searchParams.get('a')).toBe('3,4');
    expect(url.searchParams.get('e')).toBe('desc');

    // mutate and sync all
    state.s = 'bye';
    state.n = 10;
    state.b = false;
    state.d = new Date('2020-01-03T00:00:00.000Z');
    state.j = { a: 5 } as any;
    state.a = [9];
    state.e = 'asc';
    sync();

    const url2 = new URL(window.location.href);
    expect(url2.searchParams.get('s')).toBe('bye');
    expect(url2.searchParams.get('n')).toBe('10');
    // defaults are omitted when omitIfDefault=true (default)
    expect(url2.searchParams.get('b')).toBe(null);
    expect(url2.searchParams.get('d')).toBe('2020-01-03T00:00:00.000Z');
    expect(url2.searchParams.get('j')).toBe('{"a":5}');
    expect(url2.searchParams.get('a')).toBe('9');
    expect(url2.searchParams.get('e')).toBe(null);
  });
});
