import { describe, it, expect } from 'vitest';
import { queryRef, serializers } from '@/index';

describe('queryRef', () => {
  it('reads default when missing and writes when sync called', () => {
    const page = queryRef<number>('page', {
      defaultValue: 1,
      parseFunction: (value) => (value ? Number(value) : 1),
      shouldOmitDefault: false,
    });
    expect(page.value).toBe(1);
    page.syncToUrl();
    expect(new URL(window.location.href).searchParams.get('page')).toBe('1');
  });

  it('updates URL on change', () => {
    const page = queryRef<number>('page2', {
      defaultValue: 1,
      parseFunction: (value) => (value ? Number(value) : 1),
    });
    page.value = 5;
    expect(new URL(window.location.href).searchParams.get('page2')).toBe('5');
  });

  it('supports string, number, boolean, dateISO, json, array, enum codecs', () => {
    // string
    const str = queryRef<string>('str1', {
      defaultValue: '',
      codec: serializers.stringCodec,
    });
    expect(str.value).toBe('');
    str.value = 'hello';
    expect(new URL(window.location.href).searchParams.get('str1')).toBe('hello');

    // number
    const num = queryRef<number>('num1', {
      defaultValue: 0,
      codec: serializers.numberCodec,
    });
    expect(num.value).toBe(0);
    num.value = 42;
    expect(new URL(window.location.href).searchParams.get('num1')).toBe('42');

    // boolean
    const bool = queryRef<boolean>('bool1', {
      defaultValue: false,
      codec: serializers.booleanCodec,
    });
    expect(bool.value).toBe(false);
    bool.value = true;
    expect(new URL(window.location.href).searchParams.get('bool1')).toBe('true');

    // dateISO
    const date = queryRef<Date>('date1', {
      defaultValue: new Date('2020-01-01T00:00:00.000Z'),
      codec: serializers.dateISOCodec,
    });
    expect(date.value).toEqual(new Date('2020-01-01T00:00:00.000Z'));
    date.value = new Date('2021-01-01T00:00:00.000Z');
    expect(new URL(window.location.href).searchParams.get('date1')).toBe(
      new Date('2021-01-01T00:00:00.000Z').toISOString()
    );

    // json
    const json = queryRef<{ a: number } | null>('json1', {
      defaultValue: { a: 0 },
      codec: serializers.createJsonCodec<{ a: number }>(),
    });
    expect(json.value).toEqual({ a: 0 });
    json.value = { a: 1 };
    expect(new URL(window.location.href).searchParams.get('json1')).toBe('{"a":1}');

    // array
    const arr = queryRef<number[]>('arr1', {
      defaultValue: [],
      codec: serializers.createArrayCodec(serializers.numberCodec),
    });
    expect(arr.value).toEqual([]);
    arr.value = [1, 2, 3];
    expect(new URL(window.location.href).searchParams.get('arr1')).toBe('1,2,3');

    // enum
    const enm = queryRef<'asc' | 'desc'>('sort1', {
      defaultValue: 'asc',
      codec: serializers.createEnumCodec(['asc', 'desc'] as const),
    });
    expect(enm.value).toBe('asc');
    enm.value = 'desc';
    expect(new URL(window.location.href).searchParams.get('sort1')).toBe('desc');
  });

  it('supports codec usage', () => {
    const codec = serializers.createArrayCodec(serializers.numberCodec);
    const arr = queryRef<number[]>('codecArr', { defaultValue: [], codec });
    arr.value = [1, 2, 3];
    expect(new URL(window.location.href).searchParams.get('codecArr')).toBe('1,2,3');
  });

  it('supports custom parse/serialize functions', () => {
    const num = queryRef<number>('customParse', {
      defaultValue: 1,
      parseFunction: (value) => (value ? parseInt(value, 10) : 0),
      serializeFunction: (n: number) => String(n),
    });
    expect(num.value).toBe(1);
    num.value = 5;
    expect(new URL(window.location.href).searchParams.get('customParse')).toBe('5');
  });

  it('respects equality function', () => {
    const item = queryRef<{ a: number } | null>('equality', {
      codec: serializers.createJsonCodec<{ a: number }>(),
      isEqual: (a, b) => a?.a === b?.a,
    });
    item.value = { a: 1 };
    expect(new URL(window.location.href).searchParams.get('equality')).toBe('{"a":1}');
  });

  it('omits default values from URL when shouldOmitDefault is true', () => {
    const str = queryRef<string>('omitDefault', {
      defaultValue: 'a',
      parseFunction: (value) => value || 'a',
      serializeFunction: (v: string) => v,
      shouldOmitDefault: true,
    });
    str.value = 'a'; // default value
    expect(new URL(window.location.href).searchParams.has('omitDefault')).toBe(false);
    str.value = 'b';
    expect(new URL(window.location.href).searchParams.get('omitDefault')).toBe('b');
  });

  it('includes default values in URL when shouldOmitDefault is false', () => {
    // Clear URL first
    window.history.replaceState({}, '', window.location.pathname);

    const _str = queryRef<string>('includeDefault', {
      defaultValue: 'a',
      parseFunction: (value) => value || 'a',
      serializeFunction: (v: string) => v,
      shouldOmitDefault: false,
    });
    expect(new URL(window.location.href).searchParams.get('includeDefault')).toBe('a');
  });

  it('provides manual sync functionality', () => {
    const item = queryRef<{ a: number } | null>('manualSync', {
      defaultValue: { a: 1 },
      codec: serializers.createJsonCodec<{ a: number }>(),
    });
    // Set value without automatic sync
    item.value = { a: 2 };
    expect(new URL(window.location.href).searchParams.get('manualSync')).toBe('{"a":2}');
    item.syncToUrl();
    expect(new URL(window.location.href).searchParams.get('manualSync')).toBe('{"a":2}');
  });
});
