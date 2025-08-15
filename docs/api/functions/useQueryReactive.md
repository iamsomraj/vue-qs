[**vue-qs v0.1.15**](../README.md)

---

[vue-qs](../README.md) / queryReactive

# Function: queryReactive()

> **queryReactive**\<`TSchema`\>(`parameterSchema`, `options`): [`QueryReactiveReturn`](../type-aliases/QueryReactiveReturn.md)\<`TSchema`\>

Defined in: [composables/use-query-reactive.ts:77](https://github.com/iamsomraj/vue-qs/blob/c6723d94881f5a2550faa61b4e51be4507991c23/src/composables/use-query-reactive.ts#L77)

Manages multiple query parameters as a single reactive object with URL synchronization

## Type Parameters

### TSchema

`TSchema` _extends_ [`QueryParameterSchema`](../type-aliases/QueryParameterSchema.md)

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
    shouldOmitDefault: true,
  },
  page: {
    defaultValue: 1,
    codec: numberCodec,
  },
  showDetails: {
    defaultValue: false,
    codec: booleanCodec,
  },
} as const;

const { queryState, updateBatch, syncAllToUrl } = queryReactive(querySchema, {
  enableTwoWaySync: true,
  historyStrategy: 'replace',
});

// Access reactive values
console.log(queryState.search, queryState.page, queryState.showDetails);

// Update single values
queryState.search = 'hello';
queryState.page = 2;

// Batch update multiple values
updateBatch({
  search: 'world',
  page: 1,
});

// Manual sync
syncAllToUrl();
```
