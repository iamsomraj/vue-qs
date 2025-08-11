[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / UseQueryRefOptions

# Type Alias: UseQueryRefOptions\<T\>

> **UseQueryRefOptions**\<`T`\> = [`ParamOption`](ParamOption.md)\<`T`\> & `object`

Defined in: [types.ts:36](https://github.com/iamsomraj/vue-qs/blob/b9909ff029be0e52ce297bc89945187d8e2b539f/src/types.ts#L36)

Options for [useQueryRef](../functions/useQueryRef.md).

## Type declaration

### history?

> `optional` **history**: `"replace"` \| `"push"`

History strategy when updating the URL
- 'replace': replaceState (default)
- 'push': pushState

### adapter?

> `optional` **adapter**: [`QueryAdapter`](QueryAdapter.md)

Optional adapter override (e.g., Vue Router adapter)

### twoWay?

> `optional` **twoWay**: `boolean`

If true, also listen to browser/router navigations and rehydrate the ref from the URL.
Defaults to false

## Type Parameters

### T

`T`
