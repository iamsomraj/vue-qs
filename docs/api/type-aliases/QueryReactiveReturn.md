[**vue-qs v0.1.16-beta.0**](../README.md)

***

[vue-qs](../README.md) / QueryReactiveReturn

# Type Alias: QueryReactiveReturn\<TSchema\>

> **QueryReactiveReturn**\<`TSchema`\> = `object`

Defined in: [types.ts:96](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/types.ts#L96)

Return type from queryReactive composable

## Type Parameters

### TSchema

`TSchema` *extends* [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type

## Properties

### queryState

> **queryState**: [`ReactiveQueryState`](ReactiveQueryState.md)\<`TSchema`\>

Defined in: [types.ts:98](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/types.ts#L98)

Reactive state object with typed parameter values

## Methods

### updateBatch()

> **updateBatch**(`updates`, `options?`): `void`

Defined in: [types.ts:100](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/types.ts#L100)

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

Defined in: [types.ts:105](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/types.ts#L105)

Manually sync all current values to the URL

#### Returns

`void`
