[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / QueryReactiveOptions

# Type Alias: QueryReactiveOptions

> **QueryReactiveOptions** = `object`

Defined in: [types.ts:152](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/types.ts#L152)

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

Defined in: [types.ts:154](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/types.ts#L154)

History strategy when updating the URL

***

### queryAdapter?

> `optional` **queryAdapter**: [`QueryAdapter`](QueryAdapter.md)

Defined in: [types.ts:156](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/types.ts#L156)

Optional custom query adapter to use
