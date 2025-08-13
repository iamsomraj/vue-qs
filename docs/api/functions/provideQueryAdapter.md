[**vue-qs v0.1.10**](../README.md)

***

[vue-qs](../README.md) / provideQueryAdapter

# Function: provideQueryAdapter()

> **provideQueryAdapter**(`queryAdapter`): `void`

Defined in: [adapterContext.ts:20](https://github.com/iamsomraj/vue-qs/blob/f1e1957b7183143713c387d3e0537e789055538e/src/adapterContext.ts#L20)

Provides a query adapter to the component tree using dependency injection
This makes the adapter available to all child components

## Parameters

### queryAdapter

[`QueryAdapter`](../type-aliases/QueryAdapter.md)

The query adapter instance to provide

## Returns

`void`

## Example

```typescript
import { provideQueryAdapter, createHistoryAdapter } from 'vue-qs';

// In a parent component
const historyAdapter = createHistoryAdapter();
provideQueryAdapter(historyAdapter);
```
