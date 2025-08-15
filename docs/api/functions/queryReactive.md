[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / queryReactive

# Function: queryReactive()

> **queryReactive**\<`TSchema`\>(`parameterSchema`, `options`): [`QueryReactiveReturn`](../type-aliases/QueryReactiveReturn.md)\<`TSchema`\>

Defined in: [composables/use-query-reactive.ts:76](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/composables/use-query-reactive.ts#L76)

Manages multiple query parameters as a single reactive object with URL synchronization

## Type Parameters

### TSchema

`TSchema` *extends* [`QueryParameterSchema`](../type-aliases/QueryParameterSchema.md)

The schema type defining all parameters

## Parameters

### parameterSchema

`TSchema`

Schema defining configuration for each parameter

### options

[`QueryReactiveOptions`](../type-aliases/QueryReactiveOptions.md) = `{}`

Global options for the reactive query state

## Returns

[`QueryReactiveReturn`](../type-aliases/QueryReactiveReturn.md)\<`TSchema`\>

Reactive state object with batch update and sync capabilities

## Example

```typescript
import { queryReactive, numberCodec, booleanCodec } from 'vue-qs';

const querySchema = {
  search: {
    defaultValue: '',
    shouldOmitDefault: true
  },
  page: {
    defaultValue: 1,
    codec: numberCodec
  },
  showDetails: {
    defaultValue: false,
    codec: booleanCodec
  },
} as const;

const { queryState, updateBatch, syncAllToUrl } = queryReactive(querySchema, {
  historyStrategy: 'replace'
});

// Access reactive values
console.log(queryState.search, queryState.page, queryState.showDetails);

// Update single values
queryState.search = 'hello';
queryState.page = 2;

// Batch update multiple values
updateBatch({
  search: 'world',
  page: 1
});

// Manual sync
syncAllToUrl();
```
