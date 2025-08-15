[**vue-qs v0.1.15**](../README.md)

---

[vue-qs](../README.md) / ReactiveQueryState

# Type Alias: ReactiveQueryState\<TSchema\>

> **ReactiveQueryState**\<`TSchema`\> = `{ [K in keyof TSchema]: TSchema[K] extends QueryParameterOptions<infer T> ? T : never }`

Defined in: [types.ts:82](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/types.ts#L82)

Reactive state object for queryReactive

## Type Parameters

### TSchema

`TSchema` _extends_ [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type
