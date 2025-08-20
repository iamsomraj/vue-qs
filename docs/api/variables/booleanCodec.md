[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / booleanCodec

# Variable: booleanCodec

> `const` **booleanCodec**: [`QueryCodec`](../type-aliases/QueryCodec.md)\<`boolean`\>

Defined in: [serializers.ts:81](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/serializers.ts#L81)

Boolean codec for handling boolean values
Treats 'true' and '1' as true, everything else as false

## Example

```ts
const isActive = queryRef('active', {
  defaultValue: false,
  codec: booleanCodec
});
```
