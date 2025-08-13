[**vue-qs v0.1.14**](../README.md)

***

[vue-qs](../README.md) / useQueryAdapter

# Function: useQueryAdapter()

> **useQueryAdapter**(): `undefined` \| [`QueryAdapter`](../type-aliases/QueryAdapter.md)

Defined in: [adapter-context.ts:45](https://github.com/iamsomraj/vue-qs/blob/8aef685f1768c68644b88f5fb0fb0e9ce5177572/src/adapter-context.ts#L45)

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
