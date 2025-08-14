[**vue-qs v0.1.14**](../README.md)

***

[vue-qs](../README.md) / QueryReactiveReturn

# Type Alias: QueryReactiveReturn\<TSchema\>

> **QueryReactiveReturn**\<`TSchema`\> = `object`

Defined in: [types.ts:98](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/types.ts#L98)

Return type from useQueryReactive composable

## Type Parameters

### TSchema

`TSchema` *extends* [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type

## Properties

### queryState

> **queryState**: [`ReactiveQueryState`](ReactiveQueryState.md)\<`TSchema`\>

Defined in: [types.ts:100](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/types.ts#L100)

Reactive state object with typed parameter values

## Methods

### updateBatch()

> **updateBatch**(`updates`, `options?`): `void`

Defined in: [types.ts:102](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/types.ts#L102)

Update multiple parameters in a single operation

#### Parameters

##### updates

`Partial`\<[`ReactiveQueryState`](ReactiveQueryState.md)\<`TSchema`\>\>

##### options?

[`QueryBatchUpdateOptions`](QueryBatchUpdateOptions.md)

#### Returns

`void`

***

### syncAllToUrl()

> **syncAllToUrl**(): `void`

Defined in: [types.ts:107](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/types.ts#L107)

Manually sync all current values to the URL

#### Returns

`void`
