[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / QueryReactiveOptions

# Type Alias: QueryReactiveOptions

> **QueryReactiveOptions** = `object`

Defined in: [types.ts:152](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L152)

Options for queryReactive composable

## Example

```ts
const options: QueryReactiveOptions = {
  historyStrategy: 'replace',
  queryAdapter: customAdapter
};
```

## Properties

### historyStrategy?

> `optional` **historyStrategy**: `"replace"` \| `"push"`

Defined in: [types.ts:154](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L154)

History strategy when updating the URL

***

### queryAdapter?

> `optional` **queryAdapter**: [`QueryAdapter`](QueryAdapter.md)

Defined in: [types.ts:156](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L156)

Optional custom query adapter to use
