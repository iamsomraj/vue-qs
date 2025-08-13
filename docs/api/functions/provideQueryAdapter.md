[**vue-qs v0.1.14**](../README.md)

***

[vue-qs](../README.md) / provideQueryAdapter

# Function: provideQueryAdapter()

> **provideQueryAdapter**(`queryAdapter`): `void`

Defined in: [adapter-context.ts:20](https://github.com/iamsomraj/vue-qs/blob/8aef685f1768c68644b88f5fb0fb0e9ce5177572/src/adapter-context.ts#L20)

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
