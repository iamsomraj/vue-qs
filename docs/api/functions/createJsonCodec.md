[**vue-qs v0.1.16-beta.0**](../README.md)

***

[vue-qs](../README.md) / createJsonCodec

# Function: createJsonCodec()

> **createJsonCodec**\<`T`\>(): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

Defined in: [serializers.ts:113](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/serializers.ts#L113)

JSON codec factory for handling complex objects
Returns null for invalid JSON

## Type Parameters

### T

`T`

The type of object to handle

## Returns

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

QueryCodec for the specified type
