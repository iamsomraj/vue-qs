[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / QueryParameterSchema

# Type Alias: QueryParameterSchema

> **QueryParameterSchema** = `Record`\<`string`, [`QueryParameterOptions`](QueryParameterOptions.md)\<`any`\>\>

Defined in: [types.ts:90](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L90)

Schema defining multiple query parameters with their configurations

## Example

```ts
const schema: QueryParameterSchema = {
  search: { defaultValue: '' },
  page: { defaultValue: 1, codec: numberCodec },
  filters: { defaultValue: {}, codec: jsonCodec }
};
```
