[**vue-qs v0.1.12**](../README.md)

***

[vue-qs](../README.md) / useQueryReactive

# Function: useQueryReactive()

> **useQueryReactive**\<`TSchema`\>(`parameterSchema`, `options`): [`QueryReactiveReturn`](../type-aliases/QueryReactiveReturn.md)\<`TSchema`\>

Defined in: [composables/use-query-reactive.ts:81](https://github.com/iamsomraj/vue-qs/blob/a939c826c3bc2f8d12b41c9e4a6ee1db94af81b0/src/composables/use-query-reactive.ts#L81)

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

[`UseQueryReactiveOptions`](../type-aliases/UseQueryReactiveOptions.md) = `{}`

Global options for the reactive query state

## Returns

[`QueryReactiveReturn`](../type-aliases/QueryReactiveReturn.md)\<`TSchema`\>

Reactive state object with batch update and sync capabilities

## Example

```typescript
import { useQueryReactive, numberCodec, booleanCodec } from 'vue-qs';

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

const { queryState, updateBatch, syncAllToUrl } = useQueryReactive(querySchema, {
  enableTwoWaySync: true,
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
