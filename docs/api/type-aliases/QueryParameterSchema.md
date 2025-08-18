[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / QueryParameterSchema

# Type Alias: QueryParameterSchema

> **QueryParameterSchema** = `Record`\<`string`, [`QueryParameterOptions`](QueryParameterOptions.md)\<`any`\>\>

Defined in: [types.ts:90](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/types.ts#L90)

Schema defining multiple query parameters with their configurations

## Example

```ts
const schema: QueryParameterSchema = {
  search: { defaultValue: '' },
  page: { defaultValue: 1, codec: numberCodec },
  filters: { defaultValue: {}, codec: jsonCodec }
};
```
