[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / createJsonCodec

# Function: createJsonCodec()

> **createJsonCodec**\<`T`\>(): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`null` \| `T`\>

Defined in: [serializers.ts:153](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/serializers.ts#L153)

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
