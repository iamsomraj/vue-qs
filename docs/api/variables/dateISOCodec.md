[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / dateISOCodec

# Variable: dateISOCodec

> `const` **dateISOCodec**: [`QueryCodec`](../type-aliases/QueryCodec.md)\<`Date`\>

Defined in: [serializers.ts:112](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/serializers.ts#L112)

Date codec using ISO string format
Returns invalid Date for unparseable values

## Example

```ts
const date = queryRef('date', {
  defaultValue: new Date(),
  codec: dateISOCodec
});
```
