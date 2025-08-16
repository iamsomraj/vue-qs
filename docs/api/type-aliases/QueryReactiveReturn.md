[**vue-qs v0.1.17**](../README.md)

***

[vue-qs](../README.md) / QueryReactiveReturn

# Type Alias: QueryReactiveReturn\<TSchema\>

> **QueryReactiveReturn**\<`TSchema`\> = `object`

Defined in: [types.ts:96](https://github.com/iamsomraj/vue-qs/blob/b89690c4cfcb78328e659968e3c7235730988be4/src/types.ts#L96)

Return type from queryReactive composable

## Type Parameters

### TSchema

`TSchema` *extends* [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type

## Properties

### queryState

> **queryState**: [`ReactiveQueryState`](ReactiveQueryState.md)\<`TSchema`\>

Defined in: [types.ts:98](https://github.com/iamsomraj/vue-qs/blob/b89690c4cfcb78328e659968e3c7235730988be4/src/types.ts#L98)

Reactive state object with typed parameter values

## Methods

### updateBatch()

> **updateBatch**(`updates`, `options?`): `void`

Defined in: [types.ts:100](https://github.com/iamsomraj/vue-qs/blob/b89690c4cfcb78328e659968e3c7235730988be4/src/types.ts#L100)

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

Defined in: [types.ts:105](https://github.com/iamsomraj/vue-qs/blob/b89690c4cfcb78328e659968e3c7235730988be4/src/types.ts#L105)

Manually sync all current values to the URL

#### Returns

`void`
