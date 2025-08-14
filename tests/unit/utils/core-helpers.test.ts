import { describe, it, expect, vi } from 'vitest';
import {
  isBrowserEnvironment,
  createRuntimeEnvironment,
  parseSearchString,
  buildSearchString,
  areValuesEqual,
  mergeObjects,
  removeUndefinedValues,
} from '@/utils/core-helpers';

describe('core-helpers utilities', () => {
  describe('isBrowserEnvironment', () => {
    it('should return true in browser environment', () => {
      const result = isBrowserEnvironment();
      expect(result).toBe(true);
    });

    it('should return false when window is undefined', () => {
      const originalWindow = global.window;

      // @ts-expect-error - Testing edge case
      delete global.window;

      const result = isBrowserEnvironment();
      expect(result).toBe(false);

      // Restore
      global.window = originalWindow;
    });

    it('should return false when document is undefined', () => {
      const originalDocument = global.document;

      // @ts-expect-error - Testing edge case
      delete global.document;

      const result = isBrowserEnvironment();
      expect(result).toBe(false);

      // Restore
      global.document = originalDocument;
    });

    it('should handle exceptions gracefully', () => {
      // Mock window access to throw
      const originalWindow = global.window;
      Object.defineProperty(global, 'window', {
        get: () => {
          throw new Error('Window access error');
        },
        configurable: true,
      });

      const result = isBrowserEnvironment();
      expect(result).toBe(false);

      // Restore
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        configurable: true,
        writable: true,
      });
    });
  });

  describe('createRuntimeEnvironment', () => {
    it('should create browser environment when in browser', () => {
      const env = createRuntimeEnvironment();

      expect(env.isBrowser).toBe(true);
      expect(env.windowObject).toBe(window);
    });

    it('should create server environment when not in browser', () => {
      // Temporarily mock browser environment detection
      const originalWindow = global.window;
      const originalDocument = global.document;

      // @ts-expect-error - Testing server environment
      delete global.window;
      // @ts-expect-error - Testing server environment
      delete global.document;

      const env = createRuntimeEnvironment();

      expect(env.isBrowser).toBe(false);
      expect(env.windowObject).toBe(null);

      // Restore
      global.window = originalWindow;
      global.document = originalDocument;
    });
  });

  describe('parseSearchString', () => {
    it('should parse search string with leading question mark', () => {
      const result = parseSearchString('?foo=bar&baz=qux');
      expect(result).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should parse search string without leading question mark', () => {
      const result = parseSearchString('foo=bar&baz=qux');
      expect(result).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should parse empty search string', () => {
      const result = parseSearchString('');
      expect(result).toEqual({});
    });

    it('should parse search string with only question mark', () => {
      const result = parseSearchString('?');
      expect(result).toEqual({});
    });

    it('should decode URL-encoded values', () => {
      const result = parseSearchString('?search=hello%20world&special=%21%40%23');
      expect(result).toEqual({ search: 'hello world', special: '!@#' });
    });

    it('should handle parameters without values', () => {
      const result = parseSearchString('?flag&other=value');
      expect(result).toEqual({ flag: '', other: 'value' });
    });

    it('should handle duplicate parameters (last wins)', () => {
      const result = parseSearchString('?param=first&param=second');
      expect(result).toEqual({ param: 'second' });
    });

    it('should handle empty parameter values', () => {
      const result = parseSearchString('?empty=&filled=value');
      expect(result).toEqual({ empty: '', filled: 'value' });
    });

    it('should handle malformed search strings gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Test with various malformed inputs
      expect(parseSearchString('?invalid%')).toEqual(expect.any(Object));
      expect(parseSearchString('?%invalid')).toEqual(expect.any(Object));

      consoleWarnSpy.mockRestore();
    });

    it('should handle errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Mock URLSearchParams constructor to throw
      const OriginalURLSearchParams = global.URLSearchParams;
      global.URLSearchParams = class {
        constructor() {
          throw new Error('URLSearchParams error');
        }
      } as any;

      const result = parseSearchString('?foo=bar');
      expect(result).toEqual({});
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to parse search string:',
        expect.any(Error)
      );

      // Restore
      global.URLSearchParams = OriginalURLSearchParams;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('buildSearchString', () => {
    it('should build search string from object', () => {
      const result = buildSearchString({ foo: 'bar', baz: 'qux' });
      expect(result).toBe('?foo=bar&baz=qux');
    });

    it('should build empty string from empty object', () => {
      const result = buildSearchString({});
      expect(result).toBe('');
    });

    it('should skip undefined values', () => {
      const result = buildSearchString({ foo: 'bar', baz: undefined, qux: 'value' });
      expect(result).toBe('?foo=bar&qux=value');
    });

    it('should include empty string values', () => {
      const result = buildSearchString({ foo: 'bar', empty: '', qux: 'value' });
      expect(result).toBe('?foo=bar&empty=&qux=value');
    });

    it('should URL-encode special characters', () => {
      const result = buildSearchString({ search: 'hello world', special: '!@#' });
      expect(result).toBe('?search=hello+world&special=%21%40%23');
    });

    it('should handle object with only undefined values', () => {
      const result = buildSearchString({ foo: undefined, bar: undefined });
      expect(result).toBe('');
    });

    it('should handle errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings in tests
      });

      // Mock URLSearchParams to throw
      const OriginalURLSearchParams = global.URLSearchParams;
      global.URLSearchParams = class {
        constructor() {
          throw new Error('URLSearchParams error');
        }
      } as any;

      const result = buildSearchString({ foo: 'bar' });
      expect(result).toBe('');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to build search string:',
        expect.any(Error)
      );

      // Restore
      global.URLSearchParams = OriginalURLSearchParams;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('areValuesEqual', () => {
    it('should return true for identical primitive values', () => {
      expect(areValuesEqual('hello', 'hello')).toBe(true);
      expect(areValuesEqual(42, 42)).toBe(true);
      expect(areValuesEqual(true, true)).toBe(true);
      expect(areValuesEqual(null, null)).toBe(true);
      expect(areValuesEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for different primitive values', () => {
      expect(areValuesEqual('hello', 'world')).toBe(false);
      expect(areValuesEqual(42, 24)).toBe(false);
      expect(areValuesEqual(true, false)).toBe(false);
      expect(areValuesEqual(null, undefined)).toBe(false);
    });

    it('should return true for same object reference', () => {
      const obj = { a: 1 };
      expect(areValuesEqual(obj, obj)).toBe(true);
    });

    it('should return false for different object references (shallow comparison)', () => {
      expect(areValuesEqual({ a: 1 }, { a: 1 })).toBe(false);
    });

    it('should return true for same array reference', () => {
      const arr = [1, 2, 3];
      expect(areValuesEqual(arr, arr)).toBe(true);
    });

    it('should return false for different array references', () => {
      expect(areValuesEqual([1, 2, 3], [1, 2, 3])).toBe(false);
    });

    it('should return true for same date reference', () => {
      const date = new Date('2020-01-01');
      expect(areValuesEqual(date, date)).toBe(true);
    });

    it('should return false for different date references', () => {
      expect(areValuesEqual(new Date('2020-01-01'), new Date('2020-01-01'))).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(areValuesEqual(0, -0)).toBe(false); // Object.is differentiates 0 and -0
      expect(areValuesEqual(NaN, NaN)).toBe(true);
      expect(areValuesEqual(Infinity, Infinity)).toBe(true);
      expect(areValuesEqual(-Infinity, -Infinity)).toBe(true);
    });
  });

  describe('mergeObjects', () => {
    it('should merge two objects', () => {
      const result = mergeObjects({ a: 1, b: 2 }, { c: 3, d: 4 } as any);
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('should override values from first object with second', () => {
      const result = mergeObjects({ a: 1, b: 2 }, { b: 3, c: 4 } as any);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should handle empty objects', () => {
      expect(mergeObjects({}, { a: 1 } as any)).toEqual({ a: 1 });
      expect(mergeObjects({ a: 1 }, {})).toEqual({ a: 1 });
      expect(mergeObjects({}, {})).toEqual({});
    });

    it('should handle undefined values', () => {
      const result = mergeObjects({ a: 1, b: 2 }, { b: undefined, c: 3 } as any);
      expect(result).toEqual({ a: 1, b: undefined, c: 3 });
    });

    it('should not mutate original objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = mergeObjects(obj1, obj2 as any);

      expect(obj1).toEqual({ a: 1 });
      expect(obj2).toEqual({ b: 2 });
      expect(result).not.toBe(obj1);
      expect(result).not.toBe(obj2);
    });

    it('should handle null and undefined inputs gracefully', () => {
      // These might throw or behave differently based on implementation
      expect(() => mergeObjects(null as any, { a: 1 })).not.toThrow();
      expect(() => mergeObjects({ a: 1 }, null as any)).not.toThrow();
    });
  });

  describe('removeUndefinedValues', () => {
    it('should remove undefined values from object', () => {
      const result = removeUndefinedValues({
        a: 1,
        b: undefined,
        c: 'hello',
        d: undefined,
      });
      expect(result).toEqual({ a: 1, c: 'hello' });
    });

    it('should keep null values', () => {
      const result = removeUndefinedValues({
        a: 1,
        b: null,
        c: undefined,
      });
      expect(result).toEqual({ a: 1, b: null });
    });

    it('should keep empty string values', () => {
      const result = removeUndefinedValues({
        a: 'hello',
        b: '',
        c: undefined,
      });
      expect(result).toEqual({ a: 'hello', b: '' });
    });

    it('should keep zero values', () => {
      const result = removeUndefinedValues({
        a: 1,
        b: 0,
        c: undefined,
      });
      expect(result).toEqual({ a: 1, b: 0 });
    });

    it('should keep false values', () => {
      const result = removeUndefinedValues({
        a: true,
        b: false,
        c: undefined,
      });
      expect(result).toEqual({ a: true, b: false });
    });

    it('should handle empty object', () => {
      const result = removeUndefinedValues({});
      expect(result).toEqual({});
    });

    it('should handle object with only undefined values', () => {
      const result = removeUndefinedValues({
        a: undefined,
        b: undefined,
      });
      expect(result).toEqual({});
    });

    it('should not mutate original object', () => {
      const original = { a: 1, b: undefined, c: 'hello' };
      const result = removeUndefinedValues(original);

      expect(original).toEqual({ a: 1, b: undefined, c: 'hello' });
      expect(result).not.toBe(original);
    });
  });

  describe('integration tests', () => {
    it('should work together: parse and build search strings', () => {
      const original = '?foo=bar&baz=hello%20world';
      const parsed = parseSearchString(original);
      const rebuilt = buildSearchString(parsed);

      // Values should be equivalent (though encoding might differ)
      const reparsed = parseSearchString(rebuilt);
      expect(reparsed).toEqual(parsed);
    });

    it('should work with merge and remove undefined', () => {
      const base = { a: 1, b: 'hello' };
      const updates = { b: undefined, c: 'world' };

      const merged = mergeObjects(base, updates);
      const cleaned = removeUndefinedValues(merged);

      expect(cleaned).toEqual({ a: 1, c: 'world' });
    });

    it('should handle complex workflow', () => {
      // Simulate updating query parameters
      const currentParams = parseSearchString('?page=1&filter=active');
      const updates = { page: '2', filter: undefined, sort: 'name' };

      const mergedParams = mergeObjects(currentParams, updates);
      const cleanedParams = removeUndefinedValues(mergedParams);
      const newSearchString = buildSearchString(cleanedParams);

      expect(newSearchString).toBe('?page=2&sort=name');
    });
  });
});
