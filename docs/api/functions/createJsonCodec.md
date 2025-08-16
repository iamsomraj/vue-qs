[**vue-qs v0.1.16**](../README.md)

---

[vue-qs](../README.md) / createJsonCodec

# Function: createJsonCodec()

> **createJsonCodec**\<`T`\>(): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

Defined in: [serializers.ts:113](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/serializers.ts#L113)

JSON codec factory for handling complex objects
Returns null for invalid JSON

## Type Parameters

### T

`T`

The type of object to handle

## Returns

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

QueryCodec for the specified type
