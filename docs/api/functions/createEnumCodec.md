[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / createEnumCodec

# Function: createEnumCodec()

> **createEnumCodec**\<`T`\>(`allowedValues`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`undefined` \| `T`\>

Defined in: [serializers.ts:262](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/serializers.ts#L262)

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

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`undefined` \| `T`\>

QueryCodec for the enum type

## Example

```ts
type SortOrder = 'asc' | 'desc';

const sort = queryRef('sort', {
  defaultValue: 'asc',
  codec: createEnumCodec<SortOrder>(['asc', 'desc'])
});

// URL: ?sort=desc
// Invalid values fall back to 'asc'
```
