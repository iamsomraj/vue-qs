[**vue-qs v0.1.15**](../README.md)

***

[vue-qs](../README.md) / createHistoryAdapter

# Function: createHistoryAdapter()

> **createHistoryAdapter**(`options`): [`QueryAdapter`](../type-aliases/QueryAdapter.md)

Defined in: [adapters/history-adapter.ts:39](https://github.com/iamsomraj/vue-qs/blob/2515abe5c25afff0f87351153aa1684c958bdf3f/src/adapters/history-adapter.ts#L39)

Creates a query adapter that uses the browser's History API for URL parameters

## Parameters

### options

[`HistoryAdapterOptions`](../interfaces/HistoryAdapterOptions.md) = `{}`

Configuration options for the adapter

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
