[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / provideQueryAdapter

# Function: provideQueryAdapter()

> **provideQueryAdapter**(`queryAdapter`): `void`

Defined in: [adapter-context.ts:21](https://github.com/iamsomraj/vue-qs/blob/479c0d0dd04c282413431d3d2112e6dc9639b922/src/adapter-context.ts#L21)

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
