# Vue Router Integration

Use the router-backed adapter for first-class integration.

## Per-hook adapter

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
const { state } = useQueryReactive({ q: { default: '' } }, { adapter });
</script>
```

## Global adapter (recommended)

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
