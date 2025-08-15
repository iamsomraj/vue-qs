[**vue-qs v0.1.16-beta.0**](../README.md)

***

[vue-qs](../README.md) / createArrayCodec

# Function: createArrayCodec()

> **createArrayCodec**\<`T`\>(`elementCodec`, `delimiter`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`[]\>

Defined in: [serializers.ts:148](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/serializers.ts#L148)

Array codec factory for handling arrays with a specific element type

## Type Parameters

### T

`T`

The type of array elements

## Parameters

### elementCodec

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`\>

Codec for individual array elements

### delimiter

`string` = `','`

String to use for separating array elements (default: ',')

## Returns

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`[]\>

QueryCodec for arrays of the specified type
