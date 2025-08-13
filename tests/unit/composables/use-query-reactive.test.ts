import { describe, it, expect } from 'vitest';
import { useQueryReactive, serializers } from '@/index';

describe('useQueryReactive', () => {
  it('initializes from defaults and batches updates', () => {
    const { queryState, updateBatch } = useQueryReactive({
      search: { defaultValue: '', parseFunction: (value: string | null) => value || '' },
      sort: {
        defaultValue: 'asc' as 'asc' | 'desc',
        parseFunction: (value: string | null) => (value === 'desc' ? 'desc' : 'asc'),
      },
    });

    expect(queryState.search).toBe('');
    expect(queryState.sort).toBe('asc');

    updateBatch({ search: 'abc', sort: 'desc' }, { historyStrategy: 'replace' });

    const url = new URL(window.location.href);
    expect(url.searchParams.get('search')).toBe('abc');
    expect(url.searchParams.get('sort')).toBe('desc');
  });

  it('handles string, number, boolean, dateISO, json, array, enum in schema', () => {
    const jsonCodec = serializers.createJsonCodec<{ a: number }>();
    const arrCodec = serializers.createArrayCodec(serializers.numberCodec);
    const enumCodec = serializers.createEnumCodec(['asc', 'desc'] as const);

    const { queryState, updateBatch, syncAllToUrl } = useQueryReactive({
      s: {
        defaultValue: '',
        parseFunction: (value: string | null) => value || '',
        serializeFunction: (value: string) => value,
      },
      n: {
        defaultValue: 0,
        parseFunction: (value: string | null) => (value ? Number(value) : 0),
        serializeFunction: (value: number) => String(value),
      },
      b: {
        defaultValue: false,
        parseFunction: (value: string | null) => value === 'true' || value === '1',
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

    // batch update and check URL
    updateBatch(
      {
        s: 'hi',
        n: 7,
        b: true,
        d: new Date('2020-01-02T00:00:00.000Z'),
        j: { a: 2 },
        a: [3, 4],
        e: 'desc',
      },
      { historyStrategy: 'replace' }
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
    queryState.s = 'bye';
    queryState.n = 10;
    queryState.b = false;
    queryState.d = new Date('2020-01-03T00:00:00.000Z');
    queryState.j = { a: 5 } as any;
    queryState.a = [9];
    queryState.e = 'asc';
    syncAllToUrl();

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
    const { queryState, syncAllToUrl } = useQueryReactive({
      tags: { defaultValue: [], codec },
    });
    expect(queryState.tags).toEqual([]);
    queryState.tags = ['x', 'y'];
    syncAllToUrl();
    expect(new URL(window.location.href).searchParams.get('tags')).toBe('x,y');
  });

  it('twoWay: reactive state updates on popstate', () => {
    const { queryState } = useQueryReactive(
      {
        q: {
          defaultValue: '',
          parseFunction: (value: string | null) => value || '',
          serializeFunction: (value: string) => value,
        },
        p: {
          defaultValue: 0,
          parseFunction: (value: string | null) => (value ? Number(value) : 0),
          serializeFunction: (value: number) => String(value),
        },
      },
      { historyStrategy: 'push', enableTwoWaySync: true }
    );

    expect(queryState.q).toBe('');
    expect(queryState.p).toBe(0);

    // change state which updates URL (push)
    queryState.q = 'first';
    queryState.p = 1;
    const u1 = new URL(window.location.href);
    expect(u1.searchParams.get('q')).toBe('first');
    expect(u1.searchParams.get('p')).toBe('1');

    // simulate navigating to a new URL and popstate back
    const u2 = new URL(window.location.href);
    u2.searchParams.set('q', 'second');
    u2.searchParams.set('p', '2');
    window.history.pushState({}, '', u2);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(queryState.q).toBe('second');
    expect(queryState.p).toBe(2);
  });

  it('equals comparator omits deep-equal defaults in schema', () => {
    const jsonCodec = serializers.createJsonCodec<{ a: number }>();
    const { queryState, syncAllToUrl } = useQueryReactive({
      obj: {
        defaultValue: { a: 1 },
        codec: jsonCodec,
        isEqual: (x: any, y: any) => x?.a === y?.a,
      },
    });
    // default, omitted
    syncAllToUrl();
    expect(new URL(window.location.href).searchParams.get('obj')).toBe(null);
    // deep equal, still omitted
    queryState.obj = { a: 1 } as any;
    syncAllToUrl();
    expect(new URL(window.location.href).searchParams.get('obj')).toBe(null);
    // different -> written
    queryState.obj = { a: 3 } as any;
    syncAllToUrl();
    expect(new URL(window.location.href).searchParams.get('obj')).toBe('{"a":3}');
  });
});
