import type { QueryCodec } from './types';

// Primitive coders
export const string: QueryCodec<string> = {
  parse: (v) => v ?? '',
  serialize: (v) => (v == null ? null : String(v)),
};

export const number: QueryCodec<number> = {
  parse: (v) => (v == null || v === '' ? NaN : Number(v)),
  serialize: (v) => (Number.isFinite(v) ? String(v) : null),
};

export const boolean: QueryCodec<boolean> = {
  parse: (v) => v === 'true' || v === '1',
  serialize: (v) => (v ? 'true' : 'false'),
};

export const dateISO: QueryCodec<Date> = {
  parse: (v) => (v ? new Date(v) : new Date(NaN)),
  serialize: (v) => (v instanceof Date && !isNaN(+v) ? v.toISOString() : null),
};

// JSON based for objects
export const json = <T>(): QueryCodec<T> => ({
  parse: (v) => {
    if (v == null || v === '') return null as unknown as T;
    try {
      return JSON.parse(v) as T;
    } catch {
      return null as unknown as T;
    }
  },
  serialize: (v) => {
    if (v == null) return null;
    try {
      return JSON.stringify(v);
    } catch {
      return null;
    }
  },
});

// Arrays with a chosen element codec; join with comma by default
export const arrayOf = <T>(elem: QueryCodec<T>, sep = ','): QueryCodec<T[]> => ({
  parse: (v) => {
    if (v == null || v === '') return [] as T[];
    return v.split(sep).map((s) => elem.parse(s));
  },
  serialize: (arr) => {
    if (!arr || arr.length === 0) return null;
    const parts = arr.map((x) => elem.serialize(x)).filter((s): s is string => s != null);
    return parts.length ? parts.join(sep) : null;
  },
});

// Helpers for enums
export const enumOf = <T extends string>(values: readonly T[]): QueryCodec<T> => ({
  parse: (v) => (values.includes(v as T) ? (v as T) : values[0]),
  serialize: (v) => (values.includes(v) ? v : values[0]),
});

export type { QueryCodec };
