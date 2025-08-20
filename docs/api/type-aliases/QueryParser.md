[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / QueryParser

# Type Alias: QueryParser()\<T\>

> **QueryParser**\<`T`\> = (`rawValue`) => `T`

Defined in: [types.ts:17](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L17)

Function that parses a raw query string value into a typed value

## Type Parameters

### T

`T`

The expected output type

## Parameters

### rawValue

The raw string value from the URL query parameter, or null if the parameter is missing

`string` | `null`

## Returns

`T`

The parsed typed value

## Example

```ts
const numberParser: QueryParser<number> = (rawValue) => {
  if (!rawValue) return 0;
  const parsed = Number(rawValue);
  return isNaN(parsed) ? 0 : parsed;
};
```
