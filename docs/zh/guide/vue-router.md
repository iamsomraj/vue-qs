# Vue Router 集成

使用基于路由的适配器更好地与应用整合。

## 钩子中传入适配器

```vue
<script setup lang="ts">
import { useQueryRef, useQueryReactive, createVueRouterQueryAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

const adapter = createVueRouterQueryAdapter(useRouter());

const page = useQueryRef<number>('page', {
  default: 1,
  codec: { parse: Number, serialize: String },
  adapter,
});
const { state } = useQueryReactive({ searchQuery: { default: '' } }, { adapter });
</script>
```

## 全局适配器（推荐）

```ts
// main.ts
import { createApp } from 'vue';
import { createVueQs, createVueRouterQueryAdapter } from 'vue-qs';
import { router } from './router';
import App from './App.vue';

createApp(App)
  .use(createVueQs({ adapter: createVueRouterQueryAdapter(router) }))
  .use(router)
  .mount('#app');
```
