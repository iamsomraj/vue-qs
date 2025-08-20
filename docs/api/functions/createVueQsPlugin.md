[**vue-qs v0.1.18**](../README.md)

***

[vue-qs](../README.md) / createVueQsPlugin

# Function: createVueQsPlugin()

> **createVueQsPlugin**(`options`): `object`

Defined in: [adapter-context.ts:81](https://github.com/iamsomraj/vue-qs/blob/bdb41c8152865a4fb600c24be642289b5d115cbf/src/adapter-context.ts#L81)

Creates a Vue.js plugin for vue-qs that automatically provides the query adapter

## Parameters

### options

[`VueQueryPluginOptions`](../interfaces/VueQueryPluginOptions.md)

Plugin configuration options

## Returns

`object`

Vue plugin object

### install()

> **install**: (`app`) => `void`

#### Parameters

##### app

`App`

#### Returns

`void`

## Example

```typescript
import { createApp } from 'vue';
import { createVueQsPlugin, createHistoryAdapter } from 'vue-qs';

const app = createApp();
const historyAdapter = createHistoryAdapter();
const vueQueryPlugin = createVueQsPlugin({ queryAdapter: historyAdapter });

app.use(vueQueryPlugin);
```
