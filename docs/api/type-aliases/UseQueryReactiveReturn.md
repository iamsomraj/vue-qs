[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / UseQueryReactiveReturn

# Type Alias: UseQueryReactiveReturn\<TSchema\>

> **UseQueryReactiveReturn**\<`TSchema`\> = `object`

Defined in: [types.ts:59](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/types.ts#L59)

The return type from [useQueryReactive](../functions/useQueryReactive.md).

## Type Parameters

### TSchema

`TSchema` *extends* [`ParamSchema`](ParamSchema.md)

## Properties

### state

> **state**: `{ [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never }`

Defined in: [types.ts:61](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/types.ts#L61)

Reactive object with typed values for each parameter in the schema.

## Methods

### batch()

> **batch**(`update`, `options?`): `void`

Defined in: [types.ts:65](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/types.ts#L65)

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

Defined in: [types.ts:70](https://github.com/iamsomraj/vue-qs/blob/8dd8b9116f5f79adc1bc1b23a2ea361a3c83a0ab/src/types.ts#L70)

Immediately write the current state to the URL

#### Returns

`void`
