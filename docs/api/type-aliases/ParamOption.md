[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / ParamOption

# Type Alias: ParamOption\<T\>

> **ParamOption**\<`T`\> = `object`

Defined in: [types.ts:11](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L11)

Configuration for a single query parameter.

## Type Parameters

### T

`T`

## Properties

### default?

> `optional` **default**: `T`

Defined in: [types.ts:12](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L12)

***

### codec?

> `optional` **codec**: [`QueryCodec`](QueryCodec.md)\<`T`\>

Defined in: [types.ts:14](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L14)

Pass a single codec instead of separate parse/serialize.

***

### parse?

> `optional` **parse**: [`Parser`](Parser.md)\<`T`\>

Defined in: [types.ts:15](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L15)

***

### serialize?

> `optional` **serialize**: [`Serializer`](Serializer.md)\<`T`\>

Defined in: [types.ts:16](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L16)

***

### equals()?

> `optional` **equals**: (`a`, `b`) => `boolean`

Defined in: [types.ts:21](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L21)

Custom equality to compare with `default` when deciding to omit from URL.
Defaults to Object.is.

#### Parameters

##### a

`T`

##### b

`T`

#### Returns

`boolean`

***

### omitIfDefault?

> `optional` **omitIfDefault**: `boolean`

Defined in: [types.ts:26](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L26)

If true, will not write to URL when value equals default.
Defaults to true.

***

### batchKey?

> `optional` **batchKey**: `string`

Defined in: [types.ts:31](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L31)

Optional key to conceptually group params when batching updates. Not used internally yet,
but reserved for future heuristics or custom adapters.
