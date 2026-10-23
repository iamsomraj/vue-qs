import { debug } from '@/lib/debug';
import type { Options } from '@/options';
import type { StandardSchemaV1 } from '@/standard-schema';

/**
 * `single` parsers read one value per key (`?tag=a`),
 * `multi` parsers read every value of a repeated key (`?tag=a&tag=b`).
 */
export type ParserType = 'single' | 'multi';

/** Raw input of a parser: one string, or every value of a repeated key. */
export type ParserInput<K extends ParserType> = K extends 'multi' ? readonly string[] : string;
/** Serialized output of a parser. */
export type ParserOutput<K extends ParserType> = K extends 'multi' ? string[] : string;

/**
 * Converts between URL query values and typed state.
 * @template T The state type
 * @template K Whether the parser reads a single value or repeated keys
 */
export type Parser<T, K extends ParserType = 'single'> = {
  readonly type: K;
  /** Converts a query value into state, returning `null` for invalid input */
  parse(value: ParserInput<K>): T | null;
  /** Converts state into a query value */
  serialize(value: T): ParserOutput<K>;
  /** Compares two state values (used for `clearOnDefault` and change detection) */
  eq(valueA: T, valueB: T): boolean;
};

/**
 * A parser with chainable builder methods.
 * Created by {@link createParser} or one of the built-in `parseAs*` parsers.
 */
export type ParserBuilder<T, K extends ParserType = 'single'> = Parser<T, K> &
  Options & {
    /** Returns a copy of the parser with the given URL update options */
    withOptions<This>(this: This, options: Options): This;
    /** Returns a copy of the parser that falls back to `defaultValue` when the key is missing or invalid */
    withDefault(
      this: ParserBuilder<T, K>,
      defaultValue: NonNullable<T>
    ): ParserBuilderWithDefault<T, K>;
    /** Parses a raw value outside of Vue, e.g. on the server */
    parseServerSide(value: string | readonly string[] | null | undefined): T | null;
  };

/** A {@link ParserBuilder} with a default value. */
export type ParserBuilderWithDefault<T, K extends ParserType = 'single'> = Omit<
  ParserBuilder<T, K>,
  'parseServerSide'
> & {
  readonly defaultValue: NonNullable<T>;
  /** Parses a raw value outside of Vue, falling back to the default value */
  parseServerSide(value: string | readonly string[] | null | undefined): NonNullable<T>;
};

/** Any parser builder, with or without a default value. */
export type AnyParserBuilder = ParserBuilder<any, ParserType> | ParserBuilderWithDefault<any, any>;

// Type names used by nuqs, to ease porting code

/** A parser reading one value per key. Same as `Parser<T>`, named as in nuqs. */
export type SingleParser<T> = Parser<T>;
/** A parser reading repeated keys. Same as `Parser<T, 'multi'>`, named as in nuqs. */
export type MultiParser<T> = Parser<T, 'multi'>;
/** A single or multi parser, named as in nuqs. */
export type GenericParser<T> = SingleParser<T> | MultiParser<T>;
/** Same as `ParserBuilder<T>`, named as in nuqs. */
export type SingleParserBuilder<T> = ParserBuilder<T>;
/** Same as `ParserBuilder<T, 'multi'>`, named as in nuqs. */
export type MultiParserBuilder<T> = ParserBuilder<T, 'multi'>;
/** A single or multi parser builder, named as in nuqs. */
export type GenericParserBuilder<T> = SingleParserBuilder<T> | MultiParserBuilder<T>;
/** A parser builder that may have a default value, named as in nuqs. */
export type ParserWithOptionalDefault<T> = GenericParserBuilder<T> & { readonly defaultValue?: T };

