[**vue-qs v0.1.9**](../README.md)

***

[vue-qs](../README.md) / useQueryReactive

# Function: useQueryReactive()

> **useQueryReactive**\<`TSchema`\>(`schema`, `options`): [`UseQueryReactiveReturn`](../type-aliases/UseQueryReactiveReturn.md)\<`TSchema`\>

Defined in: [useQueryReactive.ts:21](https://github.com/iamsomraj/vue-qs/blob/45dc30a366c9ea66c571cd99d51f1943495f1e56/src/useQueryReactive.ts#L21)

Manage multiple query parameters as a single reactive object.
Keeps the URL in sync as any field changes; optionally syncs URL -> state.

## Type Parameters

### TSchema

`TSchema` *extends* [`ParamSchema`](../type-aliases/ParamSchema.md)

## Parameters

### schema

`TSchema`

### options

[`UseQueryReactiveOptions`](../type-aliases/UseQueryReactiveOptions.md) = `{}`

## Returns

[`UseQueryReactiveReturn`](../type-aliases/UseQueryReactiveReturn.md)\<`TSchema`\>
