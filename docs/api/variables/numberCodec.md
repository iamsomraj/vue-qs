[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / numberCodec

# Variable: numberCodec

> `const` **numberCodec**: [`QueryCodec`](../type-aliases/QueryCodec.md)\<`number`\>

Defined in: [serializers.ts:46](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/serializers.ts#L46)

Number codec for handling numeric values
Returns NaN for invalid numbers

## Example

```ts
const page = queryRef('page', {
  defaultValue: 1,
  codec: numberCodec
});
```
