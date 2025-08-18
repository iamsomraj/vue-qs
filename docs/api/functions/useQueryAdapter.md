[**vue-qs v0.1.18-beta.7**](../README.md)

***

[vue-qs](../README.md) / useQueryAdapter

# Function: useQueryAdapter()

> **useQueryAdapter**(): `undefined` \| [`QueryAdapter`](../type-aliases/QueryAdapter.md)

Defined in: [adapter-context.ts:46](https://github.com/iamsomraj/vue-qs/blob/ff60e1586d4655408e5c5a224bc4b63d54bf2fc1/src/adapter-context.ts#L46)

Retrieves the nearest provided query adapter from the component tree
Returns undefined if no adapter has been provided

## Returns

`undefined` \| [`QueryAdapter`](../type-aliases/QueryAdapter.md)

The injected query adapter or undefined

## Example

```typescript
import { useQueryAdapter } from 'vue-qs';

// In a child component
const queryAdapter = useQueryAdapter();
if (queryAdapter) {
  // Use the adapter
}
```
