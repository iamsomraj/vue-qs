[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / createJsonCodec

# Function: createJsonCodec()

> **createJsonCodec**\<`T`\>(): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

Defined in: [serializers.ts:153](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/serializers.ts#L153)

JSON codec factory for handling complex objects
Returns null for invalid JSON

## Type Parameters

### T

`T`

The type of object to handle

## Returns

[`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

QueryCodec for the specified type

## Example

```ts
interface UserFilters {
  category: string;
  sort: 'name' | 'date';
}

const filters = queryRef('filters', {
  defaultValue: { category: 'all', sort: 'name' },
  codec: createJsonCodec<UserFilters>()
});
```
