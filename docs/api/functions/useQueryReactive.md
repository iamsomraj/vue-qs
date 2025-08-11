[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / useQueryReactive

# Function: useQueryReactive()

> **useQueryReactive**\<`TSchema`\>(`schema`, `options`): [`UseQueryReactiveReturn`](../type-aliases/UseQueryReactiveReturn.md)\<`TSchema`\>

Defined in: [useQueryReactive.ts:21](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/useQueryReactive.ts#L21)

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
