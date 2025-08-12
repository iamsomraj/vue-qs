[**vue-qs v0.1.10**](../README.md)

***

[vue-qs](../README.md) / useQueryReactive

# Function: useQueryReactive()

> **useQueryReactive**\<`TSchema`\>(`schema`, `options`): [`UseQueryReactiveReturn`](../type-aliases/UseQueryReactiveReturn.md)\<`TSchema`\>

Defined in: [useQueryReactive.ts:28](https://github.com/iamsomraj/vue-qs/blob/fa7480bd601b09f7ce1b80df8786e16589ef7fc2/src/useQueryReactive.ts#L28)

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
