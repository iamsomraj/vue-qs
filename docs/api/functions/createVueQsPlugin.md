[**vue-qs v0.1.17**](../README.md)

***

[vue-qs](../README.md) / createVueQsPlugin

# Function: createVueQsPlugin()

> **createVueQsPlugin**(`options`): `object`

Defined in: [adapter-context.ts:81](https://github.com/iamsomraj/vue-qs/blob/b89690c4cfcb78328e659968e3c7235730988be4/src/adapter-context.ts#L81)

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
