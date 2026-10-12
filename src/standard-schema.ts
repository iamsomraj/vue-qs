import { createLoader, type LoaderInput } from '@/loader';
import type { AnyParserBuilder, inferParserType } from '@/parsers';
import type { UrlKeys } from '@/types';

/**
 * The Standard Schema interface (https://standardschema.dev), implemented
 * by Zod, Valibot, ArkType and others.
 */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown
    ) => StandardSchemaV1Result<Output> | Promise<StandardSchemaV1Result<Output>>;
    readonly types?: { readonly input: Input; readonly output: Output } | undefined;
  };
}

/** Result of a Standard Schema validation. */
export type StandardSchemaV1Result<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | {
      readonly issues: ReadonlyArray<{
        readonly message: string;
        readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
      }>;
    };

/** Options for {@link createStandardSchemaV1}. */
export type CreateStandardSchemaV1Options<Parsers extends Record<string, AnyParserBuilder>> = {
  /** Map state keys to different URL keys */
  urlKeys?: UrlKeys<Parsers>;
  /** Only include keys present in the input */
  partialOutput?: boolean;
};

/**
 * Creates a Standard Schema validating search params with the given parsers.
 * Use it with libraries that accept Standard Schemas for search params.
 *
 * @example
 * ```ts
 * const schema = createStandardSchemaV1({ page: parseAsInteger.withDefault(1) })
 * schema['~standard'].validate({ page: '2' }) // { value: { page: 2 } }
 * ```
 */
export function createStandardSchemaV1<Parsers extends Record<string, AnyParserBuilder>>(
  parsers: Parsers,
  options: CreateStandardSchemaV1Options<Parsers> = {}
): StandardSchemaV1<Record<string, string | string[] | undefined>, inferParserType<Parsers>> {
  const { urlKeys, partialOutput = false } = options;
  const load = createLoader(parsers, { urlKeys });

  return {
    '~standard': {
      version: 1,
      vendor: 'vue-qs',
      validate(input) {
        try {
          const value = load(input as LoaderInput);
          if (partialOutput) {
            const record = (input ?? {}) as Record<string, unknown>;
            const partial = Object.fromEntries(
              Object.entries(value).filter(([key]) => record[urlKeys?.[key] ?? key] !== undefined)
            );
            return { value: partial as inferParserType<Parsers> };
          }
          return { value };
        } catch (error) {
          return { issues: [{ message: error instanceof Error ? error.message : String(error) }] };
        }
      },
    },
  };
}
