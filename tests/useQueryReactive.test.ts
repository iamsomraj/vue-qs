import { describe, it, expect } from 'vitest';
import { useQueryReactive } from '@/useQueryReactive';
import { serializers } from '@/index';

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

  it('supports codec field in schema for simpler DX', () => {
    const codec = serializers.arrayOf(serializers.string);
    const { state, sync } = useQueryReactive({
      tags: { default: [], codec },
    });
    expect(state.tags).toEqual([]);
    state.tags = ['x', 'y'];
    sync();
    expect(new URL(window.location.href).searchParams.get('tags')).toBe('x,y');
  });

  it('twoWay: reactive state updates on popstate', () => {
    const { state } = useQueryReactive(
      {
        q: {
          default: '',
          parse: serializers.string.parse,
          serialize: serializers.string.serialize,
        },
        p: { default: 0, parse: serializers.number.parse, serialize: serializers.number.serialize },
      },
      { history: 'push', twoWay: true }
    );

    expect(state.q).toBe('');
    expect(state.p).toBe(0);

    // change state which updates URL (push)
    state.q = 'first';
    state.p = 1;
    const u1 = new URL(window.location.href);
    expect(u1.searchParams.get('q')).toBe('first');
    expect(u1.searchParams.get('p')).toBe('1');

    // simulate navigating to a new URL and popstate back
    const u2 = new URL(window.location.href);
    u2.searchParams.set('q', 'second');
    u2.searchParams.set('p', '2');
    window.history.pushState({}, '', u2);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(state.q).toBe('second');
    expect(state.p).toBe(2);
  });

  it('twoWay: reactive state updates on manual pushState / replaceState (no popstate)', () => {
    // Ensure clean URL
    window.history.replaceState({}, '', '/');
    const { state } = useQueryReactive(
      {
        search: { default: '', parse: String },
        sort: { default: 'asc' as 'asc' | 'desc', parse: String },
      },
      { twoWay: true, history: 'push' }
    );

    expect(state.search).toBe('');
    expect(state.sort).toBe('asc');

    // Manual pushState
    window.history.pushState({}, '', '?search=foo&sort=desc');
    expect(state.search).toBe('foo');
    expect(state.sort).toBe('desc');

    // Manual replaceState with only one param changed
    window.history.replaceState({}, '', '?search=bar&sort=desc');
    expect(state.search).toBe('bar');
    expect(state.sort).toBe('desc');
  });

  it('equals comparator omits deep-equal defaults in schema', () => {
    const jsonCodec = serializers.json<{ a: number }>();
    const { state, sync } = useQueryReactive({
      obj: {
        default: { a: 1 },
        parse: jsonCodec.parse,
        serialize: jsonCodec.serialize,
        equals: (x, y) => x?.a === y?.a,
      },
    });
    // default, omitted
    sync();
    expect(new URL(window.location.href).searchParams.get('obj')).toBe(null);
    // deep equal, still omitted
    state.obj = { a: 1 } as any;
    sync();
    expect(new URL(window.location.href).searchParams.get('obj')).toBe(null);
    // different -> written
    state.obj = { a: 3 } as any;
    sync();
    expect(new URL(window.location.href).searchParams.get('obj')).toBe('{"a":3}');
  });
});
