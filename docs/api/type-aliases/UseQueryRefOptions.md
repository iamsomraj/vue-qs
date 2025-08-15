[**vue-qs v0.1.15**](../README.md)

---

[vue-qs](../README.md) / QueryRefOptions

# Type Alias: QueryRefOptions\<T\>

> **QueryRefOptions**\<`T`\> = [`QueryParameterOptions`](QueryParameterOptions.md)\<`T`\> & `object`

Defined in: [types.ts:60](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/types.ts#L60)

Options for queryRef composable

## Type declaration

### historyStrategy?

> `optional` **historyStrategy**: `"replace"` \| `"push"`

History strategy when updating the URL ('replace' | 'push')

### queryAdapter?

> `optional` **queryAdapter**: [`QueryAdapter`](QueryAdapter.md)

Optional custom query adapter to use

### enableTwoWaySync?

> `optional` **enableTwoWaySync**: `boolean`

Enable two-way synchronization with URL changes

## Type Parameters

### T

`T`

The type of the query parameter value
