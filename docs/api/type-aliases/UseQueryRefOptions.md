[**vue-qs v0.1.14**](../README.md)

***

[vue-qs](../README.md) / UseQueryRefOptions

# Type Alias: UseQueryRefOptions\<T\>

> **UseQueryRefOptions**\<`T`\> = [`QueryParameterOptions`](QueryParameterOptions.md)\<`T`\> & `object`

Defined in: [types.ts:60](https://github.com/iamsomraj/vue-qs/blob/ec4fb3c838b3c4df192df135415be97046b0cf75/src/types.ts#L60)

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
