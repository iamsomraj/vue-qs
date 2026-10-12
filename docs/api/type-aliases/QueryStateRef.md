[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / QueryStateRef

# Type Alias: QueryStateRef\<T\>

> **QueryStateRef**\<`T`\> = `Ref`\<`T`\> & `object`

Defined in: [src/composables/use-query-state.ts:23](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/composables/use-query-state.ts#L23)

A writable ref bound to a URL query key.

Assign `.value` (or use `v-model`) to update the URL, or call `.set()`
to pass options and await the URL update.

## Type declaration

### set()

> **set**(`value`, `options?`): `Promise`\<`URLSearchParams`\>

Updates the state and queues a URL update.
Pass `null` to remove the key (the state falls back to the default value).

#### Parameters

##### value

[`SetQueryStateValue`](SetQueryStateValue.md)\<`T`\>

##### options?

[`Options`](Options.md)

#### Returns

`Promise`\<`URLSearchParams`\>

The search params once written to the URL

## Type Parameters

### T

`T`
