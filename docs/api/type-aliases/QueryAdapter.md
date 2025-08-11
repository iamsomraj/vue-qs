[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [types.ts:86](https://github.com/iamsomraj/vue-qs/blob/378080a2660a9e11e7a8aeeb6d49a010f9b64ee4/src/types.ts#L86)

Abstraction over how to read/write query string values.

## Methods

### getQuery()

> **getQuery**(): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [types.ts:88](https://github.com/iamsomraj/vue-qs/blob/378080a2660a9e11e7a8aeeb6d49a010f9b64ee4/src/types.ts#L88)

Read current query params as a plain object. Values are strings or undefined.

#### Returns

`Record`\<`string`, `string` \| `undefined`\>

***

### setQuery()

> **setQuery**(`next`, `options?`): `void`

Defined in: [types.ts:90](https://github.com/iamsomraj/vue-qs/blob/378080a2660a9e11e7a8aeeb6d49a010f9b64ee4/src/types.ts#L90)

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

Defined in: [types.ts:98](https://github.com/iamsomraj/vue-qs/blob/378080a2660a9e11e7a8aeeb6d49a010f9b64ee4/src/types.ts#L98)

Optional: subscribe to external query changes (e.g., router nav, popstate).
Returns an unsubscribe. Not required by all adapters; if absent, callers can fallback to window popstate.

#### Parameters

##### cb

() => `void`

#### Returns

> (): `void`

##### Returns

`void`
