[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / QueryCodec

# Type Alias: QueryCodec\<T\>

> **QueryCodec**\<`T`\> = `object`

Defined in: [types.ts:44](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L44)

A codec that combines both parse and serialize functions for a given type

## Example

```ts
const numberCodec: QueryCodec<number> = {
  parse: (raw) => raw ? Number(raw) : 0,
  serialize: (value) => value === 0 ? null : String(value)
};
```

## Type Parameters

### T

`T`

The type this codec handles

## Properties

### parse

> **parse**: [`QueryParser`](QueryParser.md)\<`T`\>

Defined in: [types.ts:46](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L46)

Function to parse string values from URL into typed values

***

### serialize

> **serialize**: [`QuerySerializer`](QuerySerializer.md)\<`T`\>

Defined in: [types.ts:48](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L48)

Function to serialize typed values back to URL strings
