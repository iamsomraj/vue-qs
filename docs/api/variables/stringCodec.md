[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / stringCodec

# Variable: stringCodec

> `const` **stringCodec**: [`QueryCodec`](../type-aliases/QueryCodec.md)\<`string`\>

Defined in: [serializers.ts:15](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/serializers.ts#L15)

String codec for handling string values
Treats null/undefined as empty string

## Example

```ts
const name = queryRef('name', {
  defaultValue: '',
  codec: stringCodec
});
```
