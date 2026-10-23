---
description: '通过适配器将 vue-qs 连接到 Vue Router、Nuxt、浏览器 History API、测试环境或自定义数据源。'
---

# 适配器 {#adapters}

适配器负责将 vue-qs 连接到 URL。每个应用通过插件安装且只安装一个适配器：

```ts
import { createVueQs } from 'vue-qs';

app.use(createVueQs({ adapter }));
```

| 适配器                           | 导入路径                     | 适用场景                     |
| -------------------------------- | ---------------------------- | ---------------------------- |
| `createVueRouterAdapter(router)` | `vue-qs/adapters/vue-router` | 使用 Vue Router 的应用、Nuxt |
| `createHistoryAdapter()`         | `vue-qs/adapters/history`    | 不使用路由的应用             |
| `createTestingAdapter(options)`  | `vue-qs/adapters/testing`    | 单元测试                     |
| `createAdapter(adapter)`         | `vue-qs`                     | 其他任何场景                 |

如果没有安装适配器，组合式函数会抛出一个说明清晰的错误。

## Vue Router {#vue-router}

```ts
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';

const router = createRouter({ history: createWebHistory(), routes });

createApp(App)
  .use(router)
  .use(createVueQs({ adapter: createVueRouterAdapter(router) }))
  .mount('#app');
```

- 状态会跟随每一次导航：`router.push({ query })`、`<RouterLink>`、后退/前进。
- URL 更新通过 `router.replace` / `router.push` 完成，并保留当前的路径、params、
  hash 以及其他查询键。
- 导航守卫可以取消或重定向一次更新，此时状态会跟随最终的 URL。
- 通过 `parseAsNativeArrayOf` 支持重复的键（`?id=1&id=2`）。

## Nuxt {#nuxt}

Nuxt 使用 Vue Router，因此在插件中使用 Vue Router 适配器即可：

```ts
// plugins/vue-qs.ts
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createVueQs({ adapter: createVueRouterAdapter(useRouter()) }));
});
```

该插件在服务端会为每个请求单独运行，因此状态不会在请求之间共享。组合式函数在 SSR
期间读取请求的 URL，水合完成后再跟随客户端导航。

如需在服务端路由或中间件中读取查询参数，请使用
[`createLoader`](/guide/server#createloader)（英文）。

## History API {#history-api}

适用于不使用路由的应用：

```ts
import { createVueQs } from 'vue-qs';
import { createHistoryAdapter } from 'vue-qs/adapters/history';

app.use(createVueQs({ adapter: createHistoryAdapter() }));
```

- URL 更新使用 `history.replaceState` / `pushState`，并保留路径和 hash。
- 状态会跟随后退/前进（`popstate`），以及其他代码对 `pushState` / `replaceState` 的调用。
- 在服务端，查询参数为空。

## 为应用的一部分提供适配器 {#providing-an-adapter-to-part-of-the-app}

在父组件的 `setup` 中使用 `provideQueryAdapter`，或使用 `VueQsAdapter` 组件：

```vue
<script setup lang="ts">
import { VueQsAdapter } from 'vue-qs';
import { createHistoryAdapter } from 'vue-qs/adapters/history';

const adapter = createHistoryAdapter();
</script>

<template>
  <VueQsAdapter :adapter="adapter">
    <Widget />
  </VueQsAdapter>
</template>
```

## 在组件外使用组合式函数 {#using-composables-outside-components}

组合式函数需要注入上下文才能找到适配器。在 Pinia 的 setup store 中可以直接使用。
在其他地方，请使用 `app.runWithContext`，并配合 `effectScope` 在用完后停止监听：

```ts
const scope = effectScope();
const page = app.runWithContext(() =>
  scope.run(() => useQueryState('page', parseAsInteger.withDefault(1)))
);
// later
scope.stop();
```

## 自定义适配器 {#custom-adapters}

一个适配器需要实现三个函数：

```ts
import { createAdapter } from 'vue-qs';

const adapter = createAdapter({
  // Return the current search params (do not mutate them)
  getSearchParams: () => new URLSearchParams(myStore.search),
  // Write the new search params; may return a promise
  updateUrl: (search, { history, scroll, shallow }) => {
    myStore.navigate(`?${search}`, { replace: history === 'replace' });
  },
  // Call onChange when the URL changes from outside; return an unsubscribe function
  subscribe: (onChange) => myStore.onChange(onChange),
});
```

如果 URL 没有接受某次更新（例如导航守卫取消或重定向了它），请让 `updateUrl` 返回或
resolve `false`。组合式函数随后会重新读取 URL，而不是保留被拒绝的值。

设置可选的 `rateLimitFactor` 可以缩放节流延迟（`0` 表示禁用节流）。
