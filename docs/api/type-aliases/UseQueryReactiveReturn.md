[**vue-qs v0.1.10**](../README.md)

***

[vue-qs](../README.md) / UseQueryReactiveReturn

# Type Alias: UseQueryReactiveReturn\<TSchema\>

> **UseQueryReactiveReturn**\<`TSchema`\> = `object`

Defined in: [types.ts:60](https://github.com/iamsomraj/vue-qs/blob/fa7480bd601b09f7ce1b80df8786e16589ef7fc2/src/types.ts#L60)

The return type from [useQueryReactive](../functions/useQueryReactive.md).

## Type Parameters

### TSchema

`TSchema` *extends* [`ParamSchema`](ParamSchema.md)

## Properties

### state

> **state**: `{ [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never }`

Defined in: [types.ts:62](https://github.com/iamsomraj/vue-qs/blob/fa7480bd601b09f7ce1b80df8786e16589ef7fc2/src/types.ts#L62)

Reactive object with typed values for each parameter in the schema.

## Methods

### batch()

> **batch**(`update`, `options?`): `void`

Defined in: [types.ts:66](https://github.com/iamsomraj/vue-qs/blob/fa7480bd601b09f7ce1b80df8786e16589ef7fc2/src/types.ts#L66)

Batch update multiple params in a single history entry.

#### Parameters

##### update

`Partial`\<`{ [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never }`\>

##### options?

###### history?

`"replace"` \| `"push"`

#### Returns

`void`

***

### sync()

> **sync**(): `void`

Defined in: [types.ts:71](https://github.com/iamsomraj/vue-qs/blob/fa7480bd601b09f7ce1b80df8786e16589ef7fc2/src/types.ts#L71)

Immediately write the current state to the URL

#### Returns

`void`
