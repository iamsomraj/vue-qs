[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / QueryAdapter

# Type Alias: QueryAdapter

> **QueryAdapter** = `object`

Defined in: [types.ts:173](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L173)

Abstraction for reading and writing query parameters
This interface allows for different implementations (History API, Vue Router, etc.)

## Example

```ts
const adapter: QueryAdapter = {
  getCurrentQuery: () => ({ page: '1', search: 'test' }),
  updateQuery: (updates) => {
    // Update URL with new query parameters
  },
  isUpdating: () => false
};
```

## Methods

### getCurrentQuery()

> **getCurrentQuery**(): `Record`\<`string`, `string` \| `undefined`\>

Defined in: [types.ts:175](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L175)

Read current query parameters as a plain object

#### Returns

`Record`\<`string`, `string` \| `undefined`\>

***

### updateQuery()

> **updateQuery**(`queryUpdates`, `options?`): `void`

Defined in: [types.ts:177](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L177)

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

### isUpdating()?

> `optional` **isUpdating**(): `boolean`

Defined in: [types.ts:182](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L182)

Check if currently updating to prevent infinite loops

#### Returns

`boolean`
