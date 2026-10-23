import { describe, expectTypeOf, it } from 'vitest';
import type { Ref } from 'vue';
import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  parseAsNativeArrayOf,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates,
  type GenericParserBuilder,
  type inferParserType,
  type LoaderFunction,
  type SingleParserBuilder,
} from '@/index';

describe('types', () => {
  it('useQueryState without parser is a nullable string', () => {
    const q = useQueryState('q');
    expectTypeOf(q).toExtend<Ref<string | null>>();
    expectTypeOf(q.value).toEqualTypeOf<string | null>();
  });

  it('useQueryState with defaultValue option is a string', () => {
    expectTypeOf(useQueryState('q', { defaultValue: '' }).value).toEqualTypeOf<string>();
  });

  it('withDefault removes null', () => {
    expectTypeOf(useQueryState('page', parseAsInteger).value).toEqualTypeOf<number | null>();
    expectTypeOf(
      useQueryState('page', parseAsInteger.withDefault(1)).value
    ).toEqualTypeOf<number>();
    expectTypeOf(
      useQueryState('page', parseAsInteger.withDefault(1).withOptions({ history: 'push' })).value
    ).toEqualTypeOf<number>();
  });

  it('set accepts values, null and updaters', () => {
    const page = useQueryState('page', parseAsInteger.withDefault(1));
    expectTypeOf(page.set)
      .parameter(0)
      .toEqualTypeOf<number | null | ((current: number) => number | null)>();
    expectTypeOf(page.set(1)).toEqualTypeOf<Promise<URLSearchParams>>();
  });

  it('infers literals, arrays and JSON', () => {
    expectTypeOf(
      useQueryState('sort', parseAsStringLiteral(['asc', 'desc'] as const)).value
    ).toEqualTypeOf<'asc' | 'desc' | null>();
    expectTypeOf(
      useQueryState('n', parseAsNumberLiteral([1, 2] as const).withDefault(1)).value
    ).toEqualTypeOf<1 | 2>();
    expectTypeOf(useQueryState('tags', parseAsArrayOf(parseAsString)).value).toEqualTypeOf<
      string[] | null
    >();
    expectTypeOf(useQueryState('ids', parseAsNativeArrayOf(parseAsInteger)).value).toEqualTypeOf<
      number[]
    >();
    expectTypeOf(
      useQueryState(
        'p',
        parseAsJson((v) => v as { x: number })
      ).value
    ).toEqualTypeOf<{ x: number } | null>();
  });

  it('useQueryStates infers an object and typed $set', () => {
    const state = useQueryStates(
      { page: parseAsInteger.withDefault(1), q: parseAsString, on: parseAsBoolean },
      { urlKeys: { page: 'p' } }
    );
    expectTypeOf(state.page).toEqualTypeOf<number>();
    expectTypeOf(state.q).toEqualTypeOf<string | null>();
    expectTypeOf(state.on).toEqualTypeOf<boolean | null>();
    expectTypeOf(state.$set)
      .parameter(0)
      .toExtend<
        { page?: number | null; q?: string | null } | null | ((current: never) => unknown)
      >();
  });

  it('inferParserType', () => {
    const _parsers = { page: parseAsInteger.withDefault(1), q: parseAsString };
    expectTypeOf<inferParserType<typeof _parsers>>().toEqualTypeOf<{
      page: number;
      q: string | null;
    }>();
    expectTypeOf<inferParserType<typeof parseAsBoolean>>().toEqualTypeOf<boolean | null>();
  });

  it('loader and serializer are typed', () => {
    const parsers = { page: parseAsInteger.withDefault(1), q: parseAsString };
    expectTypeOf(createLoader(parsers)('')).toEqualTypeOf<{ page: number; q: string | null }>();
    expectTypeOf(createLoader(parsers)(Promise.resolve(''))).toEqualTypeOf<
      Promise<{ page: number; q: string | null }>
    >();
    const serialize = createSerializer(parsers);
    expectTypeOf(serialize({ page: 2 })).toEqualTypeOf<string>();
    // @ts-expect-error unknown keys are rejected
    serialize({ unknown: 1 });
  });

  it('exposes nuqs type names', () => {
    expectTypeOf(parseAsInteger).toExtend<SingleParserBuilder<number>>();
    expectTypeOf(parseAsNativeArrayOf(parseAsInteger)).toExtend<GenericParserBuilder<number[]>>();
    const parsers = { page: parseAsInteger.withDefault(1) };
    expectTypeOf(createLoader(parsers)).toEqualTypeOf<LoaderFunction<typeof parsers>>();
  });
});
