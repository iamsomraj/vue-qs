[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / createArrayCodec

# Function: createArrayCodec()

> **createArrayCodec**\<`T`\>(`elementCodec`, `delimiter`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`[]\>

Defined in: [serializers.ts:148](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/serializers.ts#L148)

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
