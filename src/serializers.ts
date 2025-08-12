import type { QueryCodec } from '@/types';

// Basic string codec: empty => ''
export const string: QueryCodec<string> = {
  parse: (value) => value ?? '',
  serialize: (value) => (value == null ? null : String(value)),
};

// Number codec: missing -> NaN (caller can decide how to handle)
export const number: QueryCodec<number> = {
  parse: (value) => (value == null || value === '' ? NaN : Number(value)),
  serialize: (value) => (Number.isFinite(value) ? String(value) : null),
};

// Boolean codec: treat 'true' or '1' as true; everything else false
export const boolean: QueryCodec<boolean> = {
  parse: (value) => value === 'true' || value === '1',
  serialize: (value) => (value ? 'true' : 'false'),
};

// Date codec using ISO strings (toISOString / parse using new Date())
export const dateISO: QueryCodec<Date> = {
  parse: (value) => (value ? new Date(value) : new Date(NaN)),
  serialize: (value) => (value instanceof Date && !isNaN(+value) ? value.toISOString() : null),
};

// JSON codec for objects/arrays (returns null if parse/serialize fails)
export const json = <T>(): QueryCodec<T> => ({
  parse: (value) => {
    if (value == null || value === '') return null as unknown as T;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null as unknown as T;
    }
  },
  serialize: (value) => {
    if (value == null) return null;
    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  },
});

// Arrays: combine elements using a separator (default: comma)
export const arrayOf = <T>(element: QueryCodec<T>, separator = ','): QueryCodec<T[]> => ({
  parse: (value) => {
    if (value == null || value === '') return [] as T[];
    return value.split(separator).map((piece) => element.parse(piece));
  },
  serialize: (arr) => {
    if (!arr || arr.length === 0) return null;
    const parts = arr.map((item) => element.serialize(item)).filter((s): s is string => s != null);
    return parts.length ? parts.join(separator) : null;
  },
});

// Enums: only allow specific strings (fall back to first value)
export const enumOf = <T extends string>(values: readonly T[]): QueryCodec<T> => ({
  parse: (value) => (values.includes(value as T) ? (value as T) : values[0]),
  serialize: (value) => (values.includes(value) ? value : values[0]),
});

export type { QueryCodec };
