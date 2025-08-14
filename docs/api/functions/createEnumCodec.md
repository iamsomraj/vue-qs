[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / createEnumCodec

# Function: createEnumCodec()

> **createEnumCodec**\<`T`\>(`allowedValues`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`\>

Defined in: [serializers.ts:190](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/serializers.ts#L190)

Enum codec factory for handling string enum values
Falls back to first enum value for invalid inputs

## Type Parameters

### T

`T` *extends* `string`

String literal union type

## Parameters

### allowedValues

readonly `T`[]

Array of allowed enum values

## Returns

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`\>

QueryCodec for the enum type
