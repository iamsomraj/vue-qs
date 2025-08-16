[**vue-qs v0.1.17**](../README.md)

---

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [types.ts:121](https://github.com/iamsomraj/vue-qs/blob/b89690c4cfcb78328e659968e3c7235730988be4/src/types.ts#L121)

Abstraction for reading and writing query parameters

## Methods

### getCurrentQuery()

> **getCurrentQuery**(): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [types.ts:123](https://github.com/iamsomraj/vue-qs/blob/b89690c4cfcb78328e659968e3c7235730988be4/src/types.ts#L123)

Read current query parameters as a plain object

#### Returns

`Record`\<`string`, `string` \| `undefined`\>

---

### updateQuery()

> **updateQuery**(`queryUpdates`, `options?`): `void`

Defined in: [types.ts:125](https://github.com/iamsomraj/vue-qs/blob/b89690c4cfcb78328e659968e3c7235730988be4/src/types.ts#L125)

Update query parameters in the URL

#### Parameters

##### queryUpdates

`Record`\<`string`, `string` \| `undefined`\>

##### options?

###### historyStrategy?

`"replace"` \| `"push"`

#### Returns

`void`
