[**vue-qs v0.1.14**](../README.md)

***

[vue-qs](../README.md) / createVueRouterAdapter

# Function: createVueRouterAdapter()

> **createVueRouterAdapter**(`vueRouter`, `options`): [`QueryAdapter`](../type-aliases/QueryAdapter.md)

Defined in: [adapters/vue-router-adapter.ts:32](https://github.com/iamsomraj/vue-qs/blob/33788ce453ede405848f8283c5f38c6323ad5403/src/adapters/vue-router-adapter.ts#L32)

Creates a query adapter that integrates with Vue Router
This adapter reads and writes query parameters through Vue Router's API

## Parameters

### vueRouter

`Router`

The Vue Router instance to integrate with

### options

[`VueRouterAdapterOptions`](../interfaces/VueRouterAdapterOptions.md) = `{}`

Configuration options for the adapter

## Returns

[`QueryAdapter`](../type-aliases/QueryAdapter.md)

QueryAdapter that works with Vue Router

## Example

```typescript
import { createRouter } from 'vue-router';
import { createVueRouterAdapter } from 'vue-qs';

const router = createRouter({ ... });
const routerAdapter = createVueRouterAdapter(router);

// Use with the plugin
app.use(createVueQsPlugin({ queryAdapter: routerAdapter }));
```
