[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / QueryCodec

# Type Alias: QueryCodec\<T\>

> **QueryCodec**\<`T`\> = `object`

Defined in: [types.ts:23](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/types.ts#L23)

A codec that combines both parse and serialize functions for a given type

## Type Parameters

### T

`T`

The type this codec handles

## Properties

### parse

> **parse**: [`QueryParser`](QueryParser.md)\<`T`\>

Defined in: [types.ts:25](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/types.ts#L25)

Function to parse string values from URL into typed values

***

### serialize

> **serialize**: [`QuerySerializer`](QuerySerializer.md)\<`T`\>

Defined in: [types.ts:27](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/types.ts#L27)

Function to serialize typed values back to URL strings
