[**vue-qs v0.1.14**](../README.md)

---

[vue-qs](../README.md) / HistoryAdapterResult

# Type Alias: HistoryAdapterResult

Defined in: [adapters/history-adapter.ts:21](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/adapters/history-adapter.ts#L21)

Type alias for the query adapter returned by `createHistoryAdapter`.

> **HistoryAdapterResult**: [`QueryAdapter`](../type-aliases/QueryAdapter.md)

## Deprecated

This type alias is maintained for backward compatibility. The `createHistoryAdapter` function now returns `QueryAdapter` directly instead of a wrapper object.

For new code, use `QueryAdapter` directly:

```typescript
// Current (recommended)
const adapter: QueryAdapter = createHistoryAdapter();

// Legacy (still supported)
const adapter: HistoryAdapterResult = createHistoryAdapter();
```
