[**vue-qs v0.1.16-beta.0**](../README.md)

***

[vue-qs](../README.md) / ReactiveQueryState

# Type Alias: ReactiveQueryState\<TSchema\>

> **ReactiveQueryState**\<`TSchema`\> = `{ [K in keyof TSchema]: TSchema[K] extends QueryParameterOptions<infer T> ? T : never }`

Defined in: [types.ts:80](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/types.ts#L80)

Reactive state object for queryReactive

## Type Parameters

### TSchema

`TSchema` *extends* [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type
