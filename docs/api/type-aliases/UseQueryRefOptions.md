[**vue-qs v0.1.12**](../README.md)

***

[vue-qs](../README.md) / UseQueryRefOptions

# Type Alias: UseQueryRefOptions\<T\>

> **UseQueryRefOptions**\<`T`\> = [`QueryParameterOptions`](QueryParameterOptions.md)\<`T`\> & `object`

Defined in: [types.ts:60](https://github.com/iamsomraj/vue-qs/blob/a939c826c3bc2f8d12b41c9e4a6ee1db94af81b0/src/types.ts#L60)

Options for useQueryRef composable

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
