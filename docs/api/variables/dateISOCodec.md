[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / dateISOCodec

# Variable: dateISOCodec

> `const` **dateISOCodec**: [`QueryCodec`](../type-aliases/QueryCodec.md)\<`Date`\>

Defined in: [serializers.ts:112](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/serializers.ts#L112)

Date codec using ISO string format
Returns invalid Date for unparseable values

## Example

```ts
const date = queryRef('date', {
  defaultValue: new Date(),
  codec: dateISOCodec
});
```
