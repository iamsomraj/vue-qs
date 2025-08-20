[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / createHistoryAdapter

# Function: createHistoryAdapter()

> **createHistoryAdapter**(): [`QueryAdapter`](../type-aliases/QueryAdapter.md)

Defined in: [adapters/history-adapter.ts:32](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/adapters/history-adapter.ts#L32)

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
