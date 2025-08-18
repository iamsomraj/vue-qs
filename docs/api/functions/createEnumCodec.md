[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / createEnumCodec

# Function: createEnumCodec()

> **createEnumCodec**\<`T`\>(`allowedValues`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`undefined` \| `T`\>

Defined in: [serializers.ts:262](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/serializers.ts#L262)

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
