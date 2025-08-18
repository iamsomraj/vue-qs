[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / queryReactive

# Function: queryReactive()

> **queryReactive**\<`TSchema`\>(`parameterSchema`, `options`): [`QueryReactiveReturn`](../type-aliases/QueryReactiveReturn.md)\<`TSchema`\>

Defined in: [composables/use-query-reactive.ts:71](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/composables/use-query-reactive.ts#L71)

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

Reactive state object that stays in sync with the URL

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

const queryState = queryReactive(querySchema, {
  historyStrategy: 'replace'
});

// Access reactive values
console.log(queryState.search, queryState.page, queryState.showDetails);

// Update values
queryState.search = 'hello';
queryState.page = 2;
```
