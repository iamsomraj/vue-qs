[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / createArrayCodec

# Function: createArrayCodec()

> **createArrayCodec**\<`T`\>(`elementCodec`, `delimiter`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`[]\>

Defined in: [serializers.ts:208](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/serializers.ts#L208)

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

## Example

```ts
// String array: ?tags=vue,react,angular
const tags = queryRef('tags', {
  defaultValue: [],
  codec: createArrayCodec(stringCodec)
});

// Number array: ?pages=1,2,3
const pages = queryRef('pages', {
  defaultValue: [],
  codec: createArrayCodec(numberCodec)
});

// Custom delimiter: ?tags=vue|react|angular
const tags = queryRef('tags', {
  defaultValue: [],
  codec: createArrayCodec(stringCodec, '|')
});
```
