[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [types.ts:121](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/types.ts#L121)

Abstraction for reading and writing query parameters

## Methods

### getCurrentQuery()

> **getCurrentQuery**(): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [types.ts:123](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/types.ts#L123)

Read current query parameters as a plain object

#### Returns

`Record`\<`string`, `string` \| `undefined`\>

***

### updateQuery()

> **updateQuery**(`queryUpdates`, `options?`): `void`

Defined in: [types.ts:125](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/types.ts#L125)

Update query parameters in the URL

#### Parameters

##### queryUpdates

`Record`\<`string`, `string` \| `undefined`\>

##### options?

###### historyStrategy?

`"replace"` \| `"push"`

#### Returns

`void`
