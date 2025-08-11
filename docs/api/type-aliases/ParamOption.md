[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / ParamOption

# Type Alias: ParamOption\<T\>

> **ParamOption**\<`T`\> = `object`

Defined in: [types.ts:7](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L7)

## Type Parameters

### T

`T`

## Properties

### default?

> `optional` **default**: `T`

Defined in: [types.ts:8](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L8)

***

### codec?

> `optional` **codec**: [`QueryCodec`](QueryCodec.md)\<`T`\>

Defined in: [types.ts:10](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L10)

Pass a single codec instead of separate parse/serialize.

***

### parse?

> `optional` **parse**: [`Parser`](Parser.md)\<`T`\>

Defined in: [types.ts:11](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L11)

***

### serialize?

> `optional` **serialize**: [`Serializer`](Serializer.md)\<`T`\>

Defined in: [types.ts:12](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L12)

***

### equals()?

> `optional` **equals**: (`a`, `b`) => `boolean`

Defined in: [types.ts:17](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L17)

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

Defined in: [types.ts:22](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L22)

If true, will not write to URL when value equals default.
Defaults to true.

***

### batchKey?

> `optional` **batchKey**: `string`

Defined in: [types.ts:26](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L26)

If true, updates to multiple params can be batched without multiple history entries
