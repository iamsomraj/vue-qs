[**vue-qs v0.1.16**](../README.md)

---

[vue-qs](../README.md) / QueryParameterOptions

# Type Alias: QueryParameterOptions\<T\>

> **QueryParameterOptions**\<`T`\> = `object`

Defined in: [types.ts:34](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/types.ts#L34)

Configuration options for a single query parameter

## Type Parameters

### T

`T`

The type of the parameter value

## Properties

### defaultValue?

> `optional` **defaultValue**: `T`

Defined in: [types.ts:36](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/types.ts#L36)

Default value to use when parameter is missing or invalid

---

### codec?

> `optional` **codec**: [`QueryCodec`](QueryCodec.md)\<`T`\>

Defined in: [types.ts:38](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/types.ts#L38)

Combined codec with both parse and serialize functions

---

### parse?

> `optional` **parse**: [`QueryParser`](QueryParser.md)\<`T`\>

Defined in: [types.ts:40](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/types.ts#L40)

Custom parser function (overrides codec.parse if provided)

---

### serializeFunction?

> `optional` **serializeFunction**: [`QuerySerializer`](QuerySerializer.md)\<`T`\>

Defined in: [types.ts:42](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/types.ts#L42)

Custom serializer function (overrides codec.serialize if provided)

---

### isEqual()?

> `optional` **isEqual**: (`valueA`, `valueB`) => `boolean`

Defined in: [types.ts:44](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/types.ts#L44)

Custom equality function to compare values (defaults to Object.is)

#### Parameters

##### valueA

`T`

##### valueB

`T`

#### Returns

`boolean`

---

### shouldOmitDefault?

> `optional` **shouldOmitDefault**: `boolean`

Defined in: [types.ts:46](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/types.ts#L46)

Whether to omit the parameter from URL when value equals default (default: true)

---

### batchKey?

> `optional` **batchKey**: `string`

Defined in: [types.ts:48](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/types.ts#L48)

Optional batch key for grouping parameter updates
