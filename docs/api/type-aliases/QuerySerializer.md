[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / QuerySerializer

# Type Alias: QuerySerializer()\<T\>

> **QuerySerializer**\<`T`\> = (`typedValue`) => `string` \| `null`

Defined in: [types.ts:31](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/types.ts#L31)

Function that serializes a typed value into a string for the URL query

## Type Parameters

### T

`T`

The input type to serialize

## Parameters

### typedValue

`T`

The typed value to serialize

## Returns

`string` \| `null`

The serialized string value, or null if the value should be omitted from the URL

## Example

```ts
const numberSerializer: QuerySerializer<number> = (value) => {
  return value === 0 ? null : String(value);
};
```
