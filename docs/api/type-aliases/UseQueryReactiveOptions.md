[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / UseQueryReactiveOptions

# Type Alias: UseQueryReactiveOptions

> **UseQueryReactiveOptions** = `object`

Defined in: [types.ts:74](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/types.ts#L74)

Options for [useQueryReactive](../functions/useQueryReactive.md).

## Properties

### history?

> `optional` **history**: `"replace"` \| `"push"`

Defined in: [types.ts:75](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/types.ts#L75)

***

### adapter?

> `optional` **adapter**: [`QueryAdapter`](QueryAdapter.md)

Defined in: [types.ts:76](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/types.ts#L76)

***

### twoWay?

> `optional` **twoWay**: `boolean`

Defined in: [types.ts:81](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/types.ts#L81)

If true, also listen to browser/router navigations and rehydrate the state from the URL.
Defaults to false
