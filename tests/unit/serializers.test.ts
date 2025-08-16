import { describe, it, expect } from 'vitest';
import {
  stringCodec,
  numberCodec,
  booleanCodec,
  dateISOCodec,
  createJsonCodec,
  createArrayCodec,
  createEnumCodec,
} from '@/serializers';

describe('Serializers', () => {
  describe('stringCodec', () => {
    it('should parse null to empty string', () => {
      expect(stringCodec.parse(null)).toBe('');
    });

    it('should parse string values as-is', () => {
      expect(stringCodec.parse('hello')).toBe('hello');
      expect(stringCodec.parse('123')).toBe('123');
      expect(stringCodec.parse('')).toBe('');
    });

    it('should serialize string values as-is', () => {
      expect(stringCodec.serialize('hello')).toBe('hello');
      expect(stringCodec.serialize('123')).toBe('123');
      expect(stringCodec.serialize('')).toBe('');
    });
  });

  describe('numberCodec', () => {
    it('should parse valid number strings', () => {
      expect(numberCodec.parse('123')).toBe(123);
      expect(numberCodec.parse('0')).toBe(0);
      expect(numberCodec.parse('-456')).toBe(-456);
      expect(numberCodec.parse('3.14')).toBe(3.14);
    });

    it('should parse null to NaN', () => {
      expect(numberCodec.parse(null)).toBeNaN();
    });

    it('should parse empty string to NaN', () => {
      expect(numberCodec.parse('')).toBeNaN();
    });

    it('should parse invalid strings to NaN', () => {
      expect(numberCodec.parse('abc')).toBeNaN();
      expect(numberCodec.parse('123abc')).toBeNaN();
    });

    it('should serialize finite numbers to strings', () => {
      expect(numberCodec.serialize(123)).toBe('123');
      expect(numberCodec.serialize(0)).toBe('0');
      expect(numberCodec.serialize(-456)).toBe('-456');
      expect(numberCodec.serialize(3.14)).toBe('3.14');
    });

    it('should serialize infinite numbers to null', () => {
      expect(numberCodec.serialize(NaN)).toBe(null);
      expect(numberCodec.serialize(Infinity)).toBe(null);
      expect(numberCodec.serialize(-Infinity)).toBe(null);
    });
  });

  describe('booleanCodec', () => {
    it('should parse truthy strings to true', () => {
      expect(booleanCodec.parse('true')).toBe(true);
      expect(booleanCodec.parse('1')).toBe(true);
    });

    it('should parse falsy strings to false', () => {
      expect(booleanCodec.parse('false')).toBe(false);
      expect(booleanCodec.parse('0')).toBe(false);
      expect(booleanCodec.parse('no')).toBe(false);
      expect(booleanCodec.parse('off')).toBe(false);
      expect(booleanCodec.parse('')).toBe(false);
      expect(booleanCodec.parse('yes')).toBe(false); // Only 'true' and '1' are truthy
      expect(booleanCodec.parse('on')).toBe(false); // Only 'true' and '1' are truthy
    });

    it('should parse null to false', () => {
      expect(booleanCodec.parse(null)).toBe(false);
    });

    it('should parse other strings to false', () => {
      expect(booleanCodec.parse('maybe')).toBe(false);
      expect(booleanCodec.parse('123')).toBe(false);
    });

    it('should serialize boolean values', () => {
      expect(booleanCodec.serialize(true)).toBe('true');
      expect(booleanCodec.serialize(false)).toBe('false');
    });
  });

  describe('dateISOCodec', () => {
    it('should parse valid ISO date strings', () => {
      const dateStr = '2023-12-25T10:30:00.000Z';
      const parsed = dateISOCodec.parse(dateStr);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.toISOString()).toBe(dateStr);
    });

    it('should parse null to invalid date', () => {
      const parsed = dateISOCodec.parse(null);
      expect(parsed).toBeInstanceOf(Date);
      expect(isNaN(parsed.getTime())).toBe(true);
    });

    it('should parse invalid date strings to invalid date', () => {
      const parsed = dateISOCodec.parse('invalid-date');
      expect(parsed).toBeInstanceOf(Date);
      expect(isNaN(parsed.getTime())).toBe(true);
    });

    it('should serialize Date objects to ISO strings', () => {
      const date = new Date('2023-12-25T10:30:00.000Z');
      expect(dateISOCodec.serialize(date)).toBe('2023-12-25T10:30:00.000Z');
    });
  });

  describe('createJsonCodec', () => {
    it('should create codec for simple objects', () => {
      interface User {
        name: string;
        age: number;
      }

      const codec = createJsonCodec<User>();
      const user: User = { name: 'John', age: 30 };
      const userJson = '{"name":"John","age":30}';

      expect(codec.serialize(user)).toBe(userJson);
      expect(codec.parse(userJson)).toEqual(user);
    });

    it('should handle null values', () => {
      const codec = createJsonCodec<string | null>();

      expect(codec.parse(null)).toBe(null);
      expect(codec.serialize(null)).toBe(null); // The actual implementation returns null for null input
    });

    it('should handle complex nested objects', () => {
      interface ComplexObject {
        user: {
          name: string;
          profile: {
            age: number;
            tags: string[];
          };
        };
        settings: {
          theme: string;
          notifications: boolean;
        };
      }

      const codec = createJsonCodec<ComplexObject>();
      const obj: ComplexObject = {
        user: {
          name: 'Alice',
          profile: {
            age: 25,
            tags: ['developer', 'designer'],
          },
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      };

      const serialized = codec.serialize(obj);
      expect(typeof serialized).toBe('string');
      expect(codec.parse(serialized)).toEqual(obj);
    });

    it('should handle arrays', () => {
      const codec = createJsonCodec<number[]>();
      const arr = [1, 2, 3, 4, 5];

      const serialized = codec.serialize(arr);
      expect(serialized).toBe('[1,2,3,4,5]');
      expect(codec.parse(serialized)).toEqual(arr);
    });

    it('should handle malformed JSON gracefully', () => {
      const codec = createJsonCodec<any>();

      expect(codec.parse('invalid-json')).toBe(null);
      expect(codec.parse('{')).toBe(null);
      expect(codec.parse('')).toBe(null);
    });
  });

  describe('createArrayCodec', () => {
    it('should create codec for string arrays', () => {
      const codec = createArrayCodec(stringCodec);
      const arr = ['apple', 'banana', 'cherry'];

      expect(codec.serialize(arr)).toBe('apple,banana,cherry');
      expect(codec.parse('apple,banana,cherry')).toEqual(arr);
    });

    it('should create codec for number arrays', () => {
      const codec = createArrayCodec(numberCodec);
      const arr = [1, 2, 3, 4, 5];

      expect(codec.serialize(arr)).toBe('1,2,3,4,5');
      expect(codec.parse('1,2,3,4,5')).toEqual(arr);
    });

    it('should handle empty arrays', () => {
      const codec = createArrayCodec(stringCodec);

      expect(codec.serialize([])).toBe(null); // The actual implementation returns null for empty arrays
      expect(codec.parse('')).toEqual([]);
      expect(codec.parse(null)).toEqual([]);
    });

    it('should handle single item arrays', () => {
      const codec = createArrayCodec(stringCodec);

      expect(codec.serialize(['single'])).toBe('single');
      expect(codec.parse('single')).toEqual(['single']);
    });

    it('should handle arrays with empty string items', () => {
      const codec = createArrayCodec(stringCodec);
      const arr = ['', 'middle', ''];

      expect(codec.serialize(arr)).toBe(',middle,');
      expect(codec.parse(',middle,')).toEqual(arr);
    });

    it('should handle custom separators', () => {
      const codec = createArrayCodec(stringCodec, '|');
      const arr = ['apple', 'banana', 'cherry'];

      expect(codec.serialize(arr)).toBe('apple|banana|cherry');
      expect(codec.parse('apple|banana|cherry')).toEqual(arr);
    });

    it('should handle arrays with boolean items', () => {
      const codec = createArrayCodec(booleanCodec);
      const arr = [true, false, true];

      expect(codec.serialize(arr)).toBe('true,false,true');
      expect(codec.parse('true,false,true')).toEqual(arr);
    });

    it('should handle nested array codecs', () => {
      // Create an array of arrays of numbers
      const innerCodec = createArrayCodec(numberCodec);
      const outerCodec = createArrayCodec(innerCodec, '|');

      const nestedArr = [[1, 2], [3, 4, 5], [6]];

      const serialized = outerCodec.serialize(nestedArr);
      expect(serialized).toBe('1,2|3,4,5|6');

      const parsed = outerCodec.parse(serialized);
      expect(parsed).toEqual(nestedArr);
    });
  });

  describe('createEnumCodec', () => {
    it('should create codec for string enums', () => {
      const values = ['small', 'medium', 'large'] as const;
      const codec = createEnumCodec(values);

      expect(codec.serialize('small')).toBe('small');
      expect(codec.serialize('medium')).toBe('medium');
      expect(codec.serialize('large')).toBe('large');

      expect(codec.parse('small')).toBe('small');
      expect(codec.parse('medium')).toBe('medium');
      expect(codec.parse('large')).toBe('large');
    });

    it('should handle invalid enum values by returning first value', () => {
      const values = ['red', 'green', 'blue'] as const;
      const codec = createEnumCodec(values);

      expect(codec.parse('yellow')).toBe('red'); // First value as fallback
      expect(codec.parse('invalid')).toBe('red');
      expect(codec.parse(null)).toBe('red');
      expect(codec.parse('')).toBe('red');
    });

    it('should work with case sensitivity', () => {
      const values = ['Active', 'Inactive'] as const;
      const codec = createEnumCodec(values);

      expect(codec.parse('Active')).toBe('Active');
      expect(codec.parse('active')).toBe('Active'); // Should fallback to first
      expect(codec.parse('ACTIVE')).toBe('Active'); // Should fallback to first
    });

    it('should handle empty enum arrays gracefully', () => {
      const values = [] as const;
      const codec = createEnumCodec(values);

      expect(codec.parse('anything')).toBe(undefined);
      expect(codec.parse(null)).toBe(undefined);
    });
  });

  describe('Codec Composition', () => {
    it('should compose array and enum codecs', () => {
      const enumCodec = createEnumCodec(['small', 'medium', 'large'] as const);
      const arrayEnumCodec = createArrayCodec(enumCodec);

      const sizes: ('small' | 'medium' | 'large')[] = ['small', 'large', 'medium'];
      const serialized = arrayEnumCodec.serialize(sizes);
      expect(serialized).toBe('small,large,medium');

      const parsed = arrayEnumCodec.parse(serialized);
      expect(parsed).toEqual(sizes);
    });

    it('should compose array and JSON codecs', () => {
      interface User {
        name: string;
        age: number;
      }

      const jsonCodec = createJsonCodec<User>();
      const arrayJsonCodec = createArrayCodec(jsonCodec, '|');

      const users: User[] = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ];

      const serialized = arrayJsonCodec.serialize(users);
      expect(serialized).toBe('{"name":"Alice","age":25}|{"name":"Bob","age":30}');

      const parsed = arrayJsonCodec.parse(serialized);
      expect(parsed).toEqual(users);
    });

    it('should handle complex nested structures', () => {
      interface NestedData {
        categories: string[];
        settings: {
          theme: 'light' | 'dark';
          notifications: boolean;
        };
      }

      const codec = createJsonCodec<NestedData>();
      const data: NestedData = {
        categories: ['tech', 'design', 'business'],
        settings: {
          theme: 'dark',
          notifications: true,
        },
      };

      const serialized = codec.serialize(data);
      const parsed = codec.parse(serialized);

      expect(parsed).toEqual(data);
      expect(parsed).not.toBeNull();
      if (parsed) {
        expect(parsed.categories).toEqual(['tech', 'design', 'business']);
        expect(parsed.settings.theme).toBe('dark');
        expect(parsed.settings.notifications).toBe(true);
      }
    });
  });
});
