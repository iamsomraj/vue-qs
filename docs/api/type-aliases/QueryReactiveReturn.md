[**vue-qs v0.1.15**](../README.md)

---

[vue-qs](../README.md) / QueryReactiveReturn

# Type Alias: QueryReactiveReturn\<TSchema\>

> **QueryReactiveReturn**\<`TSchema`\> = `object`

Defined in: [types.ts:98](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/types.ts#L98)

Return type from queryReactive composable

## Type Parameters

### TSchema

`TSchema` _extends_ [`QueryParameterSchema`](QueryParameterSchema.md)

The parameter schema type

## Properties

### queryState

> **queryState**: [`ReactiveQueryState`](ReactiveQueryState.md)\<`TSchema`\>

Defined in: [types.ts:100](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/types.ts#L100)

Reactive state object with typed parameter values

## Methods

### updateBatch()

> **updateBatch**(`updates`, `options?`): `void`

Defined in: [types.ts:102](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/types.ts#L102)

Update multiple parameters in a single operation

#### Parameters

##### updates

`Partial`\<[`ReactiveQueryState`](ReactiveQueryState.md)\<`TSchema`\>\>

##### options?

[`QueryBatchUpdateOptions`](QueryBatchUpdateOptions.md)

#### Returns

`void`

---

### syncAllToUrl()

> **syncAllToUrl**(): `void`

Defined in: [types.ts:107](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/types.ts#L107)

Manually sync all current values to the URL

#### Returns

`void`
