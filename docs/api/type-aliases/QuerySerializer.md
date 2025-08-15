[**vue-qs v0.1.16-beta.0**](../README.md)

***

[vue-qs](../README.md) / QuerySerializer

# Type Alias: QuerySerializer()\<T\>

> **QuerySerializer**\<`T`\> = (`typedValue`) => `string` \| `null`

Defined in: [types.ts:17](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/types.ts#L17)

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

The serialized string value or null if the value should be omitted
