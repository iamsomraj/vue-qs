[**vue-qs v0.1.12**](../README.md)

***

[vue-qs](../README.md) / useQueryAdapter

# Function: useQueryAdapter()

> **useQueryAdapter**(): `undefined` \| [`QueryAdapter`](../type-aliases/QueryAdapter.md)

Defined in: [adapter-context.ts:45](https://github.com/iamsomraj/vue-qs/blob/d83859c8f33bf2e18a7dd57e3cf216fcc2100466/src/adapter-context.ts#L45)

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
