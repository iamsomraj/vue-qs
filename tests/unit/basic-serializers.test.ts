import { describe, it, expect } from 'vitest';
import {
  stringCodec,
  numberCodec,
  booleanCodec,
  createArrayCodec,
  createEnumCodec,
  createJsonCodec,
} from '@/serializers';

describe('Basic Serializers Tests', () => {
  describe('stringCodec', () => {
    it('should handle string values correctly', () => {
      expect(stringCodec.parse('hello')).toBe('hello');
      expect(stringCodec.parse(null)).toBe('');
      expect(stringCodec.serialize('world')).toBe('world');
    });
  });

  describe('numberCodec', () => {
    it('should handle number values correctly', () => {
      expect(numberCodec.parse('123')).toBe(123);
      expect(numberCodec.parse('0')).toBe(0);
      expect(numberCodec.parse(null)).toBeNaN();
      expect(numberCodec.serialize(123)).toBe('123');
      expect(numberCodec.serialize(0)).toBe('0');
    });
  });

  describe('booleanCodec', () => {
    it('should handle boolean values correctly', () => {
      expect(booleanCodec.parse('true')).toBe(true);
      expect(booleanCodec.parse('false')).toBe(false);
      expect(booleanCodec.parse('1')).toBe(true);
      expect(booleanCodec.parse('0')).toBe(false);
      expect(booleanCodec.parse(null)).toBe(false);
      expect(booleanCodec.serialize(true)).toBe('true');
      expect(booleanCodec.serialize(false)).toBe('false');
    });
  });

  describe('createArrayCodec', () => {
    it('should handle string arrays', () => {
      const codec = createArrayCodec(stringCodec);

      expect(codec.parse('a,b,c')).toEqual(['a', 'b', 'c']);
      expect(codec.parse('')).toEqual([]);
      expect(codec.parse(null)).toEqual([]);

      expect(codec.serialize(['x', 'y', 'z'])).toBe('x,y,z');
      expect(codec.serialize([])).toBe(null);
    });
  });

  describe('createEnumCodec', () => {
    it('should handle string enums', () => {
      const codec = createEnumCodec(['small', 'medium', 'large']);

      expect(codec.parse('small')).toBe('small');
      expect(codec.parse('invalid')).toBe('small'); // fallback to first
      expect(codec.parse(null)).toBe('small');

      expect(codec.serialize('medium')).toBe('medium');
      expect(codec.serialize('large')).toBe('large');
    });
  });

  describe('createJsonCodec', () => {
    it('should handle JSON objects', () => {
      const codec = createJsonCodec<{ name: string; age: number }>();

      const obj = { name: 'John', age: 30 };
      const serialized = codec.serialize(obj);
      expect(serialized).toBe('{"name":"John","age":30}');

      const parsed = codec.parse(serialized!);
      expect(parsed).toEqual(obj);

      expect(codec.parse(null)).toBe(null);
      expect(codec.parse('invalid')).toBe(null);
    });
  });
});
