[**vue-qs v0.1.10**](../README.md)

***

[vue-qs](../README.md) / useQueryRef

# Function: useQueryRef()

> **useQueryRef**\<`T`\>(`name`, `options`): [`UseQueryRefReturn`](../type-aliases/UseQueryRefReturn.md)\<`T`\>

Defined in: [useQueryRef.ts:23](https://github.com/iamsomraj/vue-qs/blob/f0c3b00cd958e5a3adba94ae66926daf711f0fdf/src/useQueryRef.ts#L23)

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
