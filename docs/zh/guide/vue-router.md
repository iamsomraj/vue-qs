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
const page = useQueryRef('page', { defaultValue: 1, parseFunction: Number });
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

内部使用 `router.afterEach` 监听路由变化，自动更新已经创建的 query refs/reactive 对象；同时对本地修改进行 `router.replace`（不新增历史记录）。

如果你在一次交互中希望合并多次修改到同一条历史记录，可用 `updateBatch(() => { /* 多次改 queryState */ })`。
