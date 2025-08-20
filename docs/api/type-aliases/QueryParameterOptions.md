[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / QueryParameterOptions

# Type Alias: QueryParameterOptions\<T\>

> **QueryParameterOptions**\<`T`\> = `object`

Defined in: [types.ts:64](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L64)

Configuration options for a single query parameter

## Example

```ts
const pageOptions: QueryParameterOptions<number> = {
  defaultValue: 1,
  codec: numberCodec,
  shouldOmitDefault: true,
  isEqual: (a, b) => a === b
};
```

## Type Parameters

### T

`T`

The type of the parameter value

## Properties

### defaultValue?

> `optional` **defaultValue**: `T`

Defined in: [types.ts:66](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L66)

Default value to use when parameter is missing or invalid

***

### codec?

> `optional` **codec**: [`QueryCodec`](QueryCodec.md)\<`T`\>

Defined in: [types.ts:68](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L68)

Combined codec with both parse and serialize functions

***

### parse?

> `optional` **parse**: [`QueryParser`](QueryParser.md)\<`T`\>

Defined in: [types.ts:70](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L70)

Custom parser function (overrides codec.parse if provided)

***

### serializeFunction?

> `optional` **serializeFunction**: [`QuerySerializer`](QuerySerializer.md)\<`T`\>

Defined in: [types.ts:72](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L72)

Custom serializer function (overrides codec.serialize if provided)

***

### isEqual()?

> `optional` **isEqual**: (`valueA`, `valueB`) => `boolean`

Defined in: [types.ts:74](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L74)

Custom equality function to compare values (defaults to Object.is)

#### Parameters

##### valueA

`T`

##### valueB

`T`

#### Returns

`boolean`

***

### shouldOmitDefault?

> `optional` **shouldOmitDefault**: `boolean`

Defined in: [types.ts:76](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L76)

Whether to omit the parameter from URL when value equals default (default: true)
