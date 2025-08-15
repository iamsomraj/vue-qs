[**vue-qs v0.1.16-beta.0**](../README.md)

***

[vue-qs](../README.md) / createHistoryAdapter

# Function: createHistoryAdapter()

> **createHistoryAdapter**(): [`QueryAdapter`](../type-aliases/QueryAdapter.md)

Defined in: [adapters/history-adapter.ts:32](https://github.com/iamsomraj/vue-qs/blob/be7516ef29a864f0946d1401d2afac5cf37a73b9/src/adapters/history-adapter.ts#L32)

Creates a query adapter that uses the browser's History API for URL parameters

## Returns

[`QueryAdapter`](../type-aliases/QueryAdapter.md)

Query adapter instance

## Example

```typescript
import { createHistoryAdapter } from 'vue-qs';

const queryAdapter = createHistoryAdapter();

// Use with the plugin
app.use(createVueQsPlugin({ queryAdapter }));
```
