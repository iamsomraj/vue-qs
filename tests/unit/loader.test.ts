import { describe, expect, it } from 'vitest';
import {
  createLoader,
  createStandardSchemaV1,
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
} from '@/server';

describe('createLoader', () => {
  const load = createLoader({
    q: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    sort: parseAsString,
  });

  it('applies defaults for missing keys', () => {
    expect(load('')).toEqual({ q: '', page: 1, sort: null });
  });

  it('loads from a query string', () => {
    expect(load('?q=vue&page=2')).toEqual({ q: 'vue', page: 2, sort: null });
    expect(load('q=vue&page=2')).toEqual({ q: 'vue', page: 2, sort: null });
  });

  it('loads from a URL string, a URL, and a path', () => {
    expect(load('https://example.com/a?page=3#x').page).toBe(3);
    expect(load(new URL('https://example.com/?page=4')).page).toBe(4);
    expect(load('/search?page=5').page).toBe(5);
    expect(load('/search').page).toBe(1);
  });

  it('loads from URLSearchParams and Request', () => {
    expect(load(new URLSearchParams('page=6')).page).toBe(6);
    expect(load(new Request('https://example.com/?page=7')).page).toBe(7);
  });

  it('loads from a record (route.query / getQuery)', () => {
    expect(load({ q: 'a', page: ['8', '9'], sort: null })).toEqual({ q: 'a', page: 8, sort: '' });
  });

  it('loads from a promise', async () => {
    await expect(load(Promise.resolve('?page=10'))).resolves.toMatchObject({ page: 10 });
  });

  it('falls back to defaults for invalid values', () => {
    expect(load('?page=abc').page).toBe(1);
  });

  it('throws on invalid values in strict mode', () => {
    expect(() => load('?page=abc', { strict: true })).toThrow(/page/);
  });

  it('supports urlKeys and native arrays', () => {
    const loadIds = createLoader(
      { ids: parseAsNativeArrayOf(parseAsInteger) },
      { urlKeys: { ids: 'id' } }
    );
    expect(loadIds('?id=1&id=2')).toEqual({ ids: [1, 2] });
    expect(loadIds('')).toEqual({ ids: [] });
  });
});

describe('createStandardSchemaV1', () => {
  it('validates records into typed values', () => {
    const schema = createStandardSchemaV1({
      page: parseAsInteger.withDefault(1),
      q: parseAsString,
    });
    expect(schema['~standard'].validate({ page: '2' })).toEqual({ value: { page: 2, q: null } });
  });

  it('can return partial output', () => {
    const schema = createStandardSchemaV1(
      { page: parseAsInteger.withDefault(1), q: parseAsString },
      { partialOutput: true }
    );
    expect(schema['~standard'].validate({ q: 'x' })).toEqual({ value: { q: 'x' } });
  });
});
