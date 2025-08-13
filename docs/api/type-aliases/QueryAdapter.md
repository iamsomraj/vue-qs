[**vue-qs v0.1.13**](../README.md)

***

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [types.ts:125](https://github.com/iamsomraj/vue-qs/blob/a4643e0077390aa3ef25224e2e3a0792449f830c/src/types.ts#L125)

Abstraction for reading and writing query parameters

## Methods

### getCurrentQuery()

> **getCurrentQuery**(): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [types.ts:127](https://github.com/iamsomraj/vue-qs/blob/a4643e0077390aa3ef25224e2e3a0792449f830c/src/types.ts#L127)

Read current query parameters as a plain object

#### Returns

`Record`\<`string`, `string` \| `undefined`\>

***

### updateQuery()

> **updateQuery**(`queryUpdates`, `options?`): `void`

Defined in: [types.ts:129](https://github.com/iamsomraj/vue-qs/blob/a4643e0077390aa3ef25224e2e3a0792449f830c/src/types.ts#L129)

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

Defined in: [types.ts:134](https://github.com/iamsomraj/vue-qs/blob/a4643e0077390aa3ef25224e2e3a0792449f830c/src/types.ts#L134)

Subscribe to external query changes (returns unsubscribe function)

#### Parameters

##### callback

() => `void`

#### Returns

> (): `void`

##### Returns

`void`
