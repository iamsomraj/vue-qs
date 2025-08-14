[**vue-qs v0.1.14**](../README.md)

***

[vue-qs](../README.md) / createArrayCodec

# Function: createArrayCodec()

> **createArrayCodec**\<`T`\>(`elementCodec`, `delimiter`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`[]\>

Defined in: [serializers.ts:147](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/serializers.ts#L147)

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
