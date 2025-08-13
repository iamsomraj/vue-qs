import type { QueryCodec } from '@/types';

/**
 * String codec for handling string values
 * Treats null/undefined as empty string
 */
export const stringCodec: QueryCodec<string> = {
  parse: (rawValue) => {
    try {
      return rawValue ?? '';
    } catch (error) {
      console.warn('Error parsing string value:', error);
      return '';
    }
  },

  serialize: (stringValue) => {
    try {
      return String(stringValue);
    } catch (error) {
      console.warn('Error serializing string value:', error);
      return null;
    }
  },
};

/**
 * Number codec for handling numeric values
 * Returns NaN for invalid numbers
 */
export const numberCodec: QueryCodec<number> = {
  parse: (rawValue) => {
    try {
      if (rawValue === null || rawValue === '') {
        return NaN;
      }
      const numericValue = Number(rawValue);
      return numericValue;
    } catch (error) {
      console.warn('Error parsing number value:', error);
      return NaN;
    }
  },

  serialize: (numericValue) => {
    try {
      return Number.isFinite(numericValue) ? String(numericValue) : null;
    } catch (error) {
      console.warn('Error serializing number value:', error);
      return null;
    }
  },
};

/**
 * Boolean codec for handling boolean values
 * Treats 'true' and '1' as true, everything else as false
 */
export const booleanCodec: QueryCodec<boolean> = {
  parse: (rawValue) => {
    try {
      return rawValue === 'true' || rawValue === '1';
    } catch (error) {
      console.warn('Error parsing boolean value:', error);
      return false;
    }
  },

  serialize: (booleanValue) => {
    try {
      return booleanValue ? 'true' : 'false';
    } catch (error) {
      console.warn('Error serializing boolean value:', error);
      return 'false';
    }
  },
};

/**
 * Date codec using ISO string format
 * Returns invalid Date for unparseable values
 */
export const dateISOCodec: QueryCodec<Date> = {
  parse: (rawValue) => {
    try {
      return rawValue !== null && rawValue !== '' ? new Date(rawValue) : new Date(NaN);
    } catch (error) {
      console.warn('Error parsing date value:', error);
      return new Date(NaN);
    }
  },

  serialize: (dateValue) => {
    try {
      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue.toISOString();
      }
      return null;
    } catch (error) {
      console.warn('Error serializing date value:', error);
      return null;
    }
  },
};

/**
 * JSON codec factory for handling complex objects
 * Returns null for invalid JSON
 * @template T The type of object to handle
 * @returns QueryCodec for the specified type
 */
export function createJsonCodec<T>(): QueryCodec<T | null> {
  return {
    parse: (rawValue) => {
      try {
        if (rawValue === null || rawValue === '') {
          return null;
        }
        return JSON.parse(rawValue) as T;
      } catch (error) {
        console.warn('Error parsing JSON value:', error);
        return null;
      }
    },

    serialize: (objectValue) => {
      try {
        if (objectValue === null || objectValue === undefined) {
          return null;
        }
        return JSON.stringify(objectValue);
      } catch (error) {
        console.warn('Error serializing JSON value:', error);
        return null;
      }
    },
  };
}

/**
 * Array codec factory for handling arrays with a specific element type
 * @template T The type of array elements
 * @param elementCodec Codec for individual array elements
 * @param delimiter String to use for separating array elements (default: ',')
 * @returns QueryCodec for arrays of the specified type
 */
export function createArrayCodec<T>(elementCodec: QueryCodec<T>, delimiter = ','): QueryCodec<T[]> {
  return {
    parse: (rawValue) => {
      try {
        if (rawValue === null || rawValue === '') {
          return [];
        }

        const arrayElements = rawValue.split(delimiter);
        return arrayElements.map((element) => elementCodec.parse(element));
      } catch (error) {
        console.warn('Error parsing array value:', error);
        return [];
      }
    },

    serialize: (arrayValue) => {
      try {
        if (!Array.isArray(arrayValue) || arrayValue.length === 0) {
          return null;
        }

        const serializedElements = arrayValue
          .map((element) => elementCodec.serialize(element))
          .filter((serialized): serialized is string => serialized !== null);

        return serializedElements.length > 0 ? serializedElements.join(delimiter) : null;
      } catch (error) {
        console.warn('Error serializing array value:', error);
        return null;
      }
    },
  };
}

/**
 * Enum codec factory for handling string enum values
 * Falls back to first enum value for invalid inputs
 * @template T String literal union type
 * @param allowedValues Array of allowed enum values
 * @returns QueryCodec for the enum type
 */
export function createEnumCodec<T extends string>(allowedValues: readonly T[]): QueryCodec<T> {
  const defaultValue = allowedValues[0];

  return {
    parse: (rawValue) => {
      try {
        if (allowedValues.includes(rawValue as T)) {
          return rawValue as T;
        }
        return defaultValue;
      } catch (error) {
        console.warn('Error parsing enum value:', error);
        return defaultValue;
      }
    },

    serialize: (enumValue) => {
      try {
        return allowedValues.includes(enumValue) ? enumValue : defaultValue;
      } catch (error) {
        console.warn('Error serializing enum value:', error);
        return defaultValue;
      }
    },
  };
}

export type { QueryCodec };