/**
 * Infers the state type of a parser, or of an object of parsers.
 *
 * @example
 * ```ts
 * const parsers = { page: parseAsInteger.withDefault(1), q: parseAsString }
 * type State = inferParserType<typeof parsers> // { page: number; q: string | null }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type inferParserType<Input> = Input extends {
  readonly defaultValue: infer D;
  readonly type: ParserType;
}
  ? D
  : Input extends { readonly type: ParserType; parse(value: never): infer R }
    ? R
    : Input extends Record<string, unknown>
      ? { [K in keyof Input]: inferParserType<Input[K]> }
      : never;

/** Functions passed to {@link createParser} / {@link createMultiParser}. */
export type ParserDefinition<T, K extends ParserType> = {
  parse: (value: ParserInput<K>) => T | null;
  serialize: (value: T) => ParserOutput<K>;
  eq?: (valueA: T, valueB: T) => boolean;
};

function safeParse<T, K extends ParserType>(
  parse: (value: ParserInput<K>) => T | null,
  value: ParserInput<K>
): T | null {
  try {
    return parse(value);
  } catch (error) {
    debug('Failed to parse value %o', value, error);
    return null;
  }
}

function buildParser<T, K extends ParserType>(
  type: K,
  definition: ParserDefinition<T, K>
): ParserBuilder<T, K> {
  function parseServerSide(value: string | readonly string[] | null | undefined): T | null {
    if (type === 'multi') {
      const values = typeof value === 'string' ? [value] : (value ?? []);
      if (values.length === 0) {
        return null;
      }
      return safeParse(definition.parse, values as ParserInput<K>);
    }
    const single = typeof value === 'string' ? value : value?.[0];
    if (single === undefined) {
      return null;
    }
    return safeParse(definition.parse, single as ParserInput<K>);
  }

  return {
    type,
    eq: definition.eq ?? Object.is,
    parse: (value: ParserInput<K>) => safeParse(definition.parse, value),
    serialize: definition.serialize,
    parseServerSide,
    withOptions<This>(this: This, options: Options): This {
      return { ...this, ...options };
    },
    withDefault(this: ParserBuilder<T, K>, defaultValue: NonNullable<T>) {
      return {
        ...this,
        defaultValue,
        parseServerSide(value: string | readonly string[] | null | undefined): NonNullable<T> {
          return parseServerSide(value) ?? defaultValue;
        },
      };
    },
  };
}

/**
 * Creates a custom parser for a single query value.
 *
 * @example
 * ```ts
 * const parseAsStarRating = createParser({
 *   parse: (value) => (value.match(/★/g)?.length ?? null),
 *   serialize: (value) => '★'.repeat(value),
 * })
 * ```
 */
export function createParser<T>(definition: ParserDefinition<T, 'single'>): ParserBuilder<T> {
  return buildParser('single', definition);
}

/**
 * Creates a custom parser reading every value of a repeated key (`?id=1&id=2`).
 */
export function createMultiParser<T>(
  definition: ParserDefinition<T, 'multi'>
): ParserBuilder<T, 'multi'> {
  return buildParser('multi', definition);
}

function compareDates(valueA: Date, valueB: Date): boolean {
  return valueA.valueOf() === valueB.valueOf();
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.valueOf());
}

/**
 * Checks the `YYYY-MM-DD` part of an ISO string is a real calendar date:
 * `new Date('2021-02-29')` silently rolls over to March 1st.
 */
function isCalendarDate(value: string): boolean {
  const day = value.slice(0, 10);
  const date = new Date(day);
  return isValidDate(date) && date.toISOString().slice(0, 10) === day;
}

/** Plain string, no transformation. */
export const parseAsString: ParserBuilder<string> = createParser({
  parse: (value) => value,
  serialize: (value) => String(value),
});

/** Integer, serialized in base 10. Non-integer values are rounded when serialized. */
export const parseAsInteger: ParserBuilder<number> = createParser({
  parse: (value) => {
    const int = Number.parseInt(value, 10);
    return Number.isNaN(int) ? null : int;
  },
  serialize: (value) => Math.round(value).toFixed(),
});

/** Zero-based index, shown one-based in the URL (`?page=1` → `0`). */
export const parseAsIndex: ParserBuilder<number> = createParser({
  parse: (value) => {
    const int = Number.parseInt(value, 10);
    return Number.isNaN(int) ? null : int - 1;
  },
  serialize: (value) => Math.round(value + 1).toFixed(),
});

