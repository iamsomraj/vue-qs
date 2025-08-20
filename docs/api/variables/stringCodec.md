[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / stringCodec

# Variable: stringCodec

> `const` **stringCodec**: [`QueryCodec`](../type-aliases/QueryCodec.md)\<`string`\>

Defined in: [serializers.ts:15](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/serializers.ts#L15)

String codec for handling string values
Treats null/undefined as empty string

## Example

```ts
const name = queryRef('name', {
  defaultValue: '',
  codec: stringCodec
});
```
