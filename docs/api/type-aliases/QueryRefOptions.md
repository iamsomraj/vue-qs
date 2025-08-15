[**vue-qs v0.1.16-beta.0**](../README.md)

***

[vue-qs](../README.md) / QueryRefOptions

# Type Alias: QueryRefOptions\<T\>

> **QueryRefOptions**\<`T`\> = [`QueryParameterOptions`](QueryParameterOptions.md)\<`T`\> & `object`

Defined in: [types.ts:60](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/types.ts#L60)

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
