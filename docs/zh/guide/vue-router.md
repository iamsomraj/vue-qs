# 配合 vue-router

当使用 `vue-router` 时，可以让查询参数与当前路由对象保持一致（支持前进/后退、导航守卫等）。

## 全局安装（推荐）

最简单：把 router 传给 `createVueQsPlugin` 并配置适配器。

```ts
// main.ts
import { createApp } from 'vue';
import { createVueQsPlugin, createVueRouterAdapter } from 'vue-qs';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

createApp(App)
  .use(router)
  .use(createVueQsPlugin({ queryAdapter: createVueRouterAdapter(router) }))
  .mount('#app');
```

之后你就可以直接：

```ts
const page = queryRef('page', { defaultValue: 1, parse: Number });
```

## 局部注入

只在某个组件子树内使用路由适配器：

```ts
import { createVueRouterAdapter, provideQueryAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

const adapter = createVueRouterAdapter(useRouter());
provideQueryAdapter(adapter);
```

## 同步行为

内部对本地修改进行 `router.replace`（不新增历史记录）。

使用 Vue Router 能让你的路由导航时页面状态自动同步。
