[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / UseQueryRefOptions

# Type Alias: UseQueryRefOptions\<T\>

> **UseQueryRefOptions**\<`T`\> = [`ParamOption`](ParamOption.md)\<`T`\> & `object`

Defined in: [types.ts:31](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L31)

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

If true, also listen to window popstate and rehydrate the ref from the URL.
Defaults to false

## Type Parameters

### T

`T`
