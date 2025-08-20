[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / numberCodec

# Variable: numberCodec

> `const` **numberCodec**: [`QueryCodec`](../type-aliases/QueryCodec.md)\<`number`\>

Defined in: [serializers.ts:46](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/serializers.ts#L46)

Number codec for handling numeric values
Returns NaN for invalid numbers

## Example

```ts
const page = queryRef('page', {
  defaultValue: 1,
  codec: numberCodec
});
```