/** Integer, serialized in hexadecimal with an even number of digits. */
export const parseAsHex: ParserBuilder<number> = createParser({
  parse: (value) => {
    const int = Number.parseInt(value, 16);
    return Number.isNaN(int) ? null : int;
  },
  serialize: (value) => {
    const hex = Math.round(value).toString(16);
    // Negative values start with `-` and are not padded
    return hex.startsWith('-') || hex.length % 2 === 0 ? hex : `0${hex}`;
  },
});

/** Floating point number. */
export const parseAsFloat: ParserBuilder<number> = createParser({
  parse: (value) => {
    const float = Number.parseFloat(value);
    return Number.isNaN(float) ? null : float;
  },
  serialize: (value) => value.toString(),
});

/** Boolean, serialized as `true` / `false`. */
export const parseAsBoolean: ParserBuilder<boolean> = createParser({
  parse: (value) => value.toLowerCase() === 'true',
  serialize: (value) => (value ? 'true' : 'false'),
});

/** Date, serialized as a Unix timestamp in milliseconds. */
export const parseAsTimestamp: ParserBuilder<Date> = createParser({
  parse: (value) => {
    const date = new Date(Number.parseInt(value, 10));
    // Also rejects timestamps outside the range of `Date`
    return isValidDate(date) ? date : null;
  },
  serialize: (value) => value.valueOf().toString(),
  eq: compareDates,
});

/** Date and time, serialized as an ISO-8601 string. */
export const parseAsIsoDateTime: ParserBuilder<Date> = createParser({
  parse: (value) => {
    const date = new Date(value);
    return isValidDate(date) && isCalendarDate(value) ? date : null;
  },
  serialize: (value) => value.toISOString(),
  eq: compareDates,
});

/** Date (UTC midnight), serialized as `YYYY-MM-DD`. */
export const parseAsIsoDate: ParserBuilder<Date> = createParser({
  parse: (value) => {
    return isCalendarDate(value) ? new Date(value.slice(0, 10)) : null;
  },
  serialize: (value) => value.toISOString().slice(0, 10),
  eq: compareDates,
});

/**
 * String enum. Values outside the enum are treated as invalid.
 *
 * @example
 * ```ts
 * enum Direction { up = 'UP', down = 'DOWN' }
 * const direction = useQueryState('dir', parseAsStringEnum<Direction>(Object.values(Direction)))
 * ```
 */
export function parseAsStringEnum<Enum extends string>(
  validValues: readonly Enum[]
): ParserBuilder<Enum> {
  return createParser({
    parse: (value) => (validValues.includes(value as Enum) ? (value as Enum) : null),
    serialize: (value) => String(value),
  });
}

/**
 * String literal union. Values outside the list are treated as invalid.
 *
 * @example
 * ```ts
 * const sort = useQueryState('sort', parseAsStringLiteral(['asc', 'desc'] as const).withDefault('asc'))
 * ```
 */
export function parseAsStringLiteral<const Literal extends string>(
  validValues: readonly Literal[]
): ParserBuilder<Literal> {
  return createParser({
    parse: (value) => (validValues.includes(value as Literal) ? (value as Literal) : null),
    serialize: (value) => String(value),
  });
}

/**
 * Number literal union. Values outside the list are treated as invalid.
 *
 * @example
 * ```ts
 * const dice = useQueryState('dice', parseAsNumberLiteral([1, 2, 3, 4, 5, 6] as const))
 * ```
 */
export function parseAsNumberLiteral<const Literal extends number>(
  validValues: readonly Literal[]
): ParserBuilder<Literal> {
  return createParser({
    parse: (value) => {
      const number = Number.parseFloat(value);
      return validValues.includes(number as Literal) ? (number as Literal) : null;
    },
    serialize: (value) => String(value),
  });
}

/**
 * Validates a parsed JSON value: either a function returning the value
 * (or `null` / throwing when invalid), or a Standard Schema (Zod, Valibot, ArkType…).
 */
