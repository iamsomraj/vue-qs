---
description: '安装 vue-qs，使用 useQueryState 和 useQueryStates 将 Vue 3 状态保存在 URL 中：可写 ref、类型化解析器，并支持 v-model。'
---

# 快速开始 {#getting-started}

vue-qs 是一个类型安全的 Vue 3 URL 查询参数状态管理库。它是
[nuqs](https://nuqs.dev) 的 Vue 移植版本：解析器、选项和行为与 nuqs 相同，
并以可写 ref 和响应式对象的形式提供。

```ts
const page = useQueryState('page', parseAsInteger.withDefault(1));
page.value++; // ?page=2
```

::: tip 在线体验
打开 [StackBlitz 上的演练场](https://stackblitz.com/github/iamsomraj/vue-qs/tree/main/examples/vite-vue-router)：
一个 Vite + Vue Router 应用，搜索、排序、分页和标签页都保存在 URL 中。
:::

## 安装 {#installation}

::: code-group

```sh [npm]
npm install vue-qs
```

```sh [pnpm]
pnpm add vue-qs
```

```sh [bun]
bun add vue-qs
```

:::

需要 Vue 3.3+。`vue-router`（4.2+ 或 5）是可选的 peer 依赖。

## 安装插件 {#install-the-plugin}

vue-qs 通过**适配器**读写 URL。根据你的应用选择对应的适配器并安装插件：

::: code-group

```ts [Vue Router]
import { createApp } from 'vue';
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';
import { router } from './router';

createApp(App)
  .use(router)
  .use(createVueQs({ adapter: createVueRouterAdapter(router) }))
  .mount('#app');
```

```ts [不使用路由]
import { createApp } from 'vue';
import { createVueQs } from 'vue-qs';
import { createHistoryAdapter } from 'vue-qs/adapters/history';

createApp(App)
  .use(createVueQs({ adapter: createHistoryAdapter() }))
  .mount('#app');
```

:::

使用 Nuxt？请参阅 [适配器 → Nuxt](./adapters#nuxt)。

## 第一个查询状态 {#your-first-query-state}

```vue
<script setup lang="ts">
import { useQueryState } from 'vue-qs';

const name = useQueryState('name'); // Ref<string | null>
</script>

<template>
  <input v-model="name" placeholder="Your name" />
  <p>Hello, {{ name || 'anonymous visitor' }}!</p>
  <button @click="name = null">Clear</button>
</template>
```

在输入框中输入内容会更新 URL 中的 `?name=…`，浏览器的后退/前进也会同步更新输入框。

## 使用解析器获得类型化状态 {#typed-state-with-parsers}

不传解析器时，状态的类型是 `string | null`。传入一个[解析器](./parsers)即可获得类型化状态，
再调用 `.withDefault()` 去掉 `null`：

```ts
import { parseAsBoolean, parseAsInteger, useQueryState } from 'vue-qs';

const page = useQueryState('page', parseAsInteger.withDefault(1)); // Ref<number>
const open = useQueryState('open', parseAsBoolean); // Ref<boolean | null>
```

当键不存在或其值无效时，状态会回退到默认值。将状态设置为默认值（或 `null`）会从 URL
中移除该键。

## 更新状态 {#updating-state}

直接赋值 `.value`，或者调用 `.set()` 来传入[选项](/guide/options)或等待 URL 更新完成：

```ts
page.value = 2;

await page.set((current) => current + 1); // updater function
await page.set(3, { history: 'push' }); // add a history entry
await page.set(null); // remove ?page (page.value === 1)

const search = await page.set(4); // URLSearchParams after the update
```

同一个 tick 内的多次更新会被[合并](/guide/options#batching)为一次 URL 更新。

## 同时管理多个键 {#several-keys-at-once}

`useQueryStates` 将多个键绑定到同一个响应式对象：

```vue
<script setup lang="ts">
import { toRefs } from 'vue';
import { parseAsFloat, useQueryStates } from 'vue-qs';

const coordinates = useQueryStates({
  lat: parseAsFloat.withDefault(45.18),
  lng: parseAsFloat.withDefault(5.72),
});

const { lat, lng } = toRefs(coordinates); // writable refs, for v-model

function reset() {
  coordinates.$set(null); // removes both keys in one update
}
</script>

<template>
  <input v-model.number="lat" type="number" />
  <input v-model.number="lng" type="number" />
</template>
```

## 下一步 {#next-steps}

- [解析器](./parsers)：所有内置解析器，以及如何编写自定义解析器
- [选项](/guide/options)（英文）：history、scroll、批量更新、节流和防抖
- [适配器](./adapters)：Vue Router、Nuxt、原生 History API、自定义适配器
- [服务端](/guide/server)（英文）：`createLoader` 和 `createSerializer`
- [测试](/guide/testing)（英文）：为使用 vue-qs 的组件编写单元测试
- [从 0.1.x 迁移](./migration)
- [StackBlitz 演练场](https://stackblitz.com/github/iamsomraj/vue-qs/tree/main/examples/vite-vue-router)：可直接运行的 Vite + Vue Router 示例
