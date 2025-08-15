[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / QuerySerializer

# Type Alias: QuerySerializer()\<T\>

> **QuerySerializer**\<`T`\> = (`typedValue`) => `string` \| `null`

Defined in: [types.ts:17](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/types.ts#L17)

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