export type JsonValidator<T> = ((value: unknown) => T | null) | StandardSchemaV1<unknown, T>;

function runValidator<T>(validator: JsonValidator<T>, value: unknown): T | null {
  // Checked first: some schemas are also callable (ArkType types are functions)
  if ('~standard' in validator) {
    const result = validator['~standard'].validate(value);
    if (result instanceof Promise) {
      throw new TypeError('[vue-qs] parseAsJson only supports synchronous schemas');
    }
    return result.issues ? null : result.value;
  }
  return validator(value);
}

/**
 * JSON-encoded object, validated at runtime.
 *
 * @param validator A validation function or a Standard Schema
 *
 * @example
 * ```ts
 * import { z } from 'zod'
 * const schema = z.object({ lat: z.number(), lng: z.number() })
 * const coords = useQueryState('coords', parseAsJson(schema))
 * ```
 */
export function parseAsJson<T>(validator: JsonValidator<T>): ParserBuilder<T> {
  return createParser({
    parse: (value) => runValidator(validator, JSON.parse(value)),
    serialize: (value) => JSON.stringify(value),
    eq: (valueA, valueB) => valueA === valueB || JSON.stringify(valueA) === JSON.stringify(valueB),
  });
}

/**
 * Parser for the items of an array. `serialize` defaults to `String`
 * and `eq` to strict equality.
 */
export type ItemParser<T> = Pick<Parser<T>, 'parse'> & Partial<Pick<Parser<T>, 'serialize' | 'eq'>>;

function createArrayEq<T>(
  itemEq: (a: T, b: T) => boolean = Object.is
): (a: T[], b: T[]) => boolean {
  return (valueA, valueB) =>
    valueA === valueB ||
    (valueA.length === valueB.length && valueA.every((item, index) => itemEq(item, valueB[index])));
}

function parseItems<T>(itemParser: ItemParser<T>, values: readonly string[]): T[] {
  return values
    .map((value) => safeParse<T, 'single'>(itemParser.parse, value))
    .filter((item): item is T => item !== null && item !== undefined);
}

function serializeItem<T>(itemParser: ItemParser<T>, item: T): string {
  return itemParser.serialize ? itemParser.serialize(item) : String(item);
}

/**
 * Array of items in a single key, joined with a separator (`?tags=vue,nuxt`).
 * Separators inside items are percent-encoded.
 *
 * @param itemParser Parser for each item
 * @param separator Item separator (default: `,`)
 */
export function parseAsArrayOf<T>(itemParser: ItemParser<T>, separator = ','): ParserBuilder<T[]> {
  const encodedSeparator = encodeURIComponent(separator);
  return createParser({
    parse: (value) => {
      if (value === '') {
        return [];
      }
      return parseItems(
        itemParser,
        value.split(separator).map((item) => item.split(encodedSeparator).join(separator))
      );
    },
    serialize: (values) =>
      values
        .map((item) => serializeItem(itemParser, item).split(separator).join(encodedSeparator))
        .join(separator),
    eq: createArrayEq(itemParser.eq),
  });
}

/**
 * Array of items stored as repeated keys (`?tag=vue&tag=nuxt`).
 * Defaults to an empty array. When no item is valid, the state falls back to the default.
 * An empty array is written as a single empty value (`?tag=`).
 *
 * @param itemParser Parser for each item
 */
export function parseAsNativeArrayOf<T>(
  itemParser: ItemParser<T>
): ParserBuilderWithDefault<T[], 'multi'> {
  return createMultiParser<T[]>({
    parse: (values) => {
      const items = parseItems(itemParser, values);
      if (items.length > 0) {
        return items;
      }
      // A single empty value is an explicit empty array
      return values.length === 1 && values[0] === '' ? [] : null;
    },
    serialize: (values) => values.map((item) => serializeItem(itemParser, item)),
    eq: createArrayEq(itemParser.eq),
  }).withDefault([] as NonNullable<T[]>);
}
