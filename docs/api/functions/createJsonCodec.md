[**vue-qs v0.1.14**](../README.md)

***

[vue-qs](../README.md) / createJsonCodec

# Function: createJsonCodec()

> **createJsonCodec**\<`T`\>(): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

Defined in: [serializers.ts:112](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/serializers.ts#L112)

JSON codec factory for handling complex objects
Returns null for invalid JSON

## Type Parameters

### T

`T`

The type of object to handle

## Returns

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

QueryCodec for the specified type
