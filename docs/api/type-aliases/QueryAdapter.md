[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [types.ts:85](https://github.com/iamsomraj/vue-qs/blob/b9909ff029be0e52ce297bc89945187d8e2b539f/src/types.ts#L85)

Abstraction over how to read/write query string values.

## Methods

### getQuery()

> **getQuery**(): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [types.ts:87](https://github.com/iamsomraj/vue-qs/blob/b9909ff029be0e52ce297bc89945187d8e2b539f/src/types.ts#L87)

Read current query params as a plain object. Values are strings or undefined.

#### Returns

`Record`\<`string`, `string` \| `undefined`\>

***

### setQuery()

> **setQuery**(`next`, `options?`): `void`

Defined in: [types.ts:89](https://github.com/iamsomraj/vue-qs/blob/b9909ff029be0e52ce297bc89945187d8e2b539f/src/types.ts#L89)

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

Defined in: [types.ts:97](https://github.com/iamsomraj/vue-qs/blob/b9909ff029be0e52ce297bc89945187d8e2b539f/src/types.ts#L97)

Optional: subscribe to external query changes (e.g., router nav, popstate).
Returns an unsubscribe. Not required by all adapters; if absent, callers can fallback to window popstate.

#### Parameters

##### cb

() => `void`

#### Returns

> (): `void`

##### Returns

`void`
