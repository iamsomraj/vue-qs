[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / QueryRefOptions

# Type Alias: QueryRefOptions\<T\>

> **QueryRefOptions**\<`T`\> = [`QueryParameterOptions`](QueryParameterOptions.md)\<`T`\> & `object`

Defined in: [types.ts:105](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L105)

Options for queryRef composable

## Type declaration

### historyStrategy?

> `optional` **historyStrategy**: `"replace"` \| `"push"`

History strategy when updating the URL ('replace' | 'push')

### queryAdapter?

> `optional` **queryAdapter**: [`QueryAdapter`](QueryAdapter.md)

Optional custom query adapter to use

## Type Parameters

### T

`T`

The type of the query parameter value

## Example

```ts
const options: QueryRefOptions<number> = {
  defaultValue: 1,
  codec: numberCodec,
  historyStrategy: 'replace',
  shouldOmitDefault: true
};
```
