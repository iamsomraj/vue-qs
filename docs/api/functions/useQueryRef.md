[**vue-qs v0.1.10**](../README.md)

***

[vue-qs](../README.md) / useQueryRef

# Function: useQueryRef()

> **useQueryRef**\<`T`\>(`name`, `options`): [`UseQueryRefReturn`](../type-aliases/UseQueryRefReturn.md)\<`T`\>

Defined in: [useQueryRef.ts:23](https://github.com/iamsomraj/vue-qs/blob/fa7480bd601b09f7ce1b80df8786e16589ef7fc2/src/useQueryRef.ts#L23)

Manage a single query parameter as a Vue Ref.
Keeps the URL in sync as the ref changes; optionally syncs URL -> state.

## Type Parameters

### T

`T`

## Parameters

### name

`string`

### options

[`UseQueryRefOptions`](../type-aliases/UseQueryRefOptions.md)\<`T`\> = `{}`

## Returns

[`UseQueryRefReturn`](../type-aliases/UseQueryRefReturn.md)\<`T`\>
