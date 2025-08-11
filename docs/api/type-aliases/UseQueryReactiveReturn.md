[**vue-qs v0.1.7**](../README.md)

***

[vue-qs](../README.md) / UseQueryReactiveReturn

# Type Alias: UseQueryReactiveReturn\<TSchema\>

> **UseQueryReactiveReturn**\<`TSchema`\> = `object`

Defined in: [types.ts:52](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L52)

## Type Parameters

### TSchema

`TSchema` *extends* [`ParamSchema`](ParamSchema.md)

## Properties

### state

> **state**: `{ [K in keyof TSchema]: TSchema[K] extends ParamOption<infer T> ? T : never }`

Defined in: [types.ts:53](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L53)

## Methods

### batch()

> **batch**(`update`, `options?`): `void`

Defined in: [types.ts:57](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L57)

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

Defined in: [types.ts:62](https://github.com/iamsomraj/vue-qs/blob/ab438db5bb6a3e0a51e2435f962a383278df5579/src/types.ts#L62)

Immediately write the current state to the URL

#### Returns

`void`
