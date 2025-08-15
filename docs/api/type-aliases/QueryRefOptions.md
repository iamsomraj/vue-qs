[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / QueryRefOptions

# Type Alias: QueryRefOptions\<T\>

> **QueryRefOptions**\<`T`\> = [`QueryParameterOptions`](QueryParameterOptions.md)\<`T`\> & `object`

Defined in: [types.ts:60](https://github.com/iamsomraj/vue-qs/blob/2515abe5c25afff0f87351153aa1684c958bdf3f/src/types.ts#L60)

Options for queryRef composable

## Type declaration

### historyStrategy?

> `optional` **historyStrategy**: `"replace"` \| `"push"`

History strategy when updating the URL ('replace' | 'push')

### queryAdapter?

> `optional` **queryAdapter**: [`QueryAdapter`](QueryAdapter.md)

Optional custom query adapter to use

## Type Parameters

### T

`T`

The type of the query parameter value
