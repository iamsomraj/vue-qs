[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / createArrayCodec

# Function: createArrayCodec()

> **createArrayCodec**\<`T`\>(`elementCodec`, `delimiter`): [`QueryCodec`](../type-aliases/QueryCodec.md)\<`T`[]\>

Defined in: [serializers.ts:208](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/serializers.ts#L208)

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
