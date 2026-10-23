import { describe, expect, it } from 'vitest';
import {
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
} from '@/server';

describe('createSerializer', () => {
  const serialize = createSerializer({
    q: parseAsString,
    page: parseAsInteger.withDefault(1),
    tags: parseAsArrayOf(parseAsString),
  });

  it('renders values into a query string', () => {
    expect(serialize({ q: 'vue', page: 2 })).toBe('?q=vue&page=2');
  });

  it('returns an empty string with no values', () => {
    expect(serialize({})).toBe('');
  });

  it('clears default values by default', () => {
    expect(serialize({ q: 'vue', page: 1 })).toBe('?q=vue');
  });

  it('keeps default values with clearOnDefault: false', () => {
    const keep = createSerializer(
      { page: parseAsInteger.withDefault(1) },
      { clearOnDefault: false }
    );
    expect(keep({ page: 1 })).toBe('?page=1');
  });

  it('honours clearOnDefault set on a parser', () => {
    const keep = createSerializer({
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: false }),
    });
    expect(keep({ page: 1 })).toBe('?page=1');
  });

  it('keeps readable separators', () => {
    expect(serialize({ tags: ['a', 'b'] })).toBe('?tags=a,b');
  });

  it('merges into a base path and keeps the hash', () => {
    expect(serialize('/search?lang=en#top', { q: 'vue' })).toBe('/search?lang=en&q=vue#top');
  });

  it('merges into a URL object', () => {
    expect(serialize(new URL('https://example.com/a?x=1'), { page: 3 })).toBe(
      'https://example.com/a?x=1&page=3'
    );
  });

  it('merges into URLSearchParams', () => {
    expect(serialize(new URLSearchParams('x=1'), { q: 'a' })).toBe('?x=1&q=a');
  });

  it('removes keys set to null', () => {
    expect(serialize('/?q=vue&page=2', { q: null })).toBe('/?page=2');
  });

  it('clears every known key when values are null', () => {
    expect(serialize('/?q=vue&page=2&other=1', null)).toBe('/?other=1');
  });

  it('supports urlKeys', () => {
    const short = createSerializer(
      { latitude: parseAsInteger, active: parseAsBoolean },
      { urlKeys: { latitude: 'lat' } }
    );
    expect(short({ latitude: 4, active: true })).toBe('?lat=4&active=true');
  });

  it('renders native arrays as repeated keys', () => {
    const native = createSerializer({ id: parseAsNativeArrayOf(parseAsInteger) });
    expect(native({ id: [1, 2] })).toBe('?id=1&id=2');
    expect(native({ id: [] })).toBe('');
  });

  it('writes an explicit empty native array as an empty value', () => {
    const native = createSerializer({ id: parseAsNativeArrayOf(parseAsInteger).withDefault([42]) });
    expect(native({ id: [] })).toBe('?id=');
  });

  it('keeps credentials and hashes from the base', () => {
    const base = 'https://user:password@example.com/path?bar=egg';
    const expected = 'https://user:password@example.com/path?bar=egg&q=foo';
    expect(serialize(base, { q: 'foo' })).toBe(expected);
    expect(serialize(new URL(base), { q: 'foo' })).toBe(expected);
    expect(serialize('https://example.com/path#', { q: 'foo' })).toBe(
      'https://example.com/path?q=foo#'
    );
    expect(serialize(new URL('https://example.com/path?#'), { q: 'foo' })).toBe(
      'https://example.com/path?q=foo#'
    );
    expect(serialize(new URL('https://example.com/a#x#y'), { q: 'foo' })).toBe(
      'https://example.com/a?q=foo#x#y'
    );
  });

  it.each(['constructor', 'hasOwnProperty'])('ignores an omitted parser key named %s', (key) => {
    const withPrototypeKey = createSerializer({ a: parseAsString, [key]: parseAsString });
    expect(withPrototypeKey({ a: 'acme' })).toBe('?a=acme');
    expect(withPrototypeKey({ [key]: 'acme' })).toBe(`?${key}=acme`);
  });

  it('applies processUrlSearchParams', () => {
    const sorted = createSerializer(
      { z: parseAsInteger, a: parseAsInteger },
      {
        processUrlSearchParams: (search) => {
          search.sort();
          return search;
        },
      }
    );
    expect(sorted('?foo=bar', { z: 1, a: 1 })).toBe('?a=1&foo=bar&z=1');
    expect(sorted('?a=1&foo=bar', null)).toBe('?foo=bar');
  });

  it('encodes special characters', () => {
    expect(serialize({ q: 'a b&c#d' })).toBe('?q=a+b%26c%23d');
  });
});
