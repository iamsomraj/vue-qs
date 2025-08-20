[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / createHistoryAdapter

# Function: createHistoryAdapter()

> **createHistoryAdapter**(): [`QueryAdapter`](../type-aliases/QueryAdapter.md)

Defined in: [adapters/history-adapter.ts:32](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/adapters/history-adapter.ts#L32)

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
