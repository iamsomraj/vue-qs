[**vue-qs v0.1.16**](../README.md)

---

[vue-qs](../README.md) / createEnumCodec

# Function: createEnumCodec()

> **createEnumCodec**\<`T`\>(`allowedValues`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`\>

Defined in: [serializers.ts:190](https://github.com/iamsomraj/vue-qs/blob/e1f88d67026c08e56605a693106ef6b717bd39ad/src/serializers.ts#L190)

Enum codec factory for handling string enum values
Falls back to first enum value for invalid inputs

## Type Parameters

### T

`T` _extends_ `string`

String literal union type

## Parameters

### allowedValues

readonly `T`[]

Array of allowed enum values

## Returns

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`\>

QueryCodec for the enum type
