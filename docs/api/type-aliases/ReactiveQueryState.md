[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / ReactiveQueryState

# Type Alias: ReactiveQueryState\<TSchema\>

> **ReactiveQueryState**\<`TSchema`\> = `{ [K in keyof TSchema]: TSchema[K] extends QueryParameterOptions<infer T> ? T : never }`

Defined in: [types.ts:80](https://github.com/iamsomraj/vue-qs/blob/2515abe5c25afff0f87351153aa1684c958bdf3f/src/types.ts#L80)

Reactive state object for queryReactive

## Type Parameters

### TSchema

`TSchema` *extends* [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type
