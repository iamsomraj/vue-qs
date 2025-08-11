import { describe, it, expect } from 'vitest';
import { useQueryRef } from '@/useQueryRef';
import { serializers } from '@/index';

describe('useQueryRef', () => {
  it('reads default when missing and writes when sync called', () => {
    const page = useQueryRef<number>('page', { default: 1, parse: Number, omitIfDefault: false });
    expect(page.value).toBe(1);
    page.sync();
    expect(new URL(window.location.href).searchParams.get('page')).toBe('1');
  });

  it('updates URL on change', () => {
    const page = useQueryRef<number>('page2', { default: 1, parse: Number });
    page.value = 5;
    expect(new URL(window.location.href).searchParams.get('page2')).toBe('5');
  });

  it('supports string, number, boolean, dateISO, json, array, enum codecs', () => {
    // string
    const str = useQueryRef<string>('str1', {
      default: '',
      parse: serializers.string.parse,
      serialize: serializers.string.serialize,
    });
    expect(str.value).toBe('');
    str.value = 'hello';
    expect(new URL(window.location.href).searchParams.get('str1')).toBe('hello');

    // number
    const num = useQueryRef<number>('num1', {
      default: 0,
      parse: serializers.number.parse,
      serialize: serializers.number.serialize,
    });
    expect(num.value).toBe(0);
    num.value = 42;
    expect(new URL(window.location.href).searchParams.get('num1')).toBe('42');

    // boolean
    const bool = useQueryRef<boolean>('bool1', {
      default: false,
      parse: serializers.boolean.parse,
      serialize: serializers.boolean.serialize,
    });
    expect(bool.value).toBe(false);
    bool.value = true;
    expect(new URL(window.location.href).searchParams.get('bool1')).toBe('true');

    // dateISO
    const date = useQueryRef<Date>('date1', {
      default: new Date('2020-01-01T00:00:00.000Z'),
      parse: serializers.dateISO.parse,
      serialize: serializers.dateISO.serialize,
    });
    expect(date.value.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    date.value = new Date('2020-01-02T00:00:00.000Z');
    expect(new URL(window.location.href).searchParams.get('date1')).toBe(
      '2020-01-02T00:00:00.000Z'
    );

    // json
    const jsonCodec = serializers.json<{ a: number }>();
    const json = useQueryRef<{ a: number }>('json1', {
      default: { a: 0 },
      parse: jsonCodec.parse,
      serialize: jsonCodec.serialize,
    });
    expect(json.value).toEqual({ a: 0 });
    json.value = { a: 2 };
    expect(new URL(window.location.href).searchParams.get('json1')).toBe('{"a":2}');

    // array
    const arrCodec = serializers.arrayOf(serializers.number);
    const arr = useQueryRef<number[]>('arr1', {
      default: [],
      parse: arrCodec.parse,
      serialize: arrCodec.serialize,
    });
    expect(arr.value).toEqual([]);
    arr.value = [1, 2];
    expect(new URL(window.location.href).searchParams.get('arr1')).toBe('1,2');

    // enum
    const enumCodec = serializers.enumOf(['asc', 'desc'] as const);
    const en = useQueryRef<'asc' | 'desc'>('enum1', {
      default: 'asc',
      parse: enumCodec.parse,
      serialize: enumCodec.serialize,
    });
    expect(en.value).toBe('asc');
    en.value = 'desc';
    expect(new URL(window.location.href).searchParams.get('enum1')).toBe('desc');
  });

  it('twoWay: ref updates on popstate', () => {
    const page = useQueryRef<number>('twPage', {
      default: 1,
      parse: Number,
      serialize: (n) => String(n),
      history: 'push',
      twoWay: true,
    });
    expect(page.value).toBe(1);
    // push a new value
    page.value = 2;
    const url1 = new URL(window.location.href);
    expect(url1.searchParams.get('twPage')).toBe('2');

    // simulate user going back by changing URL and dispatching popstate
    const url2 = new URL(window.location.href);
    url2.searchParams.set('twPage', '5');
    window.history.pushState({}, '', url2);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(page.value).toBe(5);
  });
});
