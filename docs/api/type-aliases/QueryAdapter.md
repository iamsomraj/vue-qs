[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [types.ts:75](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L75)

## Methods

### getQuery()

> **getQuery**(): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [types.ts:77](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L77)

Read current query params as a plain object. Values are strings or undefined.

#### Returns

`Record`\<`string`, `string` \| `undefined`\>

***

### setQuery()

> **setQuery**(`next`, `options?`): `void`

Defined in: [types.ts:79](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L79)

Replace the query params, merging with existing by default.

#### Parameters

##### next

`Record`\<`string`, `string` \| `undefined`\>

##### options?

###### history?

`"replace"` \| `"push"`

#### Returns

`void`

***

### subscribe()?

> `optional` **subscribe**(`cb`): () => `void`

Defined in: [types.ts:87](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L87)

Optional: subscribe to external query changes (e.g., router nav, popstate).
Returns an unsubscribe. Not required by all adapters; if absent, callers can fallback to window popstate.

#### Parameters

##### cb

() => `void`

#### Returns

> (): `void`

##### Returns

`void`
