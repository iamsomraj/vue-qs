[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / UseQueryReactiveOptions

# Type Alias: UseQueryReactiveOptions

> **UseQueryReactiveOptions** = `object`

Defined in: [types.ts:75](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L75)

Options for [useQueryReactive](../functions/useQueryReactive.md).

## Properties

### history?

> `optional` **history**: `"replace"` \| `"push"`

Defined in: [types.ts:76](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L76)

***

### adapter?

> `optional` **adapter**: [`QueryAdapter`](QueryAdapter.md)

Defined in: [types.ts:77](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L77)

***

### twoWay?

> `optional` **twoWay**: `boolean`

Defined in: [types.ts:82](https://github.com/iamsomraj/vue-qs/blob/db1176155e4718a70dabfdac1aacf43d04432436/src/types.ts#L82)

If true, also listen to browser/router navigations and rehydrate the state from the URL.
Defaults to false
