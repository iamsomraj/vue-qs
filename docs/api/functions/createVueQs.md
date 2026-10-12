[**vue-qs v0.2.0**](../README.md)

***

[vue-qs](../README.md) / createVueQs

# Function: createVueQs()

> **createVueQs**(`options`): `Plugin`

Defined in: [src/adapters/context.ts:33](https://github.com/iamsomraj/vue-qs/blob/23349c8cce02f08fa4001a6ecf89a59f59235ebe/src/adapters/context.ts#L33)

Creates the vue-qs plugin, providing an adapter to the whole app.

## Parameters

### options

[`VueQsPluginOptions`](../type-aliases/VueQsPluginOptions.md)

## Returns

`Plugin`

## Example

```ts
import { createVueQs } from 'vue-qs'
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router'

app.use(createVueQs({ adapter: createVueRouterAdapter(router) }))
```
