[**vue-qs v0.1.14**](../README.md)

***

[vue-qs](../README.md) / ReactiveQueryState

# Type Alias: ReactiveQueryState\<TSchema\>

> **ReactiveQueryState**\<`TSchema`\> = `{ [K in keyof TSchema]: TSchema[K] extends QueryParameterOptions<infer T> ? T : never }`

Defined in: [types.ts:82](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/types.ts#L82)

Reactive state object for useQueryReactive

## Type Parameters

### TSchema

`TSchema` *extends* [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type
