[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / ReactiveQueryState

# Type Alias: ReactiveQueryState\<TSchema\>

> **ReactiveQueryState**\<`TSchema`\> = `{ [K in keyof TSchema]: TSchema[K] extends QueryParameterOptions<infer T> ? T : never }`

Defined in: [types.ts:132](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/types.ts#L132)

Reactive state object for queryReactive

## Type Parameters

### TSchema

`TSchema` *extends* [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type

## Example

```ts
const schema = {
  search: { defaultValue: '' },
  page: { defaultValue: 1 }
} as const;

type State = ReactiveQueryState<typeof schema>;
// State = { search: string; page: number }
```
