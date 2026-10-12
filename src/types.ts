import type { AnyParserBuilder, inferParserType } from '@/parsers';

/** Makes every property of `T` also accept `null`. */
export type Nullable<T> = { [K in keyof T]: T[K] | null };

/** Maps state keys to the keys used in the URL. */
export type UrlKeys<Parsers extends Record<string, unknown>> = Partial<
  Record<keyof Parsers, string>
>;

/** An object of parsers, keyed by state key. */
export type ParserMap = Record<string, AnyParserBuilder>;

/** The state object described by an object of parsers. */
export type Values<Parsers extends ParserMap> = inferParserType<Parsers>;

/** A raw query value: one string, repeated values, or `null` when the key is absent. */
export type QueryValue = string | string[] | null;
