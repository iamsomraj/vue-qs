[**vue-qs v0.1.12**](../README.md)

***

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [types.ts:125](https://github.com/iamsomraj/vue-qs/blob/a939c826c3bc2f8d12b41c9e4a6ee1db94af81b0/src/types.ts#L125)

Abstraction for reading and writing query parameters

## Methods

### getCurrentQuery()

> **getCurrentQuery**(): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [types.ts:127](https://github.com/iamsomraj/vue-qs/blob/a939c826c3bc2f8d12b41c9e4a6ee1db94af81b0/src/types.ts#L127)

Read current query parameters as a plain object

#### Returns

`Record`\<`string`, `string` \| `undefined`\>

***

### updateQuery()

> **updateQuery**(`queryUpdates`, `options?`): `void`

Defined in: [types.ts:129](https://github.com/iamsomraj/vue-qs/blob/a939c826c3bc2f8d12b41c9e4a6ee1db94af81b0/src/types.ts#L129)

Update query parameters in the URL

#### Parameters

##### queryUpdates

`Record`\<`string`, `string` \| `undefined`\>

##### options?

###### historyStrategy?

`"replace"` \| `"push"`

#### Returns

`void`

***

### onQueryChange()?

> `optional` **onQueryChange**(`callback`): () => `void`

Defined in: [types.ts:134](https://github.com/iamsomraj/vue-qs/blob/a939c826c3bc2f8d12b41c9e4a6ee1db94af81b0/src/types.ts#L134)

Subscribe to external query changes (returns unsubscribe function)

#### Parameters

##### callback

() => `void`

#### Returns

> (): `void`

##### Returns

`void`
