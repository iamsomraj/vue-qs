# Vue Router Integration

When using Vue Router, an adapter keeps your query refs/reactive state in sync with navigations and browser back/forward.

## Per‑hook adapter

Pass the adapter directly when you create refs / reactive objects.

```vue
<script setup lang="ts">
import { useQueryRef, useQueryReactive, createVueRouterQueryAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

const adapter = createVueRouterQueryAdapter(useRouter());

const page = useQueryRef('page', { default: 1, parse: Number, adapter });
const { state } = useQueryReactive({ q: { default: '' } }, { adapter });
</script>
```

## Global adapter (recommended)

Provide it once so every hook can auto‑detect it.

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

## Two‑way sync tip

Add `twoWay: true` if you want state to update when the user navigates (back/forward or programmatic pushes):

```ts
const page = useQueryRef('page', { default: 1, parse: Number, twoWay: true });
```
