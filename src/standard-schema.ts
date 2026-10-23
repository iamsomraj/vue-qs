import { createLoader } from '@/loader';
import type { AnyParserBuilder, inferParserType } from '@/parsers';
import { createSerializer } from '@/serializer';
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
export type CreateStandardSchemaV1Options<
  Parsers extends Record<string, AnyParserBuilder>,
  PartialOutput extends boolean = false,
> = {
  /** Map state keys to different URL keys */
  urlKeys?: UrlKeys<Parsers>;
  /** Only include keys present in the input */
  partialOutput?: PartialOutput;
};

/** Output of {@link createStandardSchemaV1}: `Partial<T>` with `partialOutput: true`. */
export type MaybePartial<PartialOutput extends boolean, T> = PartialOutput extends true
  ? Partial<T>
  : T;

/**
 * Creates a Standard Schema validating search params state with the given parsers.
 * Use it with libraries that accept Standard Schemas for search params.
 *
 * Values are serialized with the parsers, then parsed back in strict mode:
 * a value the parsers can't represent is reported as an issue.
 *
 * @example
 * ```ts
 * const schema = createStandardSchemaV1({ page: parseAsInteger.withDefault(1) })
 * schema['~standard'].validate({ page: 2 }) // { value: { page: 2 } }
 * schema['~standard'].validate({}) // { value: { page: 1 } }
 * ```
 */
export function createStandardSchemaV1<
  Parsers extends Record<string, AnyParserBuilder>,
  PartialOutput extends boolean = false,
>(
  parsers: Parsers,
  options: CreateStandardSchemaV1Options<Parsers, PartialOutput> = {}
): StandardSchemaV1<MaybePartial<PartialOutput, inferParserType<Parsers>>> {
  const { urlKeys, partialOutput = false } = options;
  const serialize = createSerializer(parsers, { urlKeys });
  const load = createLoader(parsers, { urlKeys });

  return {
    '~standard': {
      version: 1,
      vendor: 'vue-qs',
      validate(input) {
        try {
          const record = (input ?? {}) as Record<string, unknown>;
          const value: Record<string, unknown> = load(serialize(record as never), {
            strict: true,
          });
          if (partialOutput) {
            Object.keys(value).forEach((key) => {
              if (!Object.prototype.hasOwnProperty.call(record, key)) {
                delete value[key];
              }
            });
          }
          return { value: value as MaybePartial<PartialOutput, inferParserType<Parsers>> };
        } catch (error) {
          return { issues: [{ message: error instanceof Error ? error.message : String(error) }] };
        }
      },
    },
  };
}
